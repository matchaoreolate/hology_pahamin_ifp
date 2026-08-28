"""
Unit tests for prompt builders.
Ensures geographic context, fase, and apersepsi are correctly injected.
"""
from app.services.prompts.context_builder import (
    LearningContextData,
    build_apersepsi_instruction,
    build_context_preamble,
)
from app.services.prompts.lkpd_prompt import build_lkpd_prompt
from app.services.prompts.presentation_prompt import build_presentation_prompt


def make_ctx(**kwargs) -> LearningContextData:
    defaults = {
        "fase": "B",
        "kelas": "3&4",
        "mata_pelajaran": "IPAS",
        "topik": "Tata Surya",
        "tujuan_pembelajaran": "Siswa dapat mengidentifikasi 8 planet",
        "alokasi_waktu_jp": 2,
        "fokus_pendekatan": None,
        "konteks_geografis": None,
        "level_kemampuan_kelas": None,
        "apersepsi": None,
    }
    defaults.update(kwargs)
    return LearningContextData(**defaults)


def test_fase_a_uses_simple_vocabulary():
    ctx = make_ctx(fase="A", kelas="1&2")
    preamble = build_context_preamble(ctx)
    assert "SANGAT sederhana" in preamble
    assert "6-8 tahun" in preamble


def test_fase_c_uses_analytic_language():
    ctx = make_ctx(fase="C", kelas="5&6")
    preamble = build_context_preamble(ctx)
    assert "analitis" in preamble


def test_pesisir_context_uses_coastal_examples():
    ctx = make_ctx(konteks_geografis="pesisir")
    preamble = build_context_preamble(ctx)
    assert "nelayan" in preamble or "tambak" in preamble or "pantai" in preamble


def test_pegunungan_context_avoids_coastal():
    ctx = make_ctx(konteks_geografis="pegunungan")
    preamble = build_context_preamble(ctx)
    assert "ladang" in preamble or "kebun" in preamble


def test_apersepsi_included_in_instruction():
    instruction = build_apersepsi_instruction("penjumlahan dasar", "Perkalian")
    assert "penjumlahan dasar" in instruction
    assert "Perkalian" in instruction


def test_no_apersepsi_returns_empty():
    instruction = build_apersepsi_instruction(None, "Tata Surya")
    assert instruction == ""


def test_presentation_prompt_contains_topic():
    ctx = make_ctx(topik="Sistem Tata Surya")
    prompt = build_presentation_prompt(ctx, {"mode_dinamika": "seimbang"})
    assert "Sistem Tata Surya" in prompt


def test_lkpd_prompt_respects_jumlah_soal():
    ctx = make_ctx()
    prompt = build_lkpd_prompt(ctx, {"jumlah_soal": 15, "distribusi_kesulitan": "50_mudah_50_hots"})
    assert "15" in prompt


def test_lkpd_local_context_injected():
    ctx = make_ctx(konteks_geografis="pesisir")
    prompt = build_lkpd_prompt(ctx, {"injeksi_konteks_lokal": True, "jumlah_soal": 10})
    assert "pesisir" in prompt
