"""
Generated Output endpoints: retrieval, editing, IFP TV runtime, and feedback.
Delegates to focused modular domain services:
- OutputViewerService
- OutputEditorService
- RuntimeViewerService
- FeedbackHandlerService
"""
from typing import Any

from fastapi import APIRouter

from app.api.deps import CurrentUser, DBSession
from app.services.outputs.feedback_handler import FeedbackHandlerService
from app.services.outputs.output_editor import OutputEditorService
from app.services.outputs.output_viewer import OutputViewerService
from app.services.outputs.runtime_viewer import RuntimeViewerService

router = APIRouter(prefix="/projects", tags=["Generated Outputs"])


@router.get("/{project_id}/presentation")
async def get_presentation(
    project_id: str,
    current_user: CurrentUser,
    db: DBSession,
) -> dict[str, Any]:
    """Ambil hasil generate Presentasi Interaktif TV."""
    return await OutputViewerService.get_by_type(db, project_id, current_user.id, "presentation")


@router.get("/{project_id}/lkpd")
async def get_lkpd(
    project_id: str,
    current_user: CurrentUser,
    db: DBSession,
) -> dict[str, Any]:
    """Ambil hasil generate LKPD Cetak."""
    return await OutputViewerService.get_by_type(db, project_id, current_user.id, "lkpd")


@router.get("/{project_id}/ebook")
async def get_ebook(
    project_id: str,
    current_user: CurrentUser,
    db: DBSession,
) -> dict[str, Any]:
    """Ambil hasil generate E-Book."""
    return await OutputViewerService.get_by_type(db, project_id, current_user.id, "ebook")


@router.patch("/{project_id}/{output_type}")
async def update_output_content(
    project_id: str,
    output_type: str,
    payload: dict[str, Any],
    current_user: CurrentUser,
    db: DBSession,
) -> dict[str, Any]:
    """Review dan Edit konten output AI."""
    return await OutputEditorService.update_content(
        db, project_id, current_user.id, output_type, payload
    )


@router.get("/{project_id}/runtime")
async def get_presentation_runtime(
    project_id: str,
    current_user: CurrentUser,
    db: DBSession,
) -> dict[str, Any]:
    """Mode tayangan presentasi interaktif untuk layar sentuh IFP TV."""
    return await RuntimeViewerService.get_runtime(db, project_id, current_user.id)


@router.post("/{project_id}/feedback")
async def submit_lesson_feedback(
    project_id: str,
    payload: dict[str, Any],
    current_user: CurrentUser,
    db: DBSession,
) -> dict[str, Any]:
    """Kirim feedback dan evaluasi setelah pelaksanaan pembelajaran di kelas."""
    return await FeedbackHandlerService.submit_feedback(
        db, project_id, current_user.id, payload
    )
