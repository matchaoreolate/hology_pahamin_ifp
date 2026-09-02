"""
Image Generation Client & Provider Handlers.

Supports:
- Gemini Image Generation (gemini-2.5-flash-image, gemini-3.1-flash-image)
- HuggingFace Inference API (with automatic fallback to Gemini)
"""
import asyncio
import io
from app.core.config import settings
from app.core.logging import get_logger

logger = get_logger(__name__)


async def generate_image_bytes(prompt: str) -> bytes | None:
    """
    Attempt to generate image bytes using the configured provider.
    Returns raw PNG bytes on success, None on failure.

    Provider is selected via IMAGE_GENERATION_PROVIDER:
      "gemini"      (default) — Gemini Flash Image models
      "huggingface"           — HuggingFace Inference API (with Gemini fallback)
    """
    provider = settings.IMAGE_GENERATION_PROVIDER.lower()

    if provider == "huggingface":
        try:
            return await _try_huggingface(prompt)
        except Exception as e:
            logger.warning("HuggingFace image gen failed, falling back to Gemini", error=str(e))

    # Gemini image generation
    try:
        return await _try_gemini_image(prompt)
    except Exception as e:
        logger.warning("Gemini image gen failed", error=str(e))

    return None


async def _try_gemini_image(prompt: str) -> bytes:
    """Generate image bytes via Google Gemini image generation REST endpoint."""
    import base64
    import httpx

    if not settings.GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY is not set")

    models = ["gemini-2.5-flash-image", "gemini-3.1-flash-image"]
    last_err = None

    for model in models:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={settings.GEMINI_API_KEY}"
        payload = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {
                "responseModalities": ["IMAGE"]
            }
        }

        try:
            async with httpx.AsyncClient(timeout=60.0) as client:
                resp = await client.post(url, json=payload)
                if resp.status_code == 200:
                    data = resp.json()
                    candidates = data.get("candidates", [])
                    if candidates:
                        parts = candidates[0].get("content", {}).get("parts", [])
                        for part in parts:
                            inline_data = part.get("inlineData", {})
                            b64_data = inline_data.get("data")
                            if b64_data:
                                return base64.b64decode(b64_data)
                last_err = f"{model} returned HTTP {resp.status_code}: {resp.text[:200]}"
        except Exception as e:
            last_err = f"{model} failed: {e}"
            continue

    raise RuntimeError(f"All Gemini image models failed. Last error: {last_err}")


async def _try_huggingface(prompt: str) -> bytes:
    """Generate an image via HuggingFace Inference API."""
    import httpx

    token = settings.HF_TOKEN
    if not token:
        raise ValueError("HF_TOKEN is not set — cannot use HuggingFace image generation")

    model = settings.HF_IMAGE_MODEL
    api_url = f"https://api-inference.huggingface.co/models/{model}"

    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
    }
    payload = {
        "inputs": prompt,
        "parameters": {
            "num_inference_steps": 4,
            "guidance_scale": 0.0,
        },
    }

    def _sync_call() -> bytes:
        with httpx.Client(timeout=60.0) as client:
            resp = client.post(api_url, json=payload, headers=headers)
            if resp.status_code == 503:
                raise RuntimeError(f"HuggingFace model is loading: {resp.text}")
            resp.raise_for_status()
            return resp.content

    image_bytes = await asyncio.get_event_loop().run_in_executor(None, _sync_call)
    return _ensure_png(image_bytes)


def _ensure_png(image_bytes: bytes) -> bytes:
    """Convert any image bytes to PNG format using Pillow."""
    try:
        from PIL import Image
        img = Image.open(io.BytesIO(image_bytes))
        buf = io.BytesIO()
        img.save(buf, format="PNG")
        return buf.getvalue()
    except ImportError:
        return image_bytes
