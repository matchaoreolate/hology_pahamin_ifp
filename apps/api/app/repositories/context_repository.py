"""
Context Repository — Pure database access layer for LearningContext.
"""
import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.learning_context import LearningContext


class ContextRepository:
    @staticmethod
    async def create(db: AsyncSession, user_id: uuid.UUID, data: dict) -> LearningContext:
        ctx = LearningContext(user_id=user_id, **data)
        db.add(ctx)
        await db.flush()
        await db.refresh(ctx)
        return ctx

    @staticmethod
    async def list_by_user(
        db: AsyncSession, user_id: uuid.UUID, skip: int = 0, limit: int = 20
    ) -> list[LearningContext]:
        result = await db.execute(
            select(LearningContext)
            .where(LearningContext.user_id == user_id)
            .order_by(LearningContext.created_at.desc())
            .offset(skip)
            .limit(limit)
        )
        return list(result.scalars().all())

    @staticmethod
    async def get_by_id(
        db: AsyncSession, context_id: uuid.UUID, user_id: uuid.UUID
    ) -> LearningContext | None:
        result = await db.execute(
            select(LearningContext).where(
                LearningContext.id == context_id,
                LearningContext.user_id == user_id,
            )
        )
        return result.scalar_one_or_none()

    @staticmethod
    async def delete(db: AsyncSession, ctx: LearningContext) -> None:
        await db.delete(ctx)
