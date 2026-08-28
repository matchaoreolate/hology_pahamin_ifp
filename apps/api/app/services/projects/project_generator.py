"""
Project Generator Service — Handles triggering AI background tasks and tracking status.
"""
import uuid
from typing import Any

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.project_repository import ProjectRepository
from app.schemas.media_project import MediaProjectResponse
from app.services.projects.project_crud import ProjectCRUDService
from app.tasks.generate import generate_all_outputs_task


class ProjectGeneratorService:
    @staticmethod
    async def trigger(
        db: AsyncSession, project_id: str, user_id: uuid.UUID
    ) -> MediaProjectResponse:
        project = await ProjectCRUDService.find_or_404(db, project_id, user_id)

        if project.status == "processing":
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Generate sedang berjalan untuk project ini",
            )
        if not project.selected_outputs:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Pilih minimal 1 jenis output untuk digenerate",
            )

        project.status = "processing"
        project.error_message = None
        await db.flush()

        task = generate_all_outputs_task.delay(str(project.id))
        project.celery_task_id = task.id
        await db.flush()
        await db.refresh(project)
        return ProjectCRUDService.to_response(project)

    @staticmethod
    async def get_status(
        db: AsyncSession, project_id: str, user_id: uuid.UUID
    ) -> dict[str, Any]:
        val_id = ProjectCRUDService.validate_uuid(project_id)
        project = await ProjectRepository.get_with_outputs(db, val_id, user_id)
        if not project:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project tidak ditemukan")

        outputs_status = [
            {
                "output_type": o.output_type,
                "status": o.status,
                "generated_at": o.generated_at.isoformat() if o.generated_at else None,
            }
            for o in project.generated_outputs
        ]
        return {
            "project_id": str(project.id),
            "project_status": project.status,
            "outputs": outputs_status,
            "error_message": project.error_message,
        }
