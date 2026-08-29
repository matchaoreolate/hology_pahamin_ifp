import pytest
from pydantic import ValidationError

from app.schemas.presentation_artifact import (
    Asset,
    ChoiceInteraction,
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
