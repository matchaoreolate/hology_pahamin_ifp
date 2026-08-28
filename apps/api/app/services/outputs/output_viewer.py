"""
Output Viewer Service — Retrieves generated content per output type with state validation.
"""
import uuid
from typing import Any

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.output_repository import OutputRepository
from app.services.projects.project_crud import ProjectCRUDService


class OutputViewerService:
    @staticmethod
    async def get_by_type(
        db: AsyncSession, project_id: str, user_id: uuid.UUID, output_type: str
    ) -> dict[str, Any]:
        project = await ProjectCRUDService.find_or_404(db, project_id, user_id)
        output = await OutputRepository.get_by_type(db, project.id, output_type)
        if not output:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Output '{output_type}' tidak ditemukan untuk project ini",
            )
        if output.status == "processing":
            raise HTTPException(
                status_code=status.HTTP_425_TOO_EARLY,
                detail=f"Output '{output_type}' masih dalam proses generate AI",
            )
        if output.status == "error":
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Gagal menghasilkan {output_type}: {output.error_message}",
            )

        return {
            "project_id": str(project.id),
            "output_type": output_type,
            "content": output.content,
            "generated_at": output.generated_at.isoformat() if output.generated_at else None,
        }
