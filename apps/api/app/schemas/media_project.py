"""
Pydantic schemas for MediaProject and OutputConfig (Tahap 2 inputs).
"""
from enum import Enum

from pydantic import BaseModel, Field

# =============================================
# TAHAP 2 — Output Config Sub-Schemas
# =============================================

class GayaVisualEnum(str, Enum):
    CUTE_3D = "cute_3d"
    FUTURISTIC_NEON = "futuristic_neon"
    FLAT_COLORFUL = "flat_colorful"
    MINIMALIST = "minimalist"


class ModeDinamikaEnum(str, Enum):
    FOKUS = "fokus"         # Lebih banyak narasi, interaksi di akhir
    SEIMBANG = "seimbang"   # Mix teori & game setiap 2-3 slide
    SUPER_AKTIF = "super_aktif"  # Hampir semua slide interaktif


class GayaInteraksiEnum(str, Enum):
    FASILITATOR = "fasilitator"
    PENCERAMAH = "penceramah"


class FormatTantanganEnum(str, Enum):
    ISIAN_SINGKAT = "isian_singkat"
    PILIHAN_GANDA = "pilihan_ganda"
    MENCOCOKKAN = "mencocokkan"
    CAMPURAN = "campuran"


class DistribusiKesulitanEnum(str, Enum):
    MUDAH_DOMINAN = "70_mudah_30_hots"
    SEIMBANG = "50_mudah_50_hots"
    HOTS_DOMINAN = "30_mudah_70_hots"


class FormatNarasiEnum(str, Enum):
    BUKU_CERITA = "buku_cerita"
    DIALOG_KARAKTER = "dialog_karakter"


# --- Per-Output Configs ---

class PresentasiConfig(BaseModel):
    gaya_visual: GayaVisualEnum = GayaVisualEnum.CUTE_3D
    mode_dinamika: ModeDinamikaEnum = ModeDinamikaEnum.SEIMBANG
    ice_breaking: bool = False
    kepadatan_teks: int = Field(default=3, ge=1, le=5)
    # 1=hanya keyword, 5=paragraf penuh
    gaya_interaksi: GayaInteraksiEnum = GayaInteraksiEnum.FASILITATOR
    instruksi_spesifik: str | None = Field(default=None, max_length=500)


class LKPDConfig(BaseModel):
    format_tantangan: FormatTantanganEnum = FormatTantanganEnum.CAMPURAN
    jumlah_soal: int = Field(default=10, ge=3, le=30)
    distribusi_kesulitan: DistribusiKesulitanEnum = DistribusiKesulitanEnum.SEIMBANG
    injeksi_konteks_lokal: bool = True
    rubrik_penilaian: bool = True  # Include scoring rubric for teacher


class EbookConfig(BaseModel):
    format_narasi: FormatNarasiEnum = FormatNarasiEnum.BUKU_CERITA
    glosarium_cerdas: bool = True
    pemantik_diskusi_rumah: bool = True


class OutputConfig(BaseModel):
    """Full Tahap 2 configuration. All sub-configs are optional."""
    presentasi: PresentasiConfig | None = None
    lkpd: LKPDConfig | None = None
    ebook: EbookConfig | None = None


# =============================================
# Project Schemas
# =============================================

class OutputTypeEnum(str, Enum):
    PRESENTATION = "presentation"
    LKPD = "lkpd"
    EBOOK = "ebook"


class MediaProjectCreate(BaseModel):
    learning_context_id: str
    title: str = Field(min_length=3, max_length=500)
    selected_outputs: list[OutputTypeEnum] = Field(min_length=1)
    output_config: OutputConfig = Field(default_factory=OutputConfig)


class MediaProjectUpdateConfig(BaseModel):
    title: str | None = Field(default=None, min_length=3, max_length=500)
    selected_outputs: list[OutputTypeEnum] | None = None
    output_config: OutputConfig | None = None


class MediaProjectResponse(BaseModel):
    id: str
    user_id: str
    learning_context_id: str
    title: str
    status: str
    selected_outputs: list[str]
    output_config: dict
    error_message: str | None
    created_at: str
    updated_at: str

    model_config = {"from_attributes": True}


class GeneratedOutputResponse(BaseModel):
    id: str
    project_id: str
    output_type: str
    status: str
    content: dict | None
    error_message: str | None
    generated_at: str | None

    model_config = {"from_attributes": True}
