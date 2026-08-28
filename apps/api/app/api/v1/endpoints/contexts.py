"""
Learning Context endpoints (Tahap 1).
CRUD for a teacher's learning context records.
Delegates business logic to ContextService.
"""
from fastapi import APIRouter, Query, status

from app.api.deps import CurrentUser, DBSession
from app.schemas.learning_context import (
    LearningContextCreate,
    LearningContextResponse,
    LearningContextUpdate,
)
from app.services.context_service import ContextService

router = APIRouter(prefix="/contexts", tags=["Learning Contexts"])


@router.post("/", response_model=LearningContextResponse, status_code=status.HTTP_201_CREATED)
async def create_context(
    payload: LearningContextCreate,
    current_user: CurrentUser,
    db: DBSession,
) -> LearningContextResponse:
    """Simpan konteks pembelajaran baru (Tahap 1)."""
    return await ContextService.create_context(db, current_user.id, payload)


@router.get("/", response_model=list[LearningContextResponse])
async def list_contexts(
    current_user: CurrentUser,
    db: DBSession,
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1, le=100),
) -> list[LearningContextResponse]:
    """Daftar semua konteks pembelajaran milik guru yang login."""
    return await ContextService.list_contexts(db, current_user.id, skip=skip, limit=limit)


@router.get("/{context_id}", response_model=LearningContextResponse)
async def get_context(
    context_id: str,
    current_user: CurrentUser,
    db: DBSession,
) -> LearningContextResponse:
    """Ambil detail satu konteks pembelajaran."""
    return await ContextService.get_context_by_id(db, context_id, current_user.id)


@router.put("/{context_id}", response_model=LearningContextResponse)
async def update_context(
    context_id: str,
    payload: LearningContextUpdate,
    current_user: CurrentUser,
    db: DBSession,
) -> LearningContextResponse:
    """Update konteks pembelajaran (partial update)."""
    return await ContextService.update_context(db, context_id, current_user.id, payload)


@router.delete("/{context_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_context(
    context_id: str,
    current_user: CurrentUser,
    db: DBSession,
) -> None:
    """Hapus konteks pembelajaran beserta semua project terkait."""
    await ContextService.delete_context(db, context_id, current_user.id)
