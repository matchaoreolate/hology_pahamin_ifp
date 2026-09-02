"""
Smoke test script for Image Generation & Visual Asset Pipeline.
Can be executed directly: python scripts/test_image_gen.py
"""
import asyncio
import os
import sys

# Add apps/api to PYTHONPATH
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.config import settings
from app.services.ai.visual_asset_pipeline import _generate_image_bytes, _should_generate_image
from app.schemas.presentation_artifact import PresentationSlide, Asset


async def test_image_generation():
    print("=" * 60)
    print(" 🧪 TEST IMAGE GENERATION PIPELINE")
    print("=" * 60)
    print(f"Provider          : {settings.IMAGE_GENERATION_PROVIDER}")
    if settings.IMAGE_GENERATION_PROVIDER == "huggingface":
        print(f"HF Model          : {settings.HF_IMAGE_MODEL}")
        token_preview = f"{settings.HF_TOKEN[:8]}...{settings.HF_TOKEN[-4:]}" if settings.HF_TOKEN else "NOT SET"
        print(f"HF Token          : {token_preview}")
    print("-" * 60)

    # 1. Test Decision Layer
    print("\n[Step 1] Menguji Decision Layer...")
    slide_visual = PresentationSlide(
        id="s-test-1",
        order=1,
        type="visual",
        title="Diagram Siklus Air",
        content="Proses empat tahap: evaporasi, kondensasi, presipitasi, koleksi.",
        assets=[]
    )
    slide_content = PresentationSlide(
        id="s-test-2",
        order=2,
        type="content",
        title="Pengantar",
        content="Penjelasan materi biasa",
        assets=[]
    )
    
    assert _should_generate_image(slide_visual) is True, "Visual slide with keyword should trigger image generation"
    assert _should_generate_image(slide_content) is False, "Content slide should NOT trigger image generation"
    print("  ✅ Decision layer berfungsi dengan benar (hanya visual slide instruksional yang eligible).")

    # 2. Test Image Generation via API
    prompt = "Educational illustration for primary school: Water cycle diagram with sun, evaporation, clouds, rain, river. Simple, clear, cute 3D style."
    print(f"\n[Step 2] Mengirim request gambar ke {settings.IMAGE_GENERATION_PROVIDER}...")
    print(f"  Prompt: '{prompt}'")
    print("  Menunggu respon API...")

    image_bytes = await _generate_image_bytes(prompt)

    if not image_bytes:
        print("\n❌ GAGAL: Tidak menerima image bytes dari provider.")
        print("  Cek apakah token HF sudah aktif dan model sudah disetujui lisensinya.")
        return

    output_filename = "test_image_result.png"
    with open(output_filename, "wb") as f:
        f.write(image_bytes)

    print(f"\n🎉 BERHASIL!")
    print(f"  Ukuran gambar : {len(image_bytes)} bytes")
    print(f"  File tersimpan: {os.path.abspath(output_filename)}")
    print("=" * 60)


if __name__ == "__main__":
    asyncio.run(test_image_generation())
