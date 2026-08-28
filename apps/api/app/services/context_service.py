"""
Learning Context Service — High-level use cases for teacher's learning contexts.
"""
import uuid

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.learning_context import LearningContext
from app.repositories.context_repository import ContextRepository
from app.schemas.learning_context import (
    LearningContextCreate,
    LearningContextResponse,
    LearningContextUpdate,
)


class ContextService:
    @staticmethod
    def to_response(ctx: LearningContext) -> LearningContextResponse:
        return LearningContextResponse(
            id=str(ctx.id),
            user_id=str(ctx.user_id),
            fase=ctx.fase,
            kelas=ctx.kelas,
            mata_pelajaran=ctx.mata_pelajaran,
            topik=ctx.topik,
            tujuan_pembelajaran=ctx.tujuan_pembelajaran,
            alokasi_waktu_jp=ctx.alokasi_waktu_jp,
            fokus_pendekatan=ctx.fokus_pendekatan,
            konteks_geografis=ctx.konteks_geografis,
            level_kemampuan_kelas=ctx.level_kemampuan_kelas,
            apersepsi=ctx.apersepsi,
            created_at=ctx.created_at.isoformat(),
            updated_at=ctx.updated_at.isoformat(),
        )

    @classmethod
    async def create_context(
        cls, db: AsyncSession, user_id: uuid.UUID, payload: LearningContextCreate
    ) -> LearningContextResponse:
        ctx = await ContextRepository.create(db, user_id, payload.model_dump())
        return cls.to_response(ctx)

    @classmethod
    async def list_contexts(
        cls, db: AsyncSession, user_id: uuid.UUID, skip: int = 0, limit: int = 20
    ) -> list[LearningContextResponse]:
        contexts = await ContextRepository.list_by_user(db, user_id, skip=skip, limit=limit)
        return [cls.to_response(c) for c in contexts]

    @classmethod
    async def get_context_by_id(
        cls, db: AsyncSession, context_id: str, user_id: uuid.UUID
    ) -> LearningContextResponse:
        ctx = await cls.find_or_404(db, context_id, user_id)
        return cls.to_response(ctx)

    @classmethod
    async def update_context(
        cls, db: AsyncSession, context_id: str, user_id: uuid.UUID, payload: LearningContextUpdate
    ) -> LearningContextResponse:
        ctx = await cls.find_or_404(db, context_id, user_id)
        for field, value in payload.model_dump(exclude_unset=True).items():
            setattr(ctx, field, value)
        await db.flush()
        await db.refresh(ctx)
        return cls.to_response(ctx)

    @classmethod
    async def delete_context(
        cls, db: AsyncSession, context_id: str, user_id: uuid.UUID
    ) -> None:
        ctx = await cls.find_or_404(db, context_id, user_id)
        await ContextRepository.delete(db, ctx)

    @classmethod
    async def find_or_404(cls, db: AsyncSession, context_id: str, user_id: uuid.UUID) -> LearningContext:
        try:
            val_id = uuid.UUID(str(context_id))
        except ValueError:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Konteks pembelajaran tidak ditemukan")

        ctx = await ContextRepository.get_by_id(db, val_id, user_id)
        if not ctx:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Konteks pembelajaran tidak ditemukan")
        return ctx
