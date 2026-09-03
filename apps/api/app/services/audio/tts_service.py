"""
Text-to-Speech (TTS) Service using Edge-TTS.
Provides natural Indonesian narration for classroom IFP slides and materials.
"""
from typing import AsyncGenerator
import edge_tts

from app.core.logging import get_logger

logger = get_logger(__name__)

DEFAULT_VOICE = "id-ID-GadisNeural"  # Ramah & natural untuk anak SD
MALE_VOICE = "id-ID-ArdiNeural"


class TTSService:
    @staticmethod
    async def generate_audio_bytes(
        text: str,
        voice: str = DEFAULT_VOICE,
        rate: str = "+0%",
        pitch: str = "+0Hz",
    ) -> bytes:
        """Synthesize text into MP3 audio bytes."""
        clean_text = text.strip()
        if not clean_text:
            return b""

        communicate = edge_tts.Communicate(clean_text, voice=voice, rate=rate, pitch=pitch)
        audio_chunks: list[bytes] = []

        async for chunk in communicate.stream():
            if chunk["type"] == "audio":
                audio_chunks.append(chunk["data"])

        audio_data = b"".join(audio_chunks)
        logger.info("TTS synthesis complete", text_len=len(clean_text), audio_size=len(audio_data))
        return audio_data

    @staticmethod
    async def stream_audio(
        text: str,
        voice: str = DEFAULT_VOICE,
    ) -> AsyncGenerator[bytes, None]:
        """Stream MP3 audio chunks directly for low-latency playback."""
        clean_text = text.strip()
        if not clean_text:
            return

        communicate = edge_tts.Communicate(clean_text, voice=voice)
        async for chunk in communicate.stream():
            if chunk["type"] == "audio":
                yield chunk["data"]
