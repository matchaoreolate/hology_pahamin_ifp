"""
Builds the full prompt for generating Interactive TV Presentation slides (PresentationArtifact v0.2).
"""
from app.services.prompts.context_builder import (
    LearningContextData,
    build_apersepsi_instruction,
    build_context_preamble,
)

_MODE_INSTRUCTIONS: dict[str, str] = {
    "fokus": (
        "Fokus pada penjelasan materi dan visual yang kaya. "
        "Dari {n} slide, sisipkan maksimal 2 slide interaktif di bagian akhir. "
        "Prioritaskan penjelasan materi yang terstruktur dan mudah dipahami."
    ),
    "seimbang": (
        "Seimbangkan teori dan interaksi. "
        "Setiap 2-3 slide teori, sisipkan 1 slide aktivitas interaktif "
        "(choice, matching, sorting, atau reveal)."
    ),
    "super_aktif": (
        "Minimalkan teks teori panjang. Ubah banyak slide menjadi aktivitas interaktif "
        "(choice, matching, sorting, reveal) dan diskusi kelas yang dinamis."
    ),
}

_DENSITY_INSTRUCTIONS: dict[int, str] = {
    1: "Setiap slide hanya boleh berisi 1-3 KATA KUNCI UTAMA.",
    2: "Setiap slide maksimal 1 kalimat pendek + kata kunci.",
    3: "Setiap slide maksimal 2-3 poin singkat (bullet points).",
    4: "Setiap slide boleh ada 1 paragraf pendek (3-4 kalimat).",
    5: "Setiap slide boleh berisi penjelasan lengkap (1-2 paragraf).",
}

_TEACHER_STYLE_INSTRUCTIONS: dict[str, str] = {
    "fasilitator": "Gaya bahasa instruksi di layar harus interaktif & memantik diskusi: 'Apa yang kalian amati?', 'Yuk coba tebak!'",
    "penceramah": "Gaya bahasa instruksi harus lugas & informatif: 'Perhatikan tahapan berikut...', 'Berikut penjelasannya.'",
}


def _mode_instruction(mode: str, n: int) -> str:
    return _MODE_INSTRUCTIONS.get(mode, "").replace("{n}", str(n))


def _density_instruction(level: int) -> str:
    return _DENSITY_INSTRUCTIONS.get(level, "Setiap slide maksimal 2-3 poin singkat.")


def _teacher_style(style: str) -> str:
    return _TEACHER_STYLE_INSTRUCTIONS.get(style, "")


_SCHEMA_TEMPLATE = """\
{{
  "version": "0.2",
  "meta": {{
    "title": "{topik}",
    "mata_pelajaran": "{mata_pelajaran}",
    "topik": "{topik}",
    "fase": "{fase}",
    "total_slides": {n}
  }},
  "slides": [
    {{
      "id": "slide-1",
      "order": 1,
      "type": "opening",
      "title": "Judul Slide Pembuka",
      "content": "Pengantar topik pembelajaran",
      "assets": [],
      "interaction": null,
      "teacher_note": "Ajak siswa fokus dan mulai dengan apersepsi",
      "speaker_script": "Halo anak-anak hebat! Hari ini kita akan belajar tentang..."
    }}
  ]
}}"""

_INTERACTION_RULES = """\
5. Untuk slide bertipe "interactive", field `interaction` HARUS menggunakan salah satu dari 4 primitive:

   a) **Choice** (`"type": "choice"`): instruction, options[{id,label}], correct_answer, feedback{correct,incorrect}
   b) **Matching** (`"type": "matching"`): instruction, pairs[{id,left{id,label},right{id,label}}], feedback
   c) **Sorting** (`"type": "sorting"`): instruction, categories[{id,label}], items[{id,label,correct_category}], feedback
   d) **Reveal** (`"type": "reveal"`): instruction, items[{id,label,revealed_content,asset?}]"""


def build_presentation_prompt(ctx: LearningContextData, config: dict) -> str:
    """Build structured Gemini prompt for PresentationArtifact v0.2."""
    gaya_visual = config.get("gaya_visual", "cute_3d")
    mode_dinamika = config.get("mode_dinamika", "seimbang")
    ice_breaking = config.get("ice_breaking", False)
    kepadatan_teks = config.get("kepadatan_teks", 3)
    gaya_interaksi = config.get("gaya_interaksi", "fasilitator")
    instruksi_spesifik = config.get("instruksi_spesifik", "")

    n = 8 if ctx.alokasi_waktu_jp == 1 else 16

    schema_example = _SCHEMA_TEMPLATE.format(
        topik=ctx.topik,
        mata_pelajaran=ctx.mata_pelajaran,
        fase=ctx.fase,
        n=n,
    )

    extra_lines = []
    if ice_breaking:
        extra_lines.append("- Sisipkan aktivitas pemantik/penyegar yang menyenangkan di slide pembuka atau di antara sub-materi.")
    if instruksi_spesifik:
        extra_lines.append(f"- Instruksi Khusus dari Guru: {instruksi_spesifik}")

    prompt = f"""\
Kamu adalah sistem generator materi pembelajaran AI untuk guru Sekolah Dasar Indonesia.
Tugasmu adalah menghasilkan data JSON untuk presentasi interaktif yang akan ditampilkan di layar TV interaktif (Interactive Flat Panel) di kelas.

## KONTEKS PEDAGOGIK
{build_context_preamble(ctx)}

## MATA PELAJARAN & MATERI
- Mata Pelajaran: {ctx.mata_pelajaran}
- Topik: {ctx.topik}
- Tujuan Pembelajaran: {ctx.tujuan_pembelajaran}
- Alokasi Waktu: {ctx.alokasi_waktu_jp} JP ({ctx.alokasi_waktu_jp * 35} menit)

{build_apersepsi_instruction(ctx.apersepsi, ctx.topik)}

## KONFIGURASI PRESENTASI
- Gaya Visual: {gaya_visual}
- Mode Dinamika: {_mode_instruction(mode_dinamika, n)}
- Kepadatan Teks: {_density_instruction(kepadatan_teks)}
- Gaya Interaksi Guru: {_teacher_style(gaya_interaksi)}
{chr(10).join(extra_lines)}

## SPESIFIKASI KONTRAK OUTPUT JSON (PresentationArtifact v0.2)

Hasilkan tepat {n} slide dalam format JSON berikut:

{schema_example}

### ATURAN SLIDE:
1. `type` HANYA boleh: "opening", "content", "visual", "interactive", "closing".
2. Slide pertama (order 1) HARUS bertipe "opening".
3. Slide terakhir HARUS bertipe "closing".
4. Slide "visual" harus menyertakan `assets` berupa list dengan `{{"id","type","url","alt"}}`.
{_INTERACTION_RULES}

PENTING:
- DILARANG menghasilkan tag HTML atau JavaScript mentah.
- DILARANG menciptakan tipe interaksi baru di luar choice, matching, sorting, reveal.
- Bahasa Indonesia yang digunakan harus santun, komunikatif, dan sesuai fase perkembangan anak SD.
- Output HANYA JSON murni yang valid tanpa teks pembuka atau penutup markdown lainnya di luar JSON."""

    return prompt.strip()
