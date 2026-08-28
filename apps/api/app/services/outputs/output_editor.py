"""
Output Editor Service — Handles teacher manual edits/patches on AI generated content.
"""
import uuid
from typing import Any

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.output_repository import OutputRepository
from app.services.projects.project_crud import ProjectCRUDService

VALID_OUTPUT_TYPES = ("presentation", "lkpd", "ebook")


class OutputEditorService:
    @staticmethod
    async def update_content(
        db: AsyncSession,
        project_id: str,
        user_id: uuid.UUID,
        output_type: str,
        payload: dict[str, Any],
    ) -> dict[str, Any]:
        if output_type not in VALID_OUTPUT_TYPES:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"output_type harus salah satu dari: {', '.join(VALID_OUTPUT_TYPES)}",
            )

        project = await ProjectCRUDService.find_or_404(db, project_id, user_id)
        output = await OutputRepository.get_done_output(db, project.id, output_type)
        if not output:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Output '{output_type}' belum tersedia untuk diedit",
            )

        if "content" in payload and isinstance(payload["content"], dict):
            current = output.content or {}
            current.update(payload["content"])
            output.content = current
        elif payload:
            output.content = payload

        await db.flush()
        return {
            "project_id": str(project.id),
            "output_type": output_type,
            "message": "Konten berhasil diperbarui",
            "content": output.content,
        }
