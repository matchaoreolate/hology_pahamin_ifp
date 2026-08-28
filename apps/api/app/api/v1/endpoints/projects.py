"""
Media Project endpoints (Tahap 2 & 3).
Delegates to focused modular domain services:
- ProjectCRUDService
- ProjectGeneratorService
- ProjectWorkspaceService
- ProjectSummaryService
"""
from typing import Any

from fastapi import APIRouter, Query, status

from app.api.deps import CurrentUser, DBSession
from app.schemas.media_project import (
    MediaProjectCreate,
    MediaProjectResponse,
    MediaProjectUpdateConfig,
)
from app.services.projects.project_crud import ProjectCRUDService
from app.services.projects.project_generator import ProjectGeneratorService
from app.services.projects.project_summary import ProjectSummaryService
from app.services.projects.project_workspace import ProjectWorkspaceService

router = APIRouter(prefix="/projects", tags=["Media Projects"])


@router.post("/", response_model=MediaProjectResponse, status_code=status.HTTP_201_CREATED)
async def create_project(
    payload: MediaProjectCreate,
    current_user: CurrentUser,
    db: DBSession,
) -> MediaProjectResponse:
    """Buat project baru dan simpan konfigurasi output (Tahap 2)."""
    return await ProjectCRUDService.create(db, current_user.id, payload)


@router.get("/", response_model=list[MediaProjectResponse])
async def list_projects(
    current_user: CurrentUser,
    db: DBSession,
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1, le=100),
) -> list[MediaProjectResponse]:
    """Daftar semua project milik guru yang login."""
    return await ProjectCRUDService.list(db, current_user.id, skip=skip, limit=limit)


@router.get("/{project_id}", response_model=MediaProjectResponse)
async def get_project(
    project_id: str,
    current_user: CurrentUser,
    db: DBSession,
) -> MediaProjectResponse:
    """Ambil detail satu project."""
    return await ProjectCRUDService.get(db, project_id, current_user.id)


@router.put("/{project_id}/config", response_model=MediaProjectResponse)
async def update_project_config(
    project_id: str,
    payload: MediaProjectUpdateConfig,
    current_user: CurrentUser,
    db: DBSession,
) -> MediaProjectResponse:
    """Update konfigurasi output suatu project."""
    return await ProjectCRUDService.update_config(db, project_id, current_user.id, payload)


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(
    project_id: str,
    current_user: CurrentUser,
    db: DBSession,
) -> None:
    """Hapus project beserta semua generated outputs."""
    await ProjectCRUDService.delete(db, project_id, current_user.id)


@router.post("/{project_id}/generate", response_model=MediaProjectResponse)
async def trigger_generate(
    project_id: str,
    current_user: CurrentUser,
    db: DBSession,
) -> MediaProjectResponse:
    """Trigger background generation untuk semua output yang dipilih."""
    return await ProjectGeneratorService.trigger(db, project_id, current_user.id)


@router.get("/{project_id}/status")
async def get_generate_status(
    project_id: str,
    current_user: CurrentUser,
    db: DBSession,
) -> dict[str, Any]:
    """Cek status generate project dan output individual (untuk polling)."""
    return await ProjectGeneratorService.get_status(db, project_id, current_user.id)


@router.get("/{project_id}/workspace")
async def open_project_workspace(
    project_id: str,
    current_user: CurrentUser,
    db: DBSession,
) -> dict[str, Any]:
    """Buka Ruang Projek — dashboard lengkap satu project."""
    return await ProjectWorkspaceService.get_workspace(db, project_id, current_user.id)


@router.get("/{project_id}/summary")
async def get_smart_summary(
    project_id: str,
    current_user: CurrentUser,
    db: DBSession,
) -> dict[str, Any]:
    """Smart Summary (Tahap 3) — ringkasan sebelum generate."""
    return await ProjectSummaryService.get_summary(db, project_id, current_user.id)
