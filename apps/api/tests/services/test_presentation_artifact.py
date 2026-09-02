import pytest
from pydantic import ValidationError

from app.schemas.presentation_artifact import (
    Asset,
    ChoiceInteraction,
    DragDropInteraction,
    MatchingInteraction,
    PresentationArtifact,
    PresentationMeta,
    PresentationSlide,
    RevealInteraction,
    SortingInteraction,
)


def test_valid_presentation_artifact():
    data = {
        "version": "0.2",
        "meta": {
            "title": "Siklus Air",
            "mata_pelajaran": "IPAS",
            "topik": "Siklus Air",
            "fase": "Fase C",
            "total_slides": 4,
        },
        "slides": [
            {
                "id": "slide-1",
                "order": 1,
                "type": "opening",
                "title": "Selamat Datang",
                "content": "Pengantar siklus air.",
                "assets": [],
                "interaction": None,
                "teacher_note": "Ajak siswa mengamati air",
                "speaker_script": "Halo semua!",
            },
            {
                "id": "slide-2",
                "order": 2,
                "type": "visual",
                "title": "Gambar Siklus Air",
                "content": "Berikut prosesnya",
                "assets": [
                    {
                        "id": "asset-1",
                        "type": "image",
                        "url": "https://example.com/siklus.png",
                        "alt": "Diagram siklus air",
                    }
                ],
                "interaction": None,
            },
            {
                "id": "slide-3",
                "order": 3,
                "type": "interactive",
                "title": "Kuis Cepat",
                "assets": [],
                "interaction": {
                    "type": "choice",
                    "instruction": "Manakah proses penguapan air?",
                    "options": [
                        {"id": "opt-1", "label": "Evaporasi"},
                        {"id": "opt-2", "label": "Presipitasi"},
                    ],
                    "correct_answer": "opt-1",
                    "feedback": {
                        "correct": "Tepat sekali!",
                        "incorrect": "Coba lagi!",
                    },
                },
            },
            {
                "id": "slide-4",
                "order": 4,
                "type": "closing",
                "title": "Kesimpulan",
                "content": "Air sangat penting bagi kehidupan.",
                "assets": [],
                "interaction": None,
            },
        ],
    }

    artifact = PresentationArtifact.model_validate(data)
    assert artifact.version == "0.2"
    assert len(artifact.slides) == 4
    assert artifact.slides[2].interaction.type == "choice"


def test_matching_sorting_reveal_interactions():
    matching_data = {
        "type": "matching",
        "instruction": "Pasangkan konsep",
        "pairs": [
            {
                "id": "p1",
                "left": {"id": "l1", "label": "Awan"},
                "right": {"id": "r1", "label": "Kondensasi"},
            },
            {
                "id": "p2",
                "left": {"id": "l2", "label": "Hujan"},
                "right": {"id": "r2", "label": "Presipitasi"},
            },
        ],
        "feedback": {"correct": "Bagus!", "incorrect": "Salah!"},
    }
    matching = MatchingInteraction.model_validate(matching_data)
    assert matching.type == "matching"
    assert len(matching.pairs) == 2

    sorting_data = {
        "type": "sorting",
        "instruction": "Kelompokkan",
        "categories": [
            {"id": "c1", "label": "Darat"},
            {"id": "c2", "label": "Air"},
        ],
        "items": [
            {"id": "i1", "label": "Sapi", "correct_category": "c1"},
            {"id": "i2", "label": "Ikan", "correct_category": "c2"},
        ],
        "feedback": {"correct": "Bagus!", "incorrect": "Salah!"},
    }
    sorting = SortingInteraction.model_validate(sorting_data)
    assert sorting.type == "sorting"

    reveal_data = {
        "type": "reveal",
        "instruction": "Klik untuk buka",
        "items": [
            {
                "id": "r1",
                "label": "Fakta 1",
                "revealed_content": "Air menutupi 71% bumi",
            }
        ],
    }
    reveal = RevealInteraction.model_validate(reveal_data)
    assert reveal.type == "reveal"


def test_invalid_slide_type_fails():
    invalid_data = {
        "version": "0.2",
        "meta": {
            "title": "Test",
            "mata_pelajaran": "IPA",
            "topik": "Test",
            "fase": "A",
            "total_slides": 1,
        },
        "slides": [
            {
                "id": "slide-1",
                "order": 1,
                "type": "unsupported_type",
                "title": "Invalid",
            }
        ],
    }
    with pytest.raises(ValidationError):
        PresentationArtifact.model_validate(invalid_data)


# ─────────────────────────────────────────────
# Fix #1 — drag_drop interaction tests
# ─────────────────────────────────────────────

def test_drag_drop_interaction_validates():
    """Fix #1: DragDropInteraction must be a valid interaction primitive."""
    data = {
        "type": "drag_drop",
        "instruction": "Seret setiap tahap ke urutan yang benar!",
        "items": [
            {"id": "item-evap", "label": "Evaporasi"},
            {"id": "item-kond", "label": "Kondensasi"},
        ],
        "targets": [
            {"id": "target-1", "label": "Tahap 1"},
            {"id": "target-2", "label": "Tahap 2"},
        ],
        "answers": [
            {"item_id": "item-evap", "target_id": "target-1"},
            {"item_id": "item-kond", "target_id": "target-2"},
        ],
        "feedback": {"correct": "Urutan tepat!", "incorrect": "Coba lagi!"},
    }
    dd = DragDropInteraction.model_validate(data)
    assert dd.type == "drag_drop"
    assert len(dd.items) == 2
    assert len(dd.targets) == 2
    assert len(dd.answers) == 2
    assert dd.answers[0].item_id == "item-evap"
    assert dd.answers[0].target_id == "target-1"


def test_drag_drop_in_presentation_artifact():
    """Fix #1: drag_drop must be accepted inside a full PresentationArtifact."""
    data = {
        "version": "0.2",
        "meta": {
            "title": "Siklus Air",
            "mata_pelajaran": "IPAS",
            "topik": "Siklus Air",
            "fase": "B",
            "total_slides": 2,
        },
        "slides": [
            {"id": "s1", "order": 1, "type": "opening", "title": "Intro", "assets": [], "interaction": None},
            {
                "id": "s2",
                "order": 2,
                "type": "interactive",
                "title": "Drag Tahap Siklus",
                "assets": [],
                "interaction": {
                    "type": "drag_drop",
                    "instruction": "Seret!",
                    "items": [{"id": "i1", "label": "A"}, {"id": "i2", "label": "B"}],
                    "targets": [{"id": "t1", "label": "X"}, {"id": "t2", "label": "Y"}],
                    "answers": [{"item_id": "i1", "target_id": "t1"}, {"item_id": "i2", "target_id": "t2"}],
                    "feedback": {"correct": "OK!", "incorrect": "Nope!"},
                },
            },
        ],
    }
    artifact = PresentationArtifact.model_validate(data)
    assert artifact.slides[1].interaction.type == "drag_drop"


# ─────────────────────────────────────────────
# Fix #3 — Asset.display field tests
# ─────────────────────────────────────────────

def test_asset_display_defaults_to_asset():
    """Fix #3: Asset.display must default to 'asset' for backward compatibility."""
    a = Asset(id="a1", type="image", url="https://example.com/img.png")
    assert a.display == "asset"


def test_asset_display_fullscreen():
    """Fix #3: Asset.display='fullscreen' must be valid for visual slides."""
    a = Asset(id="a2", type="image", display="fullscreen", url="https://example.com/img.png")
    assert a.display == "fullscreen"


def test_asset_display_invalid_value_fails():
    """Fix #3: Invalid display value must raise ValidationError."""
    with pytest.raises(ValidationError):
        Asset(id="a3", type="image", display="banner", url="https://example.com/img.png")


def test_existing_assets_without_display_still_validate():
    """Fix #3: Assets from old data without display field must still validate (default=asset)."""
    data = {
        "version": "0.2",
        "meta": {"title": "T", "mata_pelajaran": "IPA", "topik": "T", "fase": "A", "total_slides": 1},
        "slides": [{
            "id": "s1", "order": 1, "type": "visual", "title": "Visual",
            "assets": [{"id": "old-asset", "type": "image", "url": "https://example.com/x.png", "alt": "Old asset"}],
            "interaction": None,
        }],
    }
    artifact = PresentationArtifact.model_validate(data)
    assert artifact.slides[0].assets[0].display == "asset"  # defaults correctly


# ─────────────────────────────────────────────
# Fix #2 — Visual Decision Layer tests
# ─────────────────────────────────────────────

def test_visual_decision_layer_skips_non_visual_slides():
    """Fix #2: decision layer must not attempt image gen on non-visual slides."""
    from app.services.ai.visual_asset_pipeline import _should_generate_image

    content_slide = PresentationSlide(id="s1", order=1, type="content", title="Siklus air", content="Diagram siklus")
    interactive_slide = PresentationSlide(id="s2", order=2, type="interactive", title="Siklus", content="")
    opening_slide = PresentationSlide(id="s3", order=3, type="opening", title="Intro", content="")

    assert not _should_generate_image(content_slide), "content slide must be skipped"
    assert not _should_generate_image(interactive_slide), "interactive slide must be skipped"
    assert not _should_generate_image(opening_slide), "opening slide must be skipped"


def test_visual_decision_layer_approves_keyword_visual_slides():
    """Fix #2: decision layer must approve visual slides with instructional keywords."""
    from app.services.ai.visual_asset_pipeline import _should_generate_image

    diagram_slide = PresentationSlide(
        id="s1", order=1, type="visual",
        title="Diagram Siklus Air",
        content="Siklus empat tahap: evaporasi, kondensasi, presipitasi, koleksi",
    )
    proses_slide = PresentationSlide(
        id="s2", order=2, type="visual",
        title="Proses Fotosintesis",
        content="Bagaimana tanaman menghasilkan makanan dari sinar matahari",
    )

    assert _should_generate_image(diagram_slide), "diagram slide must be approved"
    assert _should_generate_image(proses_slide), "proses slide must be approved"


def test_visual_decision_layer_skips_generic_visual_slides():
    """Fix #2: visual slides without instructional visual keywords must be skipped (anti-AI-slop)."""
    from app.services.ai.visual_asset_pipeline import _should_generate_image

    generic_slide = PresentationSlide(
        id="s1", order=1, type="visual",
        title="Slide Cantik",
        content="Mari kita mulai belajar hari ini!",
    )

    assert not _should_generate_image(generic_slide), "generic visual slide must be skipped"


def test_visual_decision_layer_skips_slides_with_existing_assets():
    """Fix #2: slides that already have assets must be skipped (idempotency guard)."""
    from app.services.ai.visual_asset_pipeline import _should_generate_image

    slide_with_assets = PresentationSlide(
        id="s1", order=1, type="visual",
        title="Diagram Siklus",
        content="Proses siklus air",
        assets=[Asset(id="a1", type="image", url="https://x.com/img.png")],
    )

    assert not _should_generate_image(slide_with_assets), "slide with existing assets must be skipped"
