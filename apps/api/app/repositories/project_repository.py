"""
Project Repository — Pure database access layer for MediaProject.
"""
import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.media_project import MediaProject


class ProjectRepository:
    @staticmethod
    async def create(db: AsyncSession, data: dict) -> MediaProject:
        project = MediaProject(**data)
        db.add(project)
        await db.flush()
        await db.refresh(project)
        return project

    @staticmethod
    async def list_by_user(
        db: AsyncSession, user_id: uuid.UUID, skip: int = 0, limit: int = 20
    ) -> list[MediaProject]:
        result = await db.execute(
            select(MediaProject)
            .where(MediaProject.user_id == user_id)
            .order_by(MediaProject.updated_at.desc())
            .offset(skip)
            .limit(limit)
        )
        return list(result.scalars().all())

    @staticmethod
    async def get_by_id(
        db: AsyncSession, project_id: uuid.UUID, user_id: uuid.UUID
    ) -> MediaProject | None:
        result = await db.execute(
            select(MediaProject).where(
                MediaProject.id == project_id,
                MediaProject.user_id == user_id,
            )
        )
        return result.scalar_one_or_none()

    @staticmethod
    async def get_with_outputs(
        db: AsyncSession, project_id: uuid.UUID, user_id: uuid.UUID
    ) -> MediaProject | None:
        result = await db.execute(
            select(MediaProject)
            .options(selectinload(MediaProject.generated_outputs))
            .where(
                MediaProject.id == project_id,
                MediaProject.user_id == user_id,
            )
        )
        return result.scalar_one_or_none()

    @staticmethod
    async def get_with_context(
        db: AsyncSession, project_id: uuid.UUID, user_id: uuid.UUID
    ) -> MediaProject | None:
        result = await db.execute(
            select(MediaProject)
            .options(selectinload(MediaProject.learning_context))
            .where(
                MediaProject.id == project_id,
                MediaProject.user_id == user_id,
            )
        )
        return result.scalar_one_or_none()

    @staticmethod
    async def get_with_context_and_outputs(
        db: AsyncSession, project_id: uuid.UUID, user_id: uuid.UUID
    ) -> MediaProject | None:
        result = await db.execute(
            select(MediaProject)
            .options(
                selectinload(MediaProject.learning_context),
                selectinload(MediaProject.generated_outputs),
            )
            .where(
                MediaProject.id == project_id,
                MediaProject.user_id == user_id,
            )
        )
        return result.scalar_one_or_none()

    @staticmethod
    async def delete(db: AsyncSession, project: MediaProject) -> None:
        await db.delete(project)

    @staticmethod
    async def get_with_context_no_user(
        db: AsyncSession, project_id: uuid.UUID
    ) -> MediaProject | None:
        """For internal/background tasks that don't have a user context."""
        result = await db.execute(
            select(MediaProject)
            .options(selectinload(MediaProject.learning_context))
            .where(MediaProject.id == project_id)
        )
        return result.scalar_one_or_none()
