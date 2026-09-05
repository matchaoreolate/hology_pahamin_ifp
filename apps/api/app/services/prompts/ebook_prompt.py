"""Builds the e-book generation prompt (Contract v0.1)."""
from app.services.prompts.context_builder import (
    LearningContextData,
    build_context_preamble,
)


def build_ebook_prompt(ctx: LearningContextData, config: dict) -> str:
    preamble = build_context_preamble(ctx)

    format_narasi = config.get("format_narasi", "buku_cerita")

    narasi_instruction = {
        "buku_cerita": (
            "Gunakan gaya bahasa narasi cerita petualangan yang hangat dan menyenangkan. "
            "Konsep materi dijelaskan melalui alur cerita yang mudah dipahami."
        ),
        "dialog_karakter": (
            "Gunakan gaya dialog interaktif antara karakter murid dan guru/mentor. "
            "Konsep materi dijelaskan lewat percakapan yang hidup dan ramah anak."
        ),
    }.get(format_narasi, "Gunakan gaya bahasa cerita edukatif yang ramah anak SD.")

    prompt = f"""
Kamu adalah sistem generator E-Book bacaan pembelajaran AI untuk Sekolah Dasar Indonesia.
E-Book ini berfungsi sebagai bahan bacaan/referensi mandiri yang menyenangkan bagi siswa dan orang tua.

## KONTEKS PEDAGOGIK
{preamble}

## MATERI
- Mata Pelajaran: {ctx.mata_pelajaran}
- Topik: {ctx.topik}
- Tujuan Pembelajaran: {ctx.tujuan_pembelajaran}
- Fase: {ctx.fase} (Kelas {ctx.kelas})

## GAYA PENULISAN
{narasi_instruction}

## SPESIFIKASI KONTRAK OUTPUT JSON (E-book v0.1)

Hasilkan output JSON murni dengan format persis seperti ini:

{{
  "version": "0.1",
  "meta": {{
    "title": "{ctx.topik}",
    "mata_pelajaran": "{ctx.mata_pelajaran}",
    "topik": "{ctx.topik}",
    "fase": "{ctx.fase}"
  }},
  "sections": [
    {{
      "title": "Apa Itu {ctx.topik}?",
      "content": "Paragraf pengantar konsep dasar materi..."
    }},
    {{
      "title": "Bagian dan Ciri Penting",
      "content": "Paragraf penjelasan detail materi..."
    }},
    {{
      "title": "Contoh di Sekitar Kita",
      "content": "Paragraf contoh penerapan materi dalam kehidupan sehari-hari..."
    }}
  ]
}}

### ATURAN WAJIB:
1. `version` HARUS "0.1".
2. `meta` WAJIB berisi title, mata_pelajaran, topik, dan fase.
3. Hasilkan 3-5 `sections` yang mengalir dari pengenalan, pendalaman, hingga contoh nyata.
4. Setiap section WAJIB memiliki `title` (string) dan `content` (string tunggal).
5. PENTING: Field `content` HARUS berupa SINGLE STRING, DILARANG menghasilkan array/list. Jika terdiri dari beberapa paragraf, pisahkan dengan newline ganda (\\n\\n).
6. Dilarang menghasilkan struktur JSON tambahan di luar spesifikasi ini.
7. Output HANYA JSON murni yang valid tanpa awalan markdown seperti ```json atau penutup apa pun.
"""
    return prompt.strip()

