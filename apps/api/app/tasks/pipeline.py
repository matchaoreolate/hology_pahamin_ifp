"""
Task execution pipeline & orchestrator helpers for Celery media generation.
"""
import uuid

from sqlalchemy import select

from app.core.logging import get_logger
from app.db.base import AsyncSessionLocal
from app.models.generated_output import GeneratedOutput
from app.models.media_project import MediaProject

logger = get_logger(__name__)


async def fetch_project_for_generation(project_id: str) -> tuple[MediaProject | None, list[str], dict]:
    """Fetch project details and output configurations."""
    val_id = uuid.UUID(str(project_id))
    async with AsyncSessionLocal() as db:
        result = await db.execute(
            select(MediaProject).where(MediaProject.id == val_id)
        )
        project = result.scalar_one_or_none()
        if not project:
            logger.error("Project not found for generation", project_id=project_id)
            return None, [], {}
        return project, list(project.selected_outputs), dict(project.output_config)


async def update_final_project_status(project_id: str) -> None:
    """Evaluate outputs and update overall project status to 'done' or 'error'."""
    val_id = uuid.UUID(str(project_id))
    async with AsyncSessionLocal() as db:
        result = await db.execute(
            select(MediaProject).where(MediaProject.id == val_id)
        )
        project = result.scalar_one_or_none()
        if not project:
            return

        out_result = await db.execute(
            select(GeneratedOutput).where(GeneratedOutput.project_id == val_id)
        )
        outputs = out_result.scalars().all()
        all_done = all(o.status == "done" for o in outputs)
        project.status = "done" if all_done else "error"
        if not all_done:
            failed = [o.output_type for o in outputs if o.status == "error"]
            project.error_message = f"Generate gagal untuk: {', '.join(failed)}"
        await db.commit()
