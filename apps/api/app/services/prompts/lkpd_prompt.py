"""Builds the LKPD (student worksheet) generation prompt (Contract v0.1)."""
from app.services.prompts.context_builder import (
    LearningContextData,
    build_context_preamble,
)


def build_lkpd_prompt(ctx: LearningContextData, config: dict) -> str:
    preamble = build_context_preamble(ctx)

    format_tantangan = config.get("format_tantangan", "campuran")
    jumlah_soal = config.get("jumlah_soal", 5)
    injeksi_lokal = config.get("injeksi_konteks_lokal", True)

    lokal_instruction = (
        f"WAJIB: Soal cerita dan aktivitas menggunakan latar belakang konteks {ctx.konteks_geografis}. "
        f"Gunakan nama tokoh, tempat, atau benda lokal yang akrab bagi siswa di wilayah {ctx.konteks_geografis}."
        if injeksi_lokal and ctx.konteks_geografis else ""
    )

    prompt = f"""
Kamu adalah sistem generator LKPD (Lembar Kerja Peserta Didik) AI untuk guru Sekolah Dasar Indonesia.
Hasilkan dokumen LKPD terstruktur untuk dicetak dan dikerjakan oleh siswa SD.

## KONTEKS PEDAGOGIK
{preamble}

## MATERI
- Mata Pelajaran: {ctx.mata_pelajaran}
- Topik: {ctx.topik}
- Tujuan Pembelajaran: {ctx.tujuan_pembelajaran}
- Fase: {ctx.fase} (Kelas {ctx.kelas})
- Alokasi Waktu: {ctx.alokasi_waktu_jp * 35} menit

{lokal_instruction}

## SPESIFIKASI KONTRAK OUTPUT JSON (LKPD v0.1)

Hasilkan output JSON murni dengan format persis seperti ini:

{{
  "version": "0.1",
  "meta": {{
    "title": "LKPD {ctx.topik}",
    "mata_pelajaran": "{ctx.mata_pelajaran}",
    "topik": "{ctx.topik}",
    "fase": "{ctx.fase}",
    "alokasi_waktu_menit": {ctx.alokasi_waktu_jp * 35}
  }},
  "sections": [
    {{
      "title": "Ayo Mengamati",
      "instruction": "Amati benda atau peristiwa berikut dengan saksama.",
      "activities": [
        {{
          "type": "question",
          "question": "Pertanyaan pengamatan...",
          "answer_space": "lined"
        }}
      ]
    }},
    {{
      "title": "Ayo Berdiskusi",
      "instruction": "Diskusikan bersama teman kelompokmu.",
      "activities": [
        {{
          "type": "instruction",
          "content": "Petunjuk aktivitas diskusi kelompok..."
        }}
      ]
    }},
    {{
      "title": "Ayo Berlatih",
      "instruction": "Jawablah pertanyaan-pertanyaan berikut secara mandiri.",
      "activities": [
        {{
          "type": "question",
          "question": "Pertanyaan latihan singkat...",
          "answer_space": "short"
        }},
        {{
          "type": "question",
          "question": "Pertanyaan latihan analisis...",
          "answer_space": "boxed"
        }}
      ]
    }}
  ]
}}

### ATURAN WAJIB:
1. `version` HARUS "0.1".
2. `meta.alokasi_waktu_menit` berupa ANGKA positif (contoh: {ctx.alokasi_waktu_jp * 35}), BUKAN string.
3. Minimal 2-4 `sections` yang menggambarkan alur belajar pedagogis (misal: Mengamati, Mencoba/Mendiskusikan, Berlatih).
4. `activities` hanya boleh bertipe:
   - "question": WAJIB ada field `question` (string) dan `answer_space` ("lined" | "boxed" | "short").
   - "instruction": WAJIB ada field `content` (string).
5. DILARANG membuat tipe activity di luar "question" dan "instruction".
6. Bahasa ramah anak SD, jelas, komunikatif, dan sesuai fase perkembangan anak SD.
7. Output HANYA JSON murni yang valid tanpa awalan markdown seperti ```json atau penutup apa pun.
"""
    return prompt.strip()

