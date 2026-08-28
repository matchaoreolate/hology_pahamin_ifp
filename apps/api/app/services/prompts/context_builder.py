"""
Builds contextual preambles for AI prompts based on:
- Fase (A/B/C) → vocabulary & cognitive complexity
- Konteks geografis → local examples
- Level kemampuan → depth of material
- Apersepsi → bridge from previous lesson
"""
from dataclasses import dataclass


@dataclass
class LearningContextData:
    """Flat data class passed to prompt builders."""
    fase: str
    kelas: str
    mata_pelajaran: str
    topik: str
    tujuan_pembelajaran: str
    alokasi_waktu_jp: int
    fokus_pendekatan: list[str] | None
    konteks_geografis: str | None
    level_kemampuan_kelas: str | None
    apersepsi: str | None


# =============================================
# Fase Instructions
# =============================================

FASE_INSTRUCTIONS = {
    "A": (
        "Kamu sedang membuat materi untuk siswa Kelas 1 dan 2 SD (Fase A). "
        "WAJIB menggunakan kosa kata yang SANGAT sederhana, kalimat pendek maksimal 8 kata. "
        "Gunakan banyak analogi dari kehidupan sehari-hari anak usia 6-8 tahun. "
        "Hindari istilah teknis sama sekali. Gunakan ilustrasi deskriptif yang ramah anak. "
        "Nada bahasa harus seperti kakak bercerita kepada adik kecil."
    ),
    "B": (
        "Kamu sedang membuat materi untuk siswa Kelas 3 dan 4 SD (Fase B). "
        "Gunakan kosa kata sederhana namun mulai perkenalkan istilah kunci secara bertahap. "
        "Siswa sudah mampu mengikuti logika sebab-akibat sederhana. "
        "Sertakan contoh konkret dari lingkungan sekitar mereka. "
        "Kalimat boleh lebih panjang, maksimal 12-15 kata."
    ),
    "C": (
        "Kamu sedang membuat materi untuk siswa Kelas 5 dan 6 SD (Fase C). "
        "Siswa sudah mampu berpikir analitis dan abstrak secara terbatas. "
        "Perkenalkan istilah ilmiah dengan penjelasan singkat. "
        "Bisa menggunakan perbandingan, kategori, dan diagram konsep sederhana. "
        "Dorong siswa untuk berhipotesis dan berpikir kritis."
    ),
}


# =============================================
# Geographical Context Examples
# =============================================

GEO_EXAMPLES = {
    "pesisir": (
        "Untuk contoh dan ilustrasi, WAJIB menggunakan konteks wilayah pesisir/pantai: "
        "nelayan, perahu, ikan, tambak, garam, ombak, mercusuar, pelabuhan, mangrove, terumbu karang. "
        "JANGAN gunakan contoh tentang pertanian pegunungan, kebun teh, atau salju."
    ),
    "perkotaan": (
        "Untuk contoh dan ilustrasi, gunakan konteks perkotaan: "
        "gedung, angkutan umum (bus/MRT/ojol), pasar modern, mal, lampu lalu lintas, "
        "apartemen, taman kota, pabrik, kantor. "
        "Hindari contoh yang terlalu rural atau agraris."
    ),
    "pegunungan": (
        "Untuk contoh dan ilustrasi, gunakan konteks pegunungan/pedesaan: "
        "kebun sayur, ladang, sungai jernih, hutan, sawah terasering, peternak, "
        "embun pagi, kabut, kopi, teh, singkong, jagung. "
        "Hindari contoh perkotaan atau pantai."
    ),
}


# =============================================
# Level Kemampuan Instructions
# =============================================

LEVEL_INSTRUCTIONS = {
    "belum_paham": (
        "Mayoritas siswa BELUM memahami konsep dasar materi ini. "
        "Perpanjang sesi analogi dan visualisasi SEBELUM masuk ke konsep inti. "
        "Gunakan pendekatan scaffolding bertahap. "
        "Kurangi jumlah soal HOTS, fokus pada pemahaman dasar."
    ),
    "sudah_paham": (
        "Mayoritas siswa SUDAH memahami konsep dasar. "
        "Padatkan penjelasan teori, langsung masuk ke penerapan dan tantangan. "
        "Perbanyak soal HOTS dan aktivitas interaktif yang menantang. "
        "Bisa menyisipkan koneksi ke materi lanjutan."
    ),
    "campuran": (
        "Kemampuan kelas CAMPURAN (ada yang sudah paham, ada yang belum). "
        "Mulai dari dasar namun beri 'fast track' bagi yang sudah paham. "
        "Sertakan tantangan opsional di akhir setiap sesi. "
        "Gunakan aktivitas kolaboratif agar siswa bisa saling membantu."
    ),
}


# =============================================
# Fokus Pendekatan
# =============================================

FOKUS_INSTRUCTIONS = {
    "analogi_sehari_hari": (
        "Perbanyak analogi dari kehidupan sehari-hari siswa. "
        "Setiap konsep baru WAJIB dimulai dengan 'Bayangkan kalau...' atau 'Mirip seperti...'"
    ),
    "visual_gambar": (
        "Perbanyak elemen visual. Setiap slide wajib ada deskripsi ilustrasi yang detail. "
        "Gunakan diagram, skema, dan perbandingan visual."
    ),
    "aktivitas_fisik": (
        "Sisipkan instruksi aktivitas fisik ringan: maju ke depan kelas, menyentuh layar TV, "
        "bermain drama singkat, atau gerakan tubuh untuk mengingat konsep."
    ),
}


def build_context_preamble(ctx: LearningContextData) -> str:
    """Build a rich contextual preamble string for any prompt."""
    parts = []

    # Fase
    parts.append(FASE_INSTRUCTIONS.get(ctx.fase, ""))

    # Geographic context
    if ctx.konteks_geografis:
        parts.append(GEO_EXAMPLES.get(ctx.konteks_geografis, ""))

    # Level kemampuan
    if ctx.level_kemampuan_kelas:
        parts.append(LEVEL_INSTRUCTIONS.get(ctx.level_kemampuan_kelas, ""))

    # Fokus pendekatan
    if ctx.fokus_pendekatan:
        for fokus in ctx.fokus_pendekatan:
            if instr := FOKUS_INSTRUCTIONS.get(fokus):
                parts.append(instr)

    return "\n\n".join(filter(None, parts))


def build_apersepsi_instruction(apersepsi: str | None, topik: str) -> str:
    """Generate instruction to bridge from previous lesson."""
    if not apersepsi:
        return ""
    return (
        f"PENTING: Mulai materi ini dengan jembatan ke pelajaran sebelumnya. "
        f"Materi minggu lalu adalah: '{apersepsi}'. "
        f"Slide pertama atau paragraf pembuka WAJIB menghubungkan '{apersepsi}' "
        f"dengan topik hari ini yaitu '{topik}'. "
        f"Contoh: 'Masih ingat kita belajar tentang {apersepsi}? "
        f"Hari ini kita akan menemukan trik ajaib yang berhubungan dengan itu!'"
    )
