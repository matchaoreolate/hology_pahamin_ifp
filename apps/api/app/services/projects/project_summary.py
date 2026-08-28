"""
Project Summary Service — Handles Tahap 3 natural language smart summary logic.
"""
import uuid
from typing import Any

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.project_repository import ProjectRepository
from app.services.projects.project_crud import ProjectCRUDService

OUTPUT_LABELS = {
    "presentation": "Presentasi Interaktif TV",
    "lkpd": "Lembar Kerja Siswa (LKPD)",
    "ebook": "E-Book Interaktif",
}


class ProjectSummaryService:
    @staticmethod
    async def get_summary(
        db: AsyncSession, project_id: str, user_id: uuid.UUID
    ) -> dict[str, Any]:
        val_id = ProjectCRUDService.validate_uuid(project_id)
        project = await ProjectRepository.get_with_context(db, val_id, user_id)
        if not project:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project tidak ditemukan")

        ctx = project.learning_context
        outputs_str = ", ".join(OUTPUT_LABELS.get(o, o) for o in project.selected_outputs)

        summary = (
            f"PahamIn akan membuatkan {outputs_str} untuk materi '{ctx.topik}' "
            f"Fase {ctx.fase} (Kelas {ctx.kelas}, {ctx.mata_pelajaran}). "
        )

        pres_config = project.output_config.get("presentation", {})
        if "presentation" in project.selected_outputs and pres_config:
            mode = pres_config.get("mode_dinamika", "seimbang").replace("_", " ").title()
            summary += f"Presentasi menggunakan Mode {mode}. "

        lkpd_config = project.output_config.get("lkpd", {})
        if "lkpd" in project.selected_outputs and lkpd_config:
            jumlah_soal = lkpd_config.get("jumlah_soal", 10)
            summary += f"LKPD berisi {jumlah_soal} butir soal. "

        return {
            "project_id": str(project.id),
            "summary": summary.strip(),
            "details": {
                "topik": ctx.topik,
                "fase": ctx.fase,
                "kelas": ctx.kelas,
                "mata_pelajaran": ctx.mata_pelajaran,
                "selected_outputs": project.selected_outputs,
                "output_config": project.output_config,
            },
        }
