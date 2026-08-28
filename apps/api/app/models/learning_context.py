from __future__ import annotations

import uuid
from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.db.types import JSON_TYPE, UUID_TYPE

if TYPE_CHECKING:
    from app.models.media_project import MediaProject
    from app.models.user import User


class LearningContext(Base):
    __tablename__ = "learning_contexts"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID_TYPE, primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID_TYPE, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )

    # 1.1 - Fase & Mata Pelajaran
    fase: Mapped[str] = mapped_column(String(1), nullable=False)      # "A", "B", "C"
    kelas: Mapped[str] = mapped_column(String(10), nullable=False)     # "1&2", "3&4", "5&6"
    mata_pelajaran: Mapped[str] = mapped_column(String(100), nullable=False)

    # 1.2 - Inti Materi
    topik: Mapped[str] = mapped_column(String(500), nullable=False)
    tujuan_pembelajaran: Mapped[str] = mapped_column(Text, nullable=False)

    # 1.3 - Parameter Eksekusi
    alokasi_waktu_jp: Mapped[int] = mapped_column(Integer, nullable=False)  # 1 or 2
    fokus_pendekatan: Mapped[list | None] = mapped_column(JSON_TYPE, nullable=True)
    # e.g. ["analogi_sehari_hari", "visual_gambar", "aktivitas_fisik"]

    # 1.4 - Konteks Lokal
    konteks_geografis: Mapped[str | None] = mapped_column(String(50), nullable=True)
    # "pesisir" | "perkotaan" | "pegunungan"

    # 1.5 - Level Kemampuan
    level_kemampuan_kelas: Mapped[str | None] = mapped_column(String(50), nullable=True)
    # "belum_paham" | "sudah_paham" | "campuran"

    # 1.6 - Apersepsi
    apersepsi: Mapped[str | None] = mapped_column(Text, nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
    )

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="learning_contexts")
    projects: Mapped[list["MediaProject"]] = relationship(
        "MediaProject", back_populates="learning_context", cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return f"<LearningContext id={self.id} topik={self.topik}>"
