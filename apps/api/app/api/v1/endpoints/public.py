"""
Public endpoints — No authentication required.
Specifically for Interactive Flat Panel (IFP) classroom display and public presentation viewing.
"""
from typing import Any

from fastapi import APIRouter

from app.api.deps import DBSession
from app.services.outputs.runtime_viewer import RuntimeViewerService

router = APIRouter(prefix="/public", tags=["Public Viewer"])


@router.get("/presentations/{project_id}")
async def get_public_presentation(
    project_id: str,
    db: DBSession,
) -> dict[str, Any]:
    """
    Public read-only presentation viewer endpoint.
    Allows IFP devices in classroom to display the presentation without login.
    """
    return await RuntimeViewerService.get_public_presentation(db, project_id)
