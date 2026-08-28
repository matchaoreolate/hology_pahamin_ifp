"""
Runtime Viewer Service — Prepares interactive touchscreen payload for Interactive Flat Panel (IFP) TVs.
"""
import uuid
from typing import Any

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.output_repository import OutputRepository
from app.repositories.project_repository import ProjectRepository
from app.services.projects.project_crud import ProjectCRUDService


class RuntimeViewerService:
    @staticmethod
    async def get_runtime(
        db: AsyncSession, project_id: str, user_id: uuid.UUID
    ) -> dict[str, Any]:
        val_id = ProjectCRUDService.validate_uuid(project_id)
        project = await ProjectRepository.get_with_context(db, val_id, user_id)
        if not project:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project tidak ditemukan")

        output = await OutputRepository.get_done_output(db, project.id, "presentation")
        if not output:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Presentasi belum selesai digenerate",
            )

        ctx = project.learning_context
        slides = (output.content or {}).get("slides", [])
        config = project.output_config.get("presentation", {})

        return {
            "runtime_id": str(project.id),
            "mode": "interactive_tv",
            "meta": {
                "topik": ctx.topik,
                "mata_pelajaran": ctx.mata_pelajaran,
                "fase": ctx.fase,
                "total_slides": len(slides),
                "gaya_visual": config.get("gaya_visual", "cute_3d"),
                "mode_dinamika": config.get("mode_dinamika", "seimbang"),
            },
            "slides": slides,
            "navigation": {
                "total": len(slides),
                "supports_touch": True,
                "supports_keyboard": True,
            },
            "ifp_settings": {
                "optimized_for": "interactive_flat_panel",
                "touch_target_min_size": "80px",
                "font_scale": "large",
                "contrast": "high",
            },
        }
