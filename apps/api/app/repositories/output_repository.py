"""
Output Repository — Pure database access layer for GeneratedOutput.
"""
import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.generated_output import GeneratedOutput


class OutputRepository:
    @staticmethod
    async def get_by_type(
        db: AsyncSession, project_id: uuid.UUID, output_type: str
    ) -> GeneratedOutput | None:
        result = await db.execute(
            select(GeneratedOutput).where(
                GeneratedOutput.project_id == project_id,
                GeneratedOutput.output_type == output_type,
            )
        )
        return result.scalar_one_or_none()

    @staticmethod
    async def get_done_output(
        db: AsyncSession, project_id: uuid.UUID, output_type: str
    ) -> GeneratedOutput | None:
        result = await db.execute(
            select(GeneratedOutput).where(
                GeneratedOutput.project_id == project_id,
                GeneratedOutput.output_type == output_type,
                GeneratedOutput.status == "done",
            )
        )
        return result.scalar_one_or_none()

    @staticmethod
    async def get_or_create(
        db: AsyncSession, project_id: uuid.UUID, output_type: str
    ) -> GeneratedOutput:
        """Return existing output record or create a new pending one."""
        result = await db.execute(
            select(GeneratedOutput).where(
                GeneratedOutput.project_id == project_id,
                GeneratedOutput.output_type == output_type,
            )
        )
        output = result.scalar_one_or_none()
        if not output:
            output = GeneratedOutput(project_id=project_id, output_type=output_type)
            db.add(output)
        return output
