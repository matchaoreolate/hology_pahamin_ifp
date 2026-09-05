"""
Pydantic schemas for Differentiated Learning (Teaching at the Right Level - TaRL).
Supports Kurikulum Merdeka 3-tier adaptive learning (Perintis, Cakap, Mahir).
"""
from typing import Literal
from pydantic import BaseModel, Field


class TierTask(BaseModel):
    nomor: int
    tipe: str = Field(description="Jenis tugas: pilihan_bergambar | isian | analisis_kasus")
    pertanyaan: str
    opsi: list[str] | None = None
    petunjuk_bantuan: str | None = Field(default=None, description="Scaffolding khusus level perintis")
    tantangan_kreatif: str | None = Field(default=None, description="Pengayaan khusus level mahir")


class LearningTier(BaseModel):
    tier: Literal["perintis", "cakap", "mahir"]
    nama_kelompok: str
    target_kemampuan: str
    panduan_guru: str
    aktivitas_kelas: str
    soal: list[TierTask] = Field(min_length=1)


class DifferentiatedResponse(BaseModel):
    topik: str
    mata_pelajaran: str
    fase: str
    tujuan_pembelajaran: str
    tiers: list[LearningTier]
