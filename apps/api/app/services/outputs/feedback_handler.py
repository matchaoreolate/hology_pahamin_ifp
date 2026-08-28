"""
Feedback Handler Service — Records post-lesson reviews and teacher feedback.
"""
import uuid
from datetime import datetime, timezone
from typing import Any

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.services.projects.project_crud import ProjectCRUDService


class FeedbackHandlerService:
    @staticmethod
    async def submit_feedback(
        db: AsyncSession, project_id: str, user_id: uuid.UUID, payload: dict[str, Any]
    ) -> dict[str, Any]:
        project = await ProjectCRUDService.find_or_404(db, project_id, user_id)

        rating = payload.get("rating")
        if rating is not None and (not isinstance(rating, int) or not 1 <= rating <= 5):
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Rating harus berupa angka antara 1 sampai 5",
            )

        feedback_data = {
            "rating": rating,
            "catatan": payload.get("catatan", ""),
            "siswa_aktif": payload.get("siswa_aktif"),
            "kendala": payload.get("kendala", ""),
            "submitted_at": datetime.now(timezone.utc).isoformat(),
        }

        current_config = project.output_config or {}
        current_config["lesson_feedback"] = feedback_data
        project.output_config = current_config
        await db.flush()

        return {
            "project_id": str(project.id),
            "message": "Terima kasih atas feedbacknya. Data berhasil disimpan untuk evaluasi.",
            "feedback": feedback_data,
        }
