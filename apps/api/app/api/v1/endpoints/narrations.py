"""
Audio Narration endpoints — Streams speech for IFP slides and classroom materials.
"""
import io
from fastapi import APIRouter, HTTPException, status
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

from app.api.deps import CurrentUser, DBSession
from app.services.audio.tts_service import DEFAULT_VOICE, TTSService
from app.services.outputs.output_viewer import OutputViewerService

router = APIRouter(prefix="/narrations", tags=["Audio Narration"])


class NarrationRequest(BaseModel):
    text: str = Field(min_length=1, max_length=2000, description="Teks yang akan dibacakan")
    voice: str = Field(default=DEFAULT_VOICE, description="Voice ID edge-tts")


@router.post("/synthesize", summary="Synthesize custom text into audio stream")
async def synthesize_text(payload: NarrationRequest) -> StreamingResponse:
    """Mengubah teks menjadi aliran audio MP3 berkualitas tinggi secara instan."""
    return StreamingResponse(
        TTSService.stream_audio(payload.text, voice=payload.voice),
        media_type="audio/mpeg",
        headers={"Content-Disposition": 'inline; filename="narration.mp3"'},
    )


@router.get("/slides/{project_id}/{slide_id}", summary="Stream audio narration for a specific slide")
async def get_slide_narration(
    project_id: str,
    slide_id: str,
    current_user: CurrentUser,
    db: DBSession,
) -> StreamingResponse:
    """Membacakan narasi speaker_script atau isi materi slide presentasi."""
    output = await OutputViewerService.get_by_type(db, project_id, current_user.id, "presentation")
    content = output.get("content", {})
    slides = content.get("slides", [])

    target_slide = next((s for s in slides if s.get("id") == slide_id), None)
    if not target_slide:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Slide tidak ditemukan")

    # Ambil speaker script atau fallback ke title & content
    script = (
        target_slide.get("speaker_script")
        or target_slide.get("content")
        or target_slide.get("title")
    )
    if not script:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Slide tidak memiliki teks untuk dibaca")

    audio_bytes = await TTSService.generate_audio_bytes(script)
    return StreamingResponse(
        io.BytesIO(audio_bytes),
        media_type="audio/mpeg",
        headers={"Content-Disposition": f'inline; filename="slide-{slide_id}.mp3"'},
    )
