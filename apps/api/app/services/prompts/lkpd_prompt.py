"""Builds the LKPD (student worksheet) generation prompt."""
from app.services.prompts.context_builder import (
    LearningContextData,
    build_context_preamble,
)


def build_lkpd_prompt(ctx: LearningContextData, config: dict) -> str:
    preamble = build_context_preamble(ctx)

    format_tantangan = config.get("format_tantangan", "campuran")
    jumlah_soal = config.get("jumlah_soal", 10)
    distribusi = config.get("distribusi_kesulitan", "50_mudah_50_hots")
    injeksi_lokal = config.get("injeksi_konteks_lokal", True)
    rubrik = config.get("rubrik_penilaian", True)

    dist_map = {
        "70_mudah_30_hots": (round(jumlah_soal * 0.7), round(jumlah_soal * 0.3)),
        "50_mudah_50_hots": (round(jumlah_soal * 0.5), round(jumlah_soal * 0.5)),
        "30_mudah_70_hots": (round(jumlah_soal * 0.3), round(jumlah_soal * 0.7)),
    }
    mudah_count, hots_count = dist_map.get(distribusi, (5, 5))

    lokal_instruction = (
        f"WAJIB: Semua soal cerita menggunakan latar belakang konteks {ctx.konteks_geografis}. "
        f"Gunakan nama tokoh, tempat, dan benda yang familiar di wilayah {ctx.konteks_geografis}."
        if injeksi_lokal and ctx.konteks_geografis else ""
    )

    rubrik_instruction = (
        "Sertakan field 'rubrik' berisi kunci jawaban dan bobot skor per soal."
        if rubrik else "Jangan sertakan kunci jawaban (field rubrik kosong)."
    )

    prompt = f"""
Kamu adalah sistem generator LKPD (Lembar Kerja Peserta Didik) AI untuk guru Sekolah Dasar Indonesia.

## KONTEKS PEDAGOGIK
{preamble}

## MATERI
- Mata Pelajaran: {ctx.mata_pelajaran}
- Topik: {ctx.topik}
- Tujuan Pembelajaran: {ctx.tujuan_pembelajaran}
- Fase: {ctx.fase} (Kelas {ctx.kelas})

{lokal_instruction}

## KONFIGURASI SOAL
- Format: {format_tantangan}
- Total Soal: {jumlah_soal}
- Soal Mudah (C1-C3 Bloom): {mudah_count} soal
- Soal HOTS (C4-C6 Bloom): {hots_count} soal

## OUTPUT JSON

{{
  "header": {{
    "mata_pelajaran": "{ctx.mata_pelajaran}",
    "topik": "{ctx.topik}",
    "fase": "{ctx.fase}",
    "kelas": "{ctx.kelas}",
    "alokasi_waktu": "{ctx.alokasi_waktu_jp * 35} menit"
  }},
  "soal": [
    {{
      "nomor": 1,
      "tipe": "isian_singkat|pilihan_ganda|mencocokkan",
      "tingkat": "mudah|hots",
      "bloom_level": "C1|C2|C3|C4|C5|C6",
      "pertanyaan": "Teks pertanyaan",
      "opsi": ["A. ...", "B. ...", "C. ...", "D. ..."],
      "jawaban_benar": "A",
      "skor": 10
    }}
  ],
  "rubrik": {{
    "total_skor": 100,
    "kunci_jawaban": {{"1": "A", "2": "B"}},
    "pedoman_penskoran": "..."
  }}
}}

PENTING:
- Untuk pilihan ganda: sertakan 4 opsi (A-D), 1 benar, pengecoh yang masuk akal.
- Untuk isian singkat: jawaban harus jelas dan singkat.
- {rubrik_instruction}
- Output HANYA JSON, tanpa penjelasan tambahan.
"""
    return prompt.strip()
