"""
Celery tasks for AI media generation.
Each task runs independently so outputs can be generated in parallel.
"""
import asyncio
import uuid
from datetime import datetime, timezone

from celery import group

from app.core.logging import get_logger
from app.db.base import AsyncSessionLocal
from app.repositories.output_repository import OutputRepository
from app.repositories.project_repository import ProjectRepository
from app.schemas.presentation_artifact import PresentationArtifact
from app.services.ai.gemini_service import gemini_service
from app.services.prompts.context_builder import LearningContextData
from app.services.prompts.ebook_prompt import build_ebook_prompt
from app.services.prompts.lkpd_prompt import build_lkpd_prompt
from app.services.prompts.presentation_prompt import build_presentation_prompt
from app.tasks.celery_app import celery_app
from app.tasks.pipeline import fetch_project_for_generation, update_final_project_status

logger = get_logger(__name__)

_PROMPT_BUILDERS = {
    "presentation": build_presentation_prompt,
    "lkpd": build_lkpd_prompt,
    "ebook": build_ebook_prompt,
}


def run_async(coro):
    """Run an async coroutine from a sync Celery task."""
    loop = asyncio.new_event_loop()
    try:
        return loop.run_until_complete(coro)
    finally:
        loop.close()


@celery_app.task(bind=True, name="app.tasks.generate.generate_all_outputs_task")
def generate_all_outputs_task(self, project_id: str):
    """Orchestrator task — dispatches individual generate tasks in parallel."""
    async def _run():
        project, selected, config = await fetch_project_for_generation(project_id)
        if not project:
            return

        tasks = [
            _task.s(project_id, config.get(key, {}))
            for key, _task in [
                ("presentation", generate_presentation_task),
                ("lkpd", generate_lkpd_task),
                ("ebook", generate_ebook_task),
            ]
            if key in selected
        ]
        if tasks:
            group(tasks).apply_async().get(timeout=300, propagate=False)

        await update_final_project_status(project_id)

    run_async(_run())


@celery_app.task(bind=True, name="app.tasks.generate.generate_presentation_task")
def generate_presentation_task(self, project_id: str, config: dict):
    run_async(_generate_output(project_id, "presentation", config))


@celery_app.task(bind=True, name="app.tasks.generate.generate_lkpd_task")
def generate_lkpd_task(self, project_id: str, config: dict):
    run_async(_generate_output(project_id, "lkpd", config))


@celery_app.task(bind=True, name="app.tasks.generate.generate_ebook_task")
def generate_ebook_task(self, project_id: str, config: dict):
    run_async(_generate_output(project_id, "ebook", config))


async def _generate_output(project_id: str, output_type: str, config: dict):
    log = logger.bind(project_id=project_id, output_type=output_type)
    log.info("Starting generation")
    val_id = uuid.UUID(str(project_id))

    async with AsyncSessionLocal() as db:
        project = await ProjectRepository.get_with_context_no_user(db, val_id)
        if not project:
            log.error("Project not found")
            return

        output = await OutputRepository.get_or_create(db, val_id, output_type)
        output.status = "processing"
        await db.commit()

        ctx = project.learning_context
        ctx_data = LearningContextData(
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
        )

        prompt = _PROMPT_BUILDERS[output_type](ctx_data, config)

        try:
            content = await gemini_service.generate(prompt, context_label=f"{output_type}_{project_id}")
            if output_type == "presentation":
                content = PresentationArtifact.model_validate(content).model_dump(mode="json")

            output.content = content
            output.status = "done"
            output.generated_at = datetime.now(timezone.utc)
            log.info("Generation successful")
        except Exception as e:
            output.status = "error"
            output.error_message = str(e)
            log.error("Generation failed", error=str(e))

        await db.commit()
