"""Builds the e-book generation prompt."""
from app.services.prompts.context_builder import (
    LearningContextData,
    build_context_preamble,
)


def build_ebook_prompt(ctx: LearningContextData, config: dict) -> str:
    preamble = build_context_preamble(ctx)

    format_narasi = config.get("format_narasi", "buku_cerita")
    glosarium = config.get("glosarium_cerdas", True)
    pemantik = config.get("pemantik_diskusi_rumah", True)

    narasi_instruction = {
        "buku_cerita": (
            "Tulis materi dalam format buku cerita bergambar digital. "
            "Gunakan narasi orang ketiga dengan tokoh anak yang melakukan petualangan belajar. "
            "Setiap bab dimulai dengan ilustrasi cerita sebelum masuk ke penjelasan konsep."
        ),
        "dialog_karakter": (
            "Tulis materi dalam format dialog antara 2-3 karakter (misal: guru robot, murid pemberani, dan ilmuwan tua). "
            "Konsep dijelaskan melalui percakapan yang natural dan menyenangkan."
        ),
    }.get(format_narasi, "")

    prompt = f"""
Kamu adalah sistem generator E-Book pembelajaran AI untuk Sekolah Dasar Indonesia.
E-Book ini akan diakses orang tua dan siswa di rumah via QR Code.

## KONTEKS PEDAGOGIK
{preamble}

## MATERI
- Mata Pelajaran: {ctx.mata_pelajaran}
- Topik: {ctx.topik}
- Tujuan Pembelajaran: {ctx.tujuan_pembelajaran}
- Fase: {ctx.fase} (Kelas {ctx.kelas})

## FORMAT NARASI
{narasi_instruction}

## OUTPUT JSON

{{
  "metadata": {{
    "judul": "Judul e-book yang menarik",
    "topik": "{ctx.topik}",
    "mata_pelajaran": "{ctx.mata_pelajaran}",
    "fase": "{ctx.fase}"
  }},
  "chapters": [
    {{
      "chapter_number": 1,
      "judul_chapter": "...",
      "ilustrasi_description": "Deskripsi detail ilustrasi pembuka chapter",
      "konten": "Teks isi chapter dalam format {format_narasi}",
      "poin_kunci": ["Poin 1", "Poin 2"]
    }}
  ],
  "glosarium": {('[{{"istilah": "...", "definisi": "...", "contoh": "..."}}]' if glosarium else '[]')},
  "pemantik_diskusi": {('[{{"pertanyaan": "...", "petunjuk_orang_tua": "..."}}]' if pemantik else '[]')}
}}

PENTING:
- Buat 3-5 chapter yang mengalir dari pengenalan ke pemahaman mendalam.
- {'Sertakan minimal 5 istilah kunci di glosarium dengan definisi ramah anak.' if glosarium else 'Kosongkan array glosarium.'}
- {'Sertakan 3 pertanyaan pemantik diskusi untuk orang tua + petunjuk cara mendiskusikannya.' if pemantik else 'Kosongkan array pemantik_diskusi.'}
- Output HANYA JSON, tanpa penjelasan tambahan.
"""
    return prompt.strip()
