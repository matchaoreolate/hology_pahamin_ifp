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
    Every visual slide created by the teacher/AI should have a high-quality illustration.
    """
    if slide.type != "visual":
        return False

    if slide.assets:  # already has assets, skip
        return False

    return True


def build_image_prompt(slide: PresentationSlide, mata_pelajaran: str, fase: str) -> str:
    """
    Build an engaging, vivid 3D illustration prompt for educational slides.
    Targeted at delightful, kid-friendly visual appeal for primary school (SD) interactive screens.
    """
    title = slide.title or "ilustrasi pembelajaran"
    content = (slide.content or "").strip()

    # Truncate long content to avoid overly complex prompts
    if len(content) > 180:
        content = content[:180] + "..."

    prompt_parts = [
        f"Delightful, high-quality 3D digital illustration of {title}.",
        f"Subject theme: {mata_pelajaran}.",
        f"Context details: {content}." if content else "",
        "Style: Pixar and Disney 3D animation style, bright vibrant pastel colors, adorable character designs, warm and friendly atmosphere.",
        "Educational illustration, clean soft studio lighting, soft shadows, clear focal point.",
        "Completely textless, no words, no letters, no labels, no watermark, high resolution 4k render.",
    ]

    return " ".join(p for p in prompt_parts if p)
