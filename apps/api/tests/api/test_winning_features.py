"""
Tests for HOLOGY Winning Features:
1. Audio Narration (TTS)
2. Print-Ready LKPD PDF Export
3. Differentiated Learning (TaRL)
"""
import pytest
from app.services.audio.tts_service import TTSService
from app.services.pdf.lkpd_pdf_service import LKPD_PDFService
from app.schemas.differentiation import DifferentiatedResponse, LearningTier, TierTask


@pytest.mark.asyncio
async def test_tts_service_generates_audio():
    """Verify edge-tts generates valid audio stream bytes."""
    text = "Halo anak-anak hebat, mari belajar rantai makanan bersama PahamIn!"
    audio = await TTSService.generate_audio_bytes(text)
    assert isinstance(audio, bytes)
    assert len(audio) > 1000


def test_lkpd_pdf_service_generates_valid_pdf():
    """Verify LKPD PDF generator produces standard printable PDF bytes."""
    sample_lkpd = {
        "header": {
            "topik": "Siklus Air",
            "mata_pelajaran": "IPAS",
            "fase": "Fase B",
            "kelas": "4",
            "alokasi_waktu": "70 menit",
        },
        "soal": [
            {
                "nomor": 1,
                "tipe": "pilihan_ganda",
                "pertanyaan": "Proses perubahan uap air menjadi titik-titik air di awan disebut...",
                "opsi": ["A. Evaporasi", "B. Kondensasi", "C. Presipitasi", "D. Infiltrasi"],
                "skor": 50,
            },
            {
                "nomor": 2,
                "tipe": "isian",
                "pertanyaan": "Sebutkan dua manfaat air bagi kelangsungan hidup manusia!",
                "opsi": None,
                "skor": 50,
            },
        ],
    }
    pdf_bytes = LKPD_PDFService.generate_pdf(sample_lkpd)
    assert isinstance(pdf_bytes, bytes)
    assert pdf_bytes.startswith(b"%PDF")
    assert len(pdf_bytes) > 500


def test_tarl_differentiation_schema_validation():
    """Verify TaRL 3-tier structure validates against Pydantic schema."""
    data = {
        "topik": "Ekosistem",
        "mata_pelajaran": "IPAS",
        "fase": "Fase B",
        "tujuan_pembelajaran": "Menganalisis hubungan rantai makanan",
        "tiers": [
            {
                "tier": "perintis",
                "nama_kelompok": "Kelompok Perintis (Dasar)",
                "target_kemampuan": "Mengenal produsen dan konsumen dengan gambar",
                "panduan_guru": "Dampingi secara visual konkret",
                "aktivitas_kelas": "Mencocokkan kartu bergambar",
                "soal": [
                    {
                        "nomor": 1,
                        "tipe": "pilihan_bergambar",
                        "pertanyaan": "Manakah tumbuhan yang menghasilkan makanannya sendiri?",
                        "opsi": ["A. Padi", "B. Belalang"],
                        "petunjuk_bantuan": "Ingat warna hijau daun!",
                        "tantangan_kreatif": None,
                    }
                ],
            },
            {
                "tier": "cakap",
                "nama_kelompok": "Kelompok Cakap (Standar)",
                "target_kemampuan": "Menyusun skema rantai makanan mandiri",
                "panduan_guru": "Fasilitasi diskusi",
                "aktivitas_kelas": "Menyusun puzzle rantai makanan",
                "soal": [
                    {
                        "nomor": 1,
                        "tipe": "isian",
                        "pertanyaan": "Tuliskan urutan rantai makanan sawah!",
                        "opsi": None,
                        "petunjuk_bantuan": None,
                        "tantangan_kreatif": None,
                    }
                ],
            },
            {
                "tier": "mahir",
                "nama_kelompok": "Kelompok Mahir (Pengayaan)",
                "target_kemampuan": "Mengevaluasi dampak ketidakseimbangan ekosistem",
                "panduan_guru": "Berikan studi kasus terbuka",
                "aktivitas_kelas": "Studi kasus hama wereng",
                "soal": [
                    {
                        "nomor": 1,
                        "tipe": "analisis_kasus",
                        "pertanyaan": "Apa solusi ekologis mengurangi hama tanpa pestisida berlebih?",
                        "opsi": None,
                        "petunjuk_bantuan": None,
                        "tantangan_kreatif": "Rancang poster edukasi petani!",
                    }
                ],
            },
        ],
    }
    response = DifferentiatedResponse.model_validate(data)
    assert len(response.tiers) == 3
    assert response.tiers[0].tier == "perintis"
    assert response.tiers[1].tier == "cakap"
    assert response.tiers[2].tier == "mahir"
