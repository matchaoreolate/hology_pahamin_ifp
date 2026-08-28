"""
Project Workspace Service — Aggregates data & actions for Ruang Projek dashboard.
"""
import uuid
from typing import Any

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.media_project import MediaProject
from app.repositories.project_repository import ProjectRepository
from app.services.projects.project_crud import ProjectCRUDService


class ProjectWorkspaceService:
    @staticmethod
    async def get_workspace(
        db: AsyncSession, project_id: str, user_id: uuid.UUID
    ) -> dict[str, Any]:
        val_id = ProjectCRUDService.validate_uuid(project_id)
        project = await ProjectRepository.get_with_context_and_outputs(db, val_id, user_id)
        if not project:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project tidak ditemukan")

        ctx = project.learning_context
        outputs_map = {o.output_type: o for o in project.generated_outputs}

        def _output_info(output_type: str) -> dict[str, Any]:
            o = outputs_map.get(output_type)
            if not o:
                return {"status": "not_selected", "available": False}
            return {
                "status": o.status,
                "available": o.status == "done",
                "generated_at": o.generated_at.isoformat() if o.generated_at else None,
                "error": o.error_message,
            }

        return {
            "project": {
                "id": str(project.id),
                "title": project.title,
                "status": project.status,
                "created_at": project.created_at.isoformat(),
                "updated_at": project.updated_at.isoformat(),
            },
            "learning_context": {
                "fase": ctx.fase,
                "kelas": ctx.kelas,
                "mata_pelajaran": ctx.mata_pelajaran,
                "topik": ctx.topik,
                "alokasi_waktu_jp": ctx.alokasi_waktu_jp,
                "konteks_geografis": ctx.konteks_geografis,
            },
            "outputs": {
                "presentation": _output_info("presentation"),
                "lkpd": _output_info("lkpd"),
                "ebook": _output_info("ebook"),
            },
            "selected_outputs": project.selected_outputs,
            "quick_actions": ProjectWorkspaceService._build_quick_actions(project),
            "lesson_feedback": project.output_config.get("lesson_feedback"),
        }

    @staticmethod
    def _build_quick_actions(project: MediaProject) -> list[dict[str, Any]]:
        actions = []
        if project.status == "draft":
            actions.append({"id": "generate", "label": "Generate Media", "primary": True})
        if project.status == "done":
            if "presentation" in project.selected_outputs:
                actions.append({"id": "runtime", "label": "Mulai Presentasi di TV", "primary": True})
            if "lkpd" in project.selected_outputs:
                actions.append({"id": "print_lkpd", "label": "Cetak LKPD", "primary": False})
            if "ebook" in project.selected_outputs:
                actions.append({"id": "share_ebook", "label": "Bagikan E-Book", "primary": False})
        if project.status == "error":
            actions.append({"id": "retry", "label": "Coba Generate Ulang", "primary": True})
        return actions
