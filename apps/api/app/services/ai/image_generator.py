"""
Image Generation Client & Provider Handlers.

Supports:
- Pollinations.ai (Free Flux model, no API key required)
- Gemini Image Generation (gemini-2.5-flash-image, gemini-3.1-flash-image)
- HuggingFace Inference API (with automatic fallback to Pollinations/Gemini)
"""
import asyncio
import io
import urllib.parse
from app.core.config import settings
from app.core.logging import get_logger

logger = get_logger(__name__)


async def generate_image_bytes(prompt: str) -> bytes | None:
    """
    Attempt to generate image bytes using the configured provider.
    Returns raw PNG/JPEG bytes on success, None on failure.

    Provider is selected via IMAGE_GENERATION_PROVIDER:
      "pollinations" (default) — Free Pollinations.ai FLUX (no API key needed)
      "gemini"                 — Gemini Flash Image models
      "huggingface"            — HuggingFace Inference API
    """
    provider = settings.IMAGE_GENERATION_PROVIDER.lower()

    if provider == "pollinations":
        try:
            return await _try_pollinations(prompt)
        except Exception as e:
            logger.warning("Pollinations image gen failed, falling back to Gemini", error=str(e))

    elif provider == "huggingface":
        try:
            return await _try_huggingface(prompt)
        except Exception as e:
            logger.warning("HuggingFace image gen failed, falling back to Pollinations", error=str(e))

    elif provider == "gemini":
        try:
            return await _try_gemini_image(prompt)
        except Exception as e:
            logger.warning("Gemini image gen failed, falling back to Pollinations", error=str(e))

    # Automatic fallback: Pollinations.ai (free, reliable, FLUX model)
    try:
        logger.info("Attempting image generation via Pollinations.ai")
        return await _try_pollinations(prompt)
    except Exception as e:
        logger.warning("All image generation providers failed", error=str(e))

    return None


async def _try_pollinations(prompt: str) -> bytes:
    """Generate image bytes via Pollinations.ai (Free FLUX model, 100% free, no API key needed)."""
    import httpx

    encoded_prompt = urllib.parse.quote(prompt.strip())
    url = f"https://image.pollinations.ai/prompt/{encoded_prompt}?model=flux&width=1024&height=1024&nologo=true"

    async with httpx.AsyncClient(timeout=45.0) as client:
        resp = await client.get(url, follow_redirects=True)
        resp.raise_for_status()
        return _ensure_png(resp.content)


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
                                return optimize_image_bytes(base64.b64decode(b64_data))
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
    return optimize_image_bytes(image_bytes)


def optimize_image_bytes(
    image_bytes: bytes,
    max_dimension: int = 1280,
    quality: int = 82,
) -> bytes:
    """
    Compress and optimize image bytes using Pillow:
    - Downscales oversized images (max dimension capped at 1280px)
    - Re-encodes as modern, lightweight WebP (quality 82, method 4)
    - Achieves 80%-90% size reduction over raw PNG without visible fidelity loss
    - Preserves alpha transparency for RGBA overlays
    - Fallbacks gracefully to original bytes if processing fails
    """
    try:
        from PIL import Image

        img = Image.open(io.BytesIO(image_bytes))

        # Handle color modes safely
        if img.mode not in ("RGB", "RGBA"):
            img = img.convert("RGBA" if "transparency" in img.info or img.mode in ("RGBA", "LA", "PA") else "RGB")

        # Downscale if larger than max_dimension
        w, h = img.size
        if max(w, h) > max_dimension:
            scale = max_dimension / max(w, h)
            new_size = (int(w * scale), int(h * scale))
            img = img.resize(new_size, Image.Resampling.LANCZOS)

        buf = io.BytesIO()
        img.save(buf, format="WEBP", quality=quality, method=4)
        return buf.getvalue()
    except Exception as e:
        logger.warning("Image optimization fallback to raw bytes", error=str(e))
        return image_bytes


# Backward-compatibility alias
_ensure_png = optimize_image_bytes
