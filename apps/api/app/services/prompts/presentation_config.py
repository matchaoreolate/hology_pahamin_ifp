"""
Lookup tables for presentation prompt configuration.
Maps mode_dinamika, kepadatan_teks, and gaya_interaksi to instruction strings.
"""

MODE_INSTRUCTIONS: dict[str, str] = {
    "fokus": (
        "Fokus pada penjelasan materi dan visual yang kaya. "
        "Dari {n} slide, sisipkan maksimal 2 slide interaktif di bagian akhir. "
        "Prioritaskan penjelasan materi yang terstruktur dan mudah dipahami."
    ),
    "seimbang": (
        "Seimbangkan teori dan interaksi. "
        "Setiap 2-3 slide teori, sisipkan 1 slide aktivitas interaktif "
        "(choice, matching, sorting, reveal, atau drag_drop)."
    ),
    "super_aktif": (
        "Minimalkan teks teori panjang. Ubah banyak slide menjadi aktivitas interaktif "
        "(choice, matching, sorting, reveal, drag_drop) dan diskusi kelas yang dinamis."
    ),
}

DENSITY_INSTRUCTIONS: dict[int, str] = {
    1: "Setiap slide hanya boleh berisi 1-3 KATA KUNCI UTAMA.",
    2: "Setiap slide maksimal 1 kalimat pendek + kata kunci.",
    3: "Setiap slide maksimal 2-3 poin singkat (bullet points).",
    4: "Setiap slide boleh ada 1 paragraf pendek (3-4 kalimat).",
    5: "Setiap slide boleh berisi penjelasan lengkap (1-2 paragraf).",
}

TEACHER_STYLE_INSTRUCTIONS: dict[str, str] = {
    "fasilitator": (
        "Gaya bahasa instruksi di layar harus interaktif & memantik diskusi: "
        "'Apa yang kalian amati?', 'Yuk coba tebak!'"
    ),
    "penceramah": (
        "Gaya bahasa instruksi harus lugas & informatif: "
        "'Perhatikan tahapan berikut...', 'Berikut penjelasannya.'"
    ),
}


def mode_instruction(mode: str, n: int) -> str:
    return MODE_INSTRUCTIONS.get(mode, "").replace("{n}", str(n))


def density_instruction(level: int) -> str:
    return DENSITY_INSTRUCTIONS.get(level, "Setiap slide maksimal 2-3 poin singkat.")


def teacher_style(style: str) -> str:
    return TEACHER_STYLE_INSTRUCTIONS.get(style, "")
