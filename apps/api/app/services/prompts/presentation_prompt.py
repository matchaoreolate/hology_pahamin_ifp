"""
Builds the full prompt for generating Interactive TV Presentation slides (PresentationArtifact v0.2).

Interaction primitives recognised by this system (schema + prompt + FE must stay in sync):
  choice | matching | sorting | reveal | drag_drop

Module layout:
  presentation_config.py    — mode/density/style lookup tables & helpers
  presentation_templates.py — static JSON schema example + interaction rules
  presentation_prompt.py    — this file; assembles the final prompt string
"""
from app.services.prompts.context_builder import (
    LearningContextData,
    build_apersepsi_instruction,
    build_context_preamble,
)
from app.services.prompts.presentation_config import (
    density_instruction,
    mode_instruction,
    teacher_style,
)
from app.services.prompts.presentation_templates import INTERACTION_RULES, SCHEMA_TEMPLATE


def build_presentation_prompt(ctx: LearningContextData, config: dict) -> str:
    """Assemble the full Gemini prompt for PresentationArtifact v0.2."""
    gaya_visual = config.get("gaya_visual", "cute_3d")
    mode_dinamika = config.get("mode_dinamika", "seimbang")
    ice_breaking = config.get("ice_breaking", False)
    kepadatan_teks = config.get("kepadatan_teks", 3)
    gaya_interaksi = config.get("gaya_interaksi", "fasilitator")
    instruksi_spesifik = config.get("instruksi_spesifik", "")

    n = 8 if ctx.alokasi_waktu_jp == 1 else 16

    schema_example = SCHEMA_TEMPLATE.format(
        topik=ctx.topik,
        mata_pelajaran=ctx.mata_pelajaran,
        fase=ctx.fase,
        n=n,
    )

    extra_lines = []
    if ice_breaking:
        extra_lines.append(
            "- Sisipkan aktivitas pemantik/penyegar yang menyenangkan "
            "di slide pembuka atau di antara sub-materi."
        )
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
- Mode Dinamika: {mode_instruction(mode_dinamika, n)}
- Kepadatan Teks: {density_instruction(kepadatan_teks)}
- Gaya Interaksi Guru: {teacher_style(gaya_interaksi)}
{chr(10).join(extra_lines)}

## SPESIFIKASI KONTRAK OUTPUT JSON (PresentationArtifact v0.2)

Hasilkan tepat {n} slide dalam format JSON berikut:

{schema_example}

### ATURAN SLIDE & KUALITAS KONTEN:
1. `type` HANYA boleh: "opening", "content", "visual", "interactive", "closing".
2. Slide pertama (order 1) HARUS bertipe "opening". Beri judul pembuka yang ceria dan seru (sertakan emoji menarik seperti 🚀, ✨, 🌟, 🌱).
3. Slide terakhir HARUS bertipe "closing" berisi pesan apresiasi dan rangkuman seru ("Hebat! Kalian Luar Biasa! 🎉").
4. Slide "visual" WAJIB memiliki `assets: []` (list kosong) — backend akan men-generate ilustrasi 3D otomatis.
   Beri `title` yang spesifik dan `content` yang deskriptif mengenai adegan visualnya agar ilustrasi yang dihasilkan AI sangat jelas dan relevan.
   Contoh: `title: "Metamorfosis Ulat Menjadi Kepompong 🐛"`, `content: "Seekor ulat hijau lucu sedang menempel di ranting pohon dan mulai membungkus dirinya menjadi kepompong emas."`
{INTERACTION_RULES}
6. Struktur Pedagogi 4A (Wajib Diikuti untuk Pembelajaran SD Interaktif):
   - **Apersepsi (Opening)**: Mulai dengan menghubungkan materi ke kehidupan nyata siswa yang memicu rasa penasaran ("Pernahkah kalian melihat...?").
   - **Aktivitas Eksplorasi (Visual & Content)**: Gambar 3D menarik dan penjelasan konsep bertahap dengan analogi ramah anak.
   - **Aksi Interaktif (Interactive)**: Slide interaktif (kuis/sorting/drag-drop/matching) yang seru untuk disentuh siswa di layar TV IFP kelas.
   - **Apresiasi & Refleksi (Closing)**: Kesimpulan menyenangkan dan pujian antusias untuk seluruh siswa di kelas.
   - Variasikan alur: Opening → Content → Visual → Interactive → Content → Visual → Interactive → Closing.
   - PENTING untuk efisiensi: Batasi teks per slide agar padat dan fokus (maksimal 2-3 kalimat atau 3 poin per slide). Jangan menghasilkan teks yang bertele-tele agar tidak terpotong.

PENTING:
- Field `content` HARUS bertipe STRING (teks tunggal), DILARANG menghasilkan list/array untuk content. Jika ada poin-poin, gabungkan menjadi satu string dengan pemisah baris baru (\n).
- DILARANG menghasilkan tag HTML atau JavaScript mentah.
- DILARANG mengarang URL, path, atau link gambar dalam field `assets`.
- Bahasa Indonesia yang digunakan harus santun, komunikatif, dan sesuai fase perkembangan anak SD.
- Output HANYA JSON murni yang valid tanpa teks pembuka atau penutup markdown lainnya di luar JSON."""

    return prompt.strip()
