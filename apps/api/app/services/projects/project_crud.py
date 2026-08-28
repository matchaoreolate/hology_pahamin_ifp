"""
Project CRUD Service — Handles creation, retrieval, updates, and deletion.
"""
import uuid

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.media_project import MediaProject
from app.repositories.context_repository import ContextRepository
from app.repositories.project_repository import ProjectRepository
from app.schemas.media_project import (
    MediaProjectCreate,
    MediaProjectResponse,
    MediaProjectUpdateConfig,
)


class ProjectCRUDService:
    @staticmethod
    def to_response(project: MediaProject) -> MediaProjectResponse:
        return MediaProjectResponse(
            id=str(project.id),
            user_id=str(project.user_id),
            learning_context_id=str(project.learning_context_id),
            title=project.title,
            status=project.status,
            selected_outputs=project.selected_outputs,
            output_config=project.output_config,
            error_message=project.error_message,
            created_at=project.created_at.isoformat(),
            updated_at=project.updated_at.isoformat(),
        )

    @classmethod
    async def create(
        cls, db: AsyncSession, user_id: uuid.UUID, payload: MediaProjectCreate
    ) -> MediaProjectResponse:
        ctx_id = cls.validate_uuid(payload.learning_context_id)
        ctx = await ContextRepository.get_by_id(db, ctx_id, user_id)
        if not ctx:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Konteks pembelajaran tidak ditemukan")

        project = await ProjectRepository.create(db, {
            "user_id": user_id,
            "learning_context_id": ctx_id,
            "title": payload.title,
            "selected_outputs": payload.selected_outputs,
            "output_config": payload.output_config.model_dump(exclude_unset=True),
            "status": "draft",
        })
        return cls.to_response(project)

    @classmethod
    async def list(
        cls, db: AsyncSession, user_id: uuid.UUID, skip: int = 0, limit: int = 20
    ) -> list[MediaProjectResponse]:
        projects = await ProjectRepository.list_by_user(db, user_id, skip=skip, limit=limit)
        return [cls.to_response(p) for p in projects]

    @classmethod
    async def get(
        cls, db: AsyncSession, project_id: str, user_id: uuid.UUID
    ) -> MediaProjectResponse:
        project = await cls.find_or_404(db, project_id, user_id)
        return cls.to_response(project)

    @classmethod
    async def update_config(
        cls, db: AsyncSession, project_id: str, user_id: uuid.UUID, payload: MediaProjectUpdateConfig
    ) -> MediaProjectResponse:
        project = await cls.find_or_404(db, project_id, user_id)
        if project.status == "processing":
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Tidak bisa mengubah konfigurasi saat proses generate sedang berjalan",
            )
        if payload.title is not None:
            project.title = payload.title
        if payload.selected_outputs is not None:
            project.selected_outputs = payload.selected_outputs
        if payload.output_config is not None:
            project.output_config = payload.output_config.model_dump(exclude_unset=True)

        await db.flush()
        await db.refresh(project)
        return cls.to_response(project)

    @classmethod
    async def delete(
        cls, db: AsyncSession, project_id: str, user_id: uuid.UUID
    ) -> None:
        project = await cls.find_or_404(db, project_id, user_id)
        await ProjectRepository.delete(db, project)

    @classmethod
    async def find_or_404(cls, db: AsyncSession, project_id: str, user_id: uuid.UUID) -> MediaProject:
        val_id = cls.validate_uuid(project_id)
        project = await ProjectRepository.get_by_id(db, val_id, user_id)
        if not project:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project tidak ditemukan")
        return project

    @staticmethod
    def validate_uuid(id_str: str) -> uuid.UUID:
        try:
            return uuid.UUID(str(id_str))
        except ValueError:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project tidak ditemukan")
