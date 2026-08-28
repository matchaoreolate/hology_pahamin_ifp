"""
Pydantic schemas for LearningContext (Tahap 1 inputs).
Heavy validation to ensure AI receives clean, structured data.
"""
from enum import Enum

from pydantic import BaseModel, Field, model_validator

# --- Enums ---

class FaseEnum(str, Enum):
    A = "A"  # Kelas 1 & 2
    B = "B"  # Kelas 3 & 4
    C = "C"  # Kelas 5 & 6


class KelasEnum(str, Enum):
    KELAS_1_2 = "1&2"
    KELAS_3_4 = "3&4"
    KELAS_5_6 = "5&6"


class MataPelajaranEnum(str, Enum):
    IPAS = "IPAS"
    MATEMATIKA = "Matematika"
    BAHASA_INDONESIA = "Bahasa Indonesia"
    PENDIDIKAN_PANCASILA = "Pendidikan Pancasila"
    PJOK = "PJOK"
    SENI = "Seni"
    BAHASA_INGGRIS = "Bahasa Inggris"
    AGAMA = "Agama"


class FokusPendekatanEnum(str, Enum):
    ANALOGI_SEHARI_HARI = "analogi_sehari_hari"
    VISUAL_GAMBAR = "visual_gambar"
    AKTIVITAS_FISIK = "aktivitas_fisik"


class KonteksGeografisEnum(str, Enum):
    PESISIR = "pesisir"
    PERKOTAAN = "perkotaan"
    PEGUNUNGAN = "pegunungan"


class LevelKemampuanEnum(str, Enum):
    BELUM_PAHAM = "belum_paham"
    SUDAH_PAHAM = "sudah_paham"
    CAMPURAN = "campuran"


# --- Schemas ---

class LearningContextCreate(BaseModel):
    # 1.1
    fase: FaseEnum
    kelas: KelasEnum
    mata_pelajaran: MataPelajaranEnum

    # 1.2
    topik: str = Field(min_length=3, max_length=500)
    tujuan_pembelajaran: str = Field(min_length=10, max_length=5000)

    # 1.3
    alokasi_waktu_jp: int = Field(ge=1, le=2)
    fokus_pendekatan: list[FokusPendekatanEnum] | None = None

    # 1.4
    konteks_geografis: KonteksGeografisEnum | None = None

    # 1.5
    level_kemampuan_kelas: LevelKemampuanEnum | None = None

    # 1.6
    apersepsi: str | None = Field(default=None, max_length=1000)

    @model_validator(mode="after")
    def validate_fase_kelas_consistency(self) -> "LearningContextCreate":
        """Ensure fase and kelas are consistent."""
        mapping = {
            FaseEnum.A: KelasEnum.KELAS_1_2,
            FaseEnum.B: KelasEnum.KELAS_3_4,
            FaseEnum.C: KelasEnum.KELAS_5_6,
        }
        if mapping[self.fase] != self.kelas:
            raise ValueError(
                f"Fase {self.fase} harus sesuai dengan kelas {mapping[self.fase].value}"
            )
        return self


class LearningContextUpdate(BaseModel):
    """All fields optional for partial update."""
    fase: FaseEnum | None = None
    kelas: KelasEnum | None = None
    mata_pelajaran: MataPelajaranEnum | None = None
    topik: str | None = Field(default=None, min_length=3, max_length=500)
    tujuan_pembelajaran: str | None = Field(default=None, min_length=10, max_length=5000)
    alokasi_waktu_jp: int | None = Field(default=None, ge=1, le=2)
    fokus_pendekatan: list[FokusPendekatanEnum] | None = None
    konteks_geografis: KonteksGeografisEnum | None = None
    level_kemampuan_kelas: LevelKemampuanEnum | None = None
    apersepsi: str | None = Field(default=None, max_length=1000)


class LearningContextResponse(BaseModel):
    id: str
    user_id: str
    fase: str
    kelas: str
    mata_pelajaran: str
    topik: str
    tujuan_pembelajaran: str
    alokasi_waktu_jp: int
    fokus_pendekatan: list[str] | None
    konteks_geografis: str | None
    level_kemampuan_kelas: str | None
    apersepsi: str | None
    created_at: str
    updated_at: str

    model_config = {"from_attributes": True}
