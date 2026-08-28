from __future__ import annotations

import uuid
from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, ForeignKey, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.db.types import JSON_TYPE, UUID_TYPE

if TYPE_CHECKING:
    from app.models.generated_output import GeneratedOutput
    from app.models.learning_context import LearningContext
    from app.models.user import User


class MediaProject(Base):
    __tablename__ = "media_projects"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID_TYPE, primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID_TYPE, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    learning_context_id: Mapped[uuid.UUID] = mapped_column(
        UUID_TYPE,
        ForeignKey("learning_contexts.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    title: Mapped[str] = mapped_column(String(500), nullable=False)
    status: Mapped[str] = mapped_column(
        String(20), nullable=False, default="draft"
    )
    # Status values: draft | processing | done | error

    # Tahap 2: which outputs the teacher selected
    selected_outputs: Mapped[list] = mapped_column(
        JSON_TYPE, nullable=False, default=list
    )
    # e.g. ["presentation", "lkpd", "ebook"]

    # Tahap 2: full config per output type (JSONB)
    output_config: Mapped[dict] = mapped_column(JSON_TYPE, nullable=False, default=dict)
    # Structure:
    # {
    #   "presentation": { gaya_visual, mode_dinamika, ice_breaking, ... },
    #   "lkpd": { format_tantangan, jumlah_soal, distribusi_kesulitan, ... },
    #   "ebook": { format_narasi, glosarium_cerdas, pemantik_diskusi, ... }
    # }

    error_message: Mapped[str | None] = mapped_column(Text, nullable=True)
    celery_task_id: Mapped[str | None] = mapped_column(String(255), nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
    )

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="projects")
    learning_context: Mapped["LearningContext"] = relationship(
        "LearningContext", back_populates="projects"
    )
    generated_outputs: Mapped[list["GeneratedOutput"]] = relationship(
        "GeneratedOutput", back_populates="project", cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return f"<MediaProject id={self.id} title={self.title} status={self.status}>"
