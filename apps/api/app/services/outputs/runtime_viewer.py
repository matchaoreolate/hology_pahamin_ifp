"""
Runtime Viewer Service — Builds PresentationArtifact payload for IFP TV display.
"""
import uuid
from typing import Any

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.generated_output import GeneratedOutput
from app.models.media_project import MediaProject
from app.repositories.output_repository import OutputRepository
from app.repositories.project_repository import ProjectRepository
from app.services.projects.project_crud import ProjectCRUDService


def _extract_artifact(project: MediaProject, output: GeneratedOutput) -> dict[str, Any]:
    """Extract and normalise PresentationArtifact from a completed GeneratedOutput."""
    content = output.content or {}
    slides = content.get("slides", [])
    meta = content.get("meta") or {
        "title": project.title,
        "mata_pelajaran": getattr(project.learning_context, "mata_pelajaran", ""),
        "topik": getattr(project.learning_context, "topik", ""),
        "fase": getattr(project.learning_context, "fase", ""),
        "total_slides": len(slides),
    }
    return {"version": content.get("version", "0.2"), "meta": meta, "slides": slides}


async def _get_done_presentation(db: AsyncSession, project_id: uuid.UUID) -> tuple[MediaProject, dict]:
    """Shared: fetch project + done presentation output, raise 404 if missing."""
    output = await OutputRepository.get_done_output(db, project_id, "presentation")
    if not output or not output.content:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Presentasi belum selesai digenerate")
    return output


class RuntimeViewerService:
    @staticmethod
    async def get_runtime(db: AsyncSession, project_id: str, user_id: uuid.UUID) -> dict[str, Any]:
        """Authenticated teacher runtime for IFP TV."""
        val_id = ProjectCRUDService.validate_uuid(project_id)
        project = await ProjectRepository.get_with_context(db, val_id, user_id)
        if not project:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project tidak ditemukan")

        output = await _get_done_presentation(db, project.id)
        artifact = _extract_artifact(project, output)

        return {
            "runtime_id": str(project.id),
            "mode": "interactive_tv",
            "artifact": artifact,
            "ifp_settings": {
                "optimized_for": "interactive_flat_panel",
                "touch_target_min_size": "80px",
                "font_scale": "large",
                "contrast": "high",
            },
        }

    @staticmethod
    async def get_public_presentation(db: AsyncSession, project_id: str) -> dict[str, Any]:
        """Public read-only viewer for IFP (no auth required)."""
        val_id = ProjectCRUDService.validate_uuid(project_id)
        result = await db.execute(
            select(MediaProject)
            .options(selectinload(MediaProject.learning_context))
            .where(MediaProject.id == val_id)
        )
        project = result.scalar_one_or_none()
        if not project:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project tidak ditemukan")

        output = await _get_done_presentation(db, project.id)
        artifact = _extract_artifact(project, output)

        return {"project_id": str(project.id), "artifact": artifact}
