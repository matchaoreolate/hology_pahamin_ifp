"""
Google Gemini AI service wrapper.
Handles all calls to the Gemini API with structured JSON output.
"""
import json
from typing import Any

import google.generativeai as genai

from app.core.config import settings
from app.core.logging import get_logger

logger = get_logger(__name__)


class GeminiService:
    """
    Thin wrapper around Google Gemini API.
    Always requests structured JSON output for reliable parsing.
    """

    def __init__(self) -> None:
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.model = genai.GenerativeModel(
            model_name=settings.GEMINI_MODEL,
            generation_config=genai.types.GenerationConfig(
                response_mime_type="application/json",
                temperature=settings.GEMINI_TEMPERATURE,
                max_output_tokens=settings.GEMINI_MAX_OUTPUT_TOKENS,
            ),
        )

    async def generate(self, prompt: str, context_label: str = "") -> dict[str, Any]:
        """
        Call Gemini and return parsed JSON dict.
        Raises ValueError if response is not valid JSON.
        """
        log = logger.bind(context=context_label)
        log.info("Calling Gemini API", prompt_length=len(prompt))

        try:
            # Note: google-generativeai doesn't have native async yet,
            # so we run in thread via asyncio for non-blocking behavior.
            import asyncio
            response = await asyncio.get_event_loop().run_in_executor(
                None, lambda: self.model.generate_content(prompt)
            )
            raw_text = response.text
            result = json.loads(raw_text)
            log.info("Gemini response received", keys=list(result.keys()) if isinstance(result, dict) else "list")
            return result
        except json.JSONDecodeError as e:
            log.error("Gemini returned non-JSON response", error=str(e))
            raise ValueError(f"AI tidak mengembalikan format JSON yang valid: {e}")
        except Exception as e:
            log.error("Gemini API error", error=str(e))
            raise


# Singleton instance
gemini_service = GeminiService()
