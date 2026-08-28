from __future__ import annotations

import uuid
from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, ForeignKey, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.db.types import JSON_TYPE, UUID_TYPE

if TYPE_CHECKING:
    from app.models.media_project import MediaProject


class GeneratedOutput(Base):
    __tablename__ = "generated_outputs"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID_TYPE, primary_key=True, default=uuid.uuid4
    )
    project_id: Mapped[uuid.UUID] = mapped_column(
        UUID_TYPE,
        ForeignKey("media_projects.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    output_type: Mapped[str] = mapped_column(String(20), nullable=False)
    # "presentation" | "lkpd" | "ebook"

    status: Mapped[str] = mapped_column(String(20), nullable=False, default="pending")
    # "pending" | "processing" | "done" | "error"

    # The actual AI-generated content as structured JSON
    content: Mapped[dict | None] = mapped_column(JSON_TYPE, nullable=True)
    # Structure varies per output_type:
    #
    # presentation: { "slides": [...], "theme": "...", "total_slides": N }
    # lkpd:         { "soal": [...], "rubrik": {...}, "header": {...} }
    # ebook:        { "chapters": [...], "glosarium": [...], "pemantik": [...] }

    error_message: Mapped[str | None] = mapped_column(Text, nullable=True)
    celery_task_id: Mapped[str | None] = mapped_column(String(255), nullable=True)

    generated_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    # Relationships
    project: Mapped["MediaProject"] = relationship(
        "MediaProject", back_populates="generated_outputs"
    )

    def __repr__(self) -> str:
        return f"<GeneratedOutput id={self.id} type={self.output_type} status={self.status}>"
