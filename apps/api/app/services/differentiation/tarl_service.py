"""
TaRL Service — Teaching at the Right Level (Differentiated Learning Generator).
Generates 3 adaptive learning tiers (Perintis, Cakap, Mahir) using Gemini AI.
"""
import uuid
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.media_project import MediaProject
from app.repositories.project_repository import ProjectRepository
from app.schemas.differentiation import DifferentiatedResponse
from app.services.ai.gemini_service import gemini_service


class TaRLService:
    @staticmethod
    def _build_prompt(ctx) -> str:
        return f"""
Kamu adalah pakar pedagogik Kurikulum Merdeka Indonesia spesialis Teaching at the Right Level (TaRL).
Tugasmu adalah menyusun Rencana Pembelajaran Terdiferensiasi dan Paket Soal 3 Level dari topik berikut:

## KONTEKS
- Mata Pelajaran: {ctx.mata_pelajaran}
- Topik: {ctx.topik}
- Fase/Kelas: {ctx.fase} (Kelas {ctx.kelas})
- Tujuan Pembelajaran: {ctx.tujuan_pembelajaran}
- Wilayah/Kearifan Lokal: {ctx.konteks_geografis or 'Umum Indonesia'}

## PETUNJUK LEVEL DIFERENSIASI
1. **Perintis (Butuh Bimbingan / C1-C2)**: Siswa belum menguasai konsep dasar. Berikan kalimat sederhana, bantuan visual konkret/petunjuk pengerjaan (scaffolding). Minimal 2 soal.
2. **Cakap (Mandiri / C3-C4)**: Siswa memahami konsep dasar dan siap berlatih mandiri secara kontekstual. Minimal 2 soal.
3. **Mahir (Pengayaan / C5-C6 HOTS)**: Siswa melampaui capaian. Berikan studi kasus terbuka, pemecahan masalah, atau tantangan kreatif. Minimal 2 soal.

## OUTPUT JSON (Hanya JSON valid, tanpa teks pengantar):
{{
  "topik": "{ctx.topik}",
  "mata_pelajaran": "{ctx.mata_pelajaran}",
  "fase": "{ctx.fase}",
  "tujuan_pembelajaran": "{ctx.tujuan_pembelajaran}",
  "tiers": [
    {{
      "tier": "perintis",
      "nama_kelompok": "Kelompok Perintis (Dasar)",
      "target_kemampuan": "Mengenal dan mengidentifikasi konsep melalui benda konkret",
      "panduan_guru": "Dampingi intensif, gunakan benda nyata atau gambar analogi",
      "aktivitas_kelas": "Mencocokkan kartu bergambar berpasangan",
      "soal": [
        {{
          "nomor": 1,
          "tipe": "pilihan_bergambar",
          "pertanyaan": "...",
          "opsi": ["A. ...", "B. ..."],
          "petunjuk_bantuan": "Ingat kembali ciri utama pada gambar...",
          "tantangan_kreatif": null
        }}
      ]
    }},
    {{
      "tier": "cakap",
      "nama_kelompok": "Kelompok Cakap (Standar)",
      "target_kemampuan": "Menerapkan konsep secara mandiri pada situasi sehari-hari",
      "panduan_guru": "Fasilitasi diskusi kelompok kecil, berikan umpan balik berkala",
      "aktivitas_kelas": "Mengerjakan latihan aplikatif dan lembar tugas mandiri",
      "soal": [
        {{
          "nomor": 1,
          "tipe": "isian",
          "pertanyaan": "...",
          "opsi": null,
          "petunjuk_bantuan": null,
          "tantangan_kreatif": null
        }}
      ]
    }},
    {{
      "tier": "mahir",
      "nama_kelompok": "Kelompok Mahir (Pengayaan)",
      "target_kemampuan": "Menganalisis, mengevaluasi, dan menciptakan solusi baru",
      "panduan_guru": "Beri kebebasan eksplorasi dan bertindak sebagai mentor/konsultan",
      "aktivitas_kelas": "Proyek mini pemecahan masalah lingkungan sekitar",
      "soal": [
        {{
          "nomor": 1,
          "tipe": "analisis_kasus",
          "pertanyaan": "...",
          "opsi": null,
          "petunjuk_bantuan": null,
          "tantangan_kreatif": "Rancang ide inovatif untuk..."
        }}
      ]
    }}
  ]
}}
""".strip()

    @classmethod
    async def generate_differentiated_plan(
        cls, db: AsyncSession, project_id: str, user_id: uuid.UUID
    ) -> DifferentiatedResponse:
        """Fetch project context and generate 3-tier differentiated learning package."""
        val_id = uuid.UUID(str(project_id))
        project = await ProjectRepository.get_with_context_no_user(db, val_id)
        if not project or not project.learning_context:
            raise ValueError("Konteks pembelajaran tidak ditemukan untuk project ini")

        ctx = project.learning_context
        prompt = cls._build_prompt(ctx)
        result_json = await gemini_service.generate(prompt, context_label=f"tarl_{project_id}")
        return DifferentiatedResponse.model_validate(result_json)
