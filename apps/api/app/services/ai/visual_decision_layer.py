"""
Visual Decision Layer & Image Prompt Builder.

Responsibilities:
1. Deterministically decide whether a slide warrants instructional visual generation.
2. Build child-friendly, pedagogically-tailored image prompts from slide metadata.
"""
import re
from app.schemas.presentation_artifact import PresentationSlide

# Keywords that signal *instructional* visual value (diagram, process, spatial, etc.)
# We intentionally keep this list focused to prevent decorative fluff (anti-AI-slop).
INSTRUCTIONAL_VISUAL_KEYWORDS = frozenset({
    # Processes & sequences
    "siklus", "daur", "proses", "tahap", "alur", "urutan", "langkah",
    "fase", "periode", "transformasi", "perubahan",
    # Diagrams & structures
    "diagram", "skema", "struktur", "anatomi", "bagian", "komponen",
    "organ", "sistem", "peta", "denah", "bagan",
    # Comparisons & spatial
    "perbandingan", "perbedaan", "persamaan", "vs", "versus",
    "posisi", "letak", "lokasi", "jarak", "arah",
    # Scientific / visual phenomena
    "ilustrasi", "visualisasi", "fenomena", "reaksi", "eksperimen",
    "rantai makanan", "jaring-jaring", "ekosistem", "habitat",
    "fotosintesis", "respirasi", "pencernaan", "peredaran darah",
    "tata surya", "planet", "bumi", "bulan", "matahari",
    "gunung berapi", "gempa", "tsunami", "erosi", "sedimentasi",
    "awan", "hujan", "angin", "cuaca", "iklim",
})


def should_generate_image(slide: PresentationSlide) -> bool:
    """
    Deterministic decision: should we attempt image generation for this slide?

    Rules:
    1. Only slides with type == "visual" are eligible.
    2. Skip if the slide already has assets injected (idempotency guard).
    3. Check if title + content contain semantic keywords indicating instructional
       visual value (e.g. diagrams, processes, structures).
    """
    if slide.type != "visual":
        return False

    if slide.assets:  # already has assets, skip
        return False

    candidate_text = " ".join(filter(None, [slide.title, slide.content])).lower()

    # Remove punctuation for cleaner matching
    candidate_text = re.sub(r"[^\w\s]", " ", candidate_text)
    words = set(candidate_text.split())

    # Check multi-word keywords first, then single words
    for kw in INSTRUCTIONAL_VISUAL_KEYWORDS:
        if " " in kw:
            if kw in candidate_text:
                return True
        else:
            if kw in words:
                return True

    return False


def build_image_prompt(slide: PresentationSlide, mata_pelajaran: str, fase: str) -> str:
    """
    Build a concise, descriptive image generation prompt from slide metadata.
    Targeted at educational illustration for Indonesian primary school (SD) students.
    """
    title = slide.title or "ilustrasi pembelajaran"
    content = (slide.content or "").strip()

    # Truncate long content to avoid overly complex prompts
    if len(content) > 200:
        content = content[:200] + "..."

    audience_hint = {
        "A": "untuk siswa kelas 1-2 SD (usia 6-8 tahun), gaya ilustrasi ramah anak",
        "B": "untuk siswa kelas 3-4 SD (usia 8-10 tahun), gaya ilustrasi jelas dan informatif",
        "C": "untuk siswa kelas 5-6 SD (usia 10-12 tahun), gaya ilustrasi semi-realistik dan edukatif",
    }.get(fase, "untuk siswa SD, gaya ilustrasi edukatif")

    prompt_parts = [
        f"Educational illustration: {title}.",
        f"Subject: {mata_pelajaran}.",
        f"Context: {content}" if content else "",
        f"Style: clean, colorful, {audience_hint}.",
        "No text overlays. White or light background. High clarity.",
        "Suitable for classroom display on a large interactive screen.",
    ]

    return " ".join(p for p in prompt_parts if p)
