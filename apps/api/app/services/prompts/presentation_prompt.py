"""
Builds the full prompt for generating Interactive TV Presentation slides.
"""
from app.services.prompts.context_builder import (
    LearningContextData,
    build_apersepsi_instruction,
    build_context_preamble,
)


def build_presentation_prompt(
    ctx: LearningContextData,
    config: dict,
) -> str:
    """
    Build a comprehensive prompt for generating presentation slides.
    Returns a prompt that instructs Gemini to output structured JSON.
    """
    preamble = build_context_preamble(ctx)
    apersepsi = build_apersepsi_instruction(ctx.apersepsi, ctx.topik)

    # Config params
    gaya_visual = config.get("gaya_visual", "cute_3d")
    mode_dinamika = config.get("mode_dinamika", "seimbang")
    ice_breaking = config.get("ice_breaking", False)
    kepadatan_teks = config.get("kepadatan_teks", 3)
    gaya_interaksi = config.get("gaya_interaksi", "fasilitator")
    instruksi_spesifik = config.get("instruksi_spesifik", "")
    alokasi = ctx.alokasi_waktu_jp

    # Slide count based on JP
    target_slides = 8 if alokasi == 1 else 16

    # Mode dinamika instructions
    mode_instructions = {
        "fokus": (
            "Fokus pada penceritaan visual yang kaya. "
            f"Dari {target_slides} slide, sisipkan maksimal 2 slide interaktif di bagian akhir. "
            "Prioritaskan penjelasan mendalam dengan ilustrasi yang kuat."
        ),
        "seimbang": (
            "Seimbangkan teori dan interaksi. "
            "Setiap 2-3 slide teori, sisipkan 1 slide aktivitas interaktif "
            "(tebak gambar, drag-and-drop, atau kuis cepat)."
        ),
        "super_aktif": (
            "Minimalkan teks teori. Ubah sebagian besar slide menjadi permainan interaktif, "
            "kuis layar sentuh, dan aktivitas fisik. "
            "Ideal untuk review materi yang sudah pernah dipelajari."
        ),
    }

    # Text density instruction
    density_instruction = {
        1: "Setiap slide hanya boleh berisi 1-3 KATA KUNCI RAKSASA. Tidak ada paragraf.",
        2: "Setiap slide maksimal 1 kalimat pendek + kata kunci.",
        3: "Setiap slide maksimal 2-3 poin singkat (bullet point).",
        4: "Setiap slide boleh ada 1 paragraf pendek (3-4 kalimat).",
        5: "Setiap slide boleh berisi penjelasan lengkap (1-2 paragraf).",
    }.get(kepadatan_teks, "Setiap slide maksimal 3 poin singkat.")

    ice_breaking_instruction = (
        "WAJIB sisipkan 1 slide 'Ice Breaking' berisi aktivitas fisik ringan "
        "(contoh: 'Ayo berdiri dan tirukan gaya...!') di setiap pergantian sub-materi besar."
        if ice_breaking else ""
    )

    interaksi_instruction = {
        "fasilitator": "Gaya bahasa instruksi di layar harus mendorong diskusi: 'Apa pendapat kalian?', 'Coba tebak!'",
        "penceramah": "Gaya bahasa instruksi harus informatif dan langsung: 'Perhatikan...', 'Ini adalah...'",
    }.get(gaya_interaksi, "")

    prompt = f"""
Kamu adalah sistem generator materi pembelajaran AI untuk guru Sekolah Dasar Indonesia.
Tugasmu adalah menghasilkan data JSON untuk presentasi interaktif yang akan ditampilkan di layar TV besar (Interactive Flat Panel) di kelas.

## KONTEKS PEDAGOGIK
{preamble}

## MATA PELAJARAN & MATERI
- Mata Pelajaran: {ctx.mata_pelajaran}
- Topik: {ctx.topik}
- Tujuan Pembelajaran: {ctx.tujuan_pembelajaran}
- Alokasi Waktu: {alokasi} JP ({alokasi * 35} menit)

{apersepsi}

## KONFIGURASI PRESENTASI
- Gaya Visual: {gaya_visual} (deskripsikan elemen visual sesuai gaya ini di setiap slide)
- Mode Dinamika: {mode_instructions.get(mode_dinamika, "")}
- Kepadatan Teks: {density_instruction}
- Gaya Interaksi Guru: {interaksi_instruction}
{ice_breaking_instruction}
{"- Instruksi Khusus dari Guru: " + instruksi_spesifik if instruksi_spesifik else ""}

## INSTRUKSI OUTPUT JSON

Hasilkan tepat {target_slides} slide dalam format JSON berikut:

{{
  "theme": "{gaya_visual}",
  "mata_pelajaran": "{ctx.mata_pelajaran}",
  "topik": "{ctx.topik}",
  "fase": "{ctx.fase}",
  "total_slides": {target_slides},
  "slides": [
    {{
      "slide_number": 1,
      "type": "opening|content|interactive|ice_breaking|closing",
      "title": "Judul slide",
      "content": "Konten utama slide (sesuai kepadatan teks yang diminta)",
      "visual_description": "Deskripsikan ilustrasi/gambar yang harus ada di slide ini secara detail",
      "teacher_note": "Catatan untuk guru tentang cara menyampaikan slide ini",
      "interactive_element": null,
      "speaker_script": "Skrip singkat yang bisa dibaca guru saat menampilkan slide ini"
    }}
  ]
}}

Untuk slide bertipe "interactive", tambahkan field:
{{
  "interactive_element": {{
    "type": "quiz|drag_drop|touch_reveal|true_false",
    "instruction": "Instruksi untuk siswa",
    "items": [...],
    "answer": "..."
  }}
}}

PENTING:
- Slide pertama HARUS bertipe "opening" dengan apersepsi jika ada.
- Slide terakhir HARUS bertipe "closing" berisi ringkasan dan motivasi.
- Gunakan Bahasa Indonesia yang sesuai dengan fase siswa.
- Semua deskripsi visual harus spesifik dan mengacu pada gaya {gaya_visual}.
- Output HANYA JSON, tanpa penjelasan tambahan di luar JSON.
"""
    return prompt.strip()
