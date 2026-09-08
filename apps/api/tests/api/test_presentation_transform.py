"""
Integration tests for AI Presentation Transform endpoint.
"""
from unittest.mock import AsyncMock, patch
import uuid
import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.generated_output import GeneratedOutput

STRONG_PASSWORD = "Password123!"


@pytest.mark.asyncio
async def test_ai_transform_presentation(client: AsyncClient, db_session: AsyncSession):
    # Register & Login
    email = "guru.transform@sekolah.id"
    await client.post("/api/v1/auth/register", json={
        "email": email,
        "password": STRONG_PASSWORD,
        "full_name": "Guru Transform Test",
    })
    login_res = await client.post("/api/v1/auth/login", json={
        "email": email,
        "password": STRONG_PASSWORD,
    })
    headers = {"Authorization": f"Bearer {login_res.json()['access_token']}"}

    # Create Context
    ctx_res = await client.post("/api/v1/contexts/", json={
        "fase": "B",
        "kelas": "3&4",
        "mata_pelajaran": "IPAS",
        "topik": "Fotosintesis",
        "tujuan_pembelajaran": "Memahami proses fotosintesis pada tumbuhan",
        "alokasi_waktu_jp": 1,
    }, headers=headers)
    ctx_id = ctx_res.json()["id"]

    # Create Project
    proj_res = await client.post("/api/v1/projects/", json={
        "learning_context_id": ctx_id,
        "title": "Projek Fotosintesis",
        "selected_outputs": ["presentation"],
    }, headers=headers)
    proj_id = proj_res.json()["id"]

    # Seed an existing presentation artifact
    initial_artifact = {
        "version": "0.2",
        "meta": {
            "title": "Fotosintesis",
            "mata_pelajaran": "IPAS",
            "topik": "Fotosintesis",
            "fase": "B",
            "total_slides": 2,
        },
        "slides": [
            {
                "id": "slide-1",
                "order": 1,
                "type": "opening",
                "title": "Mengenal Fotosintesis 🌿",
                "content": "Pernahkah kalian melihat tanaman memasak makanannya?",
                "assets": [],
                "interaction": None,
                "teacher_note": "Ajak siswa mengamati daun",
                "speaker_script": "Halo anak-anak hebat!",
            },
            {
                "id": "slide-2",
                "order": 2,
                "type": "closing",
                "title": "Hebat! 🎉",
                "content": "Kalian sudah memahami fotosintesis!",
                "assets": [],
                "interaction": None,
                "teacher_note": "Apresiasi siswa",
                "speaker_script": "Kalian luar biasa hari ini!",
            }
        ],
    }

    output_record = GeneratedOutput(
        project_id=uuid.UUID(proj_id),
        output_type="presentation",
        status="done",
        content=initial_artifact,
    )
    db_session.add(output_record)
    await db_session.commit()

    # Mock Gemini Service response
    mock_transformed_slide = {
        "id": "slide-1",
        "order": 1,
        "type": "content",
        "title": "Dapur Ajaib Daun Hijau 🍃",
        "content": "Daun menggunakan sinar matahari, air, dan udara untuk membuat makanan!",
        "assets": [],
        "interaction": None,
        "teacher_note": "Jelaskan analogi koki di dapur",
        "speaker_script": "Bayangkan daun itu seperti dapur kecil yang sangat sibuk!",
    }

    with patch("app.services.outputs.presentation_transform.gemini_service.generate", new_callable=AsyncMock) as mock_gen:
        mock_gen.return_value = mock_transformed_slide

        # Test slide transform (targeted)
        res = await client.post(
            f"/api/v1/projects/{proj_id}/presentation/ai-transform",
            json={
                "prompt": "Ganti judul jadi Dapur Ajaib Daun Hijau dan beri analogi koki",
                "slide_index": 0,
                "mode": "slide",
            },
            headers=headers,
        )

        assert res.status_code == 200
        data = res.json()
        assert data["action"] == "modify"
        assert data["active_slide_index"] == 0
        assert data["content"]["slides"][0]["title"] == "Dapur Ajaib Daun Hijau 🍃"
        assert len(data["content"]["slides"]) == 2

    # Test delete slide
    del_res = await client.post(
        f"/api/v1/projects/{proj_id}/presentation/ai-transform",
        json={
            "prompt": "Hapus slide ini",
            "slide_index": 1,
            "mode": "auto",
        },
        headers=headers,
    )
    assert del_res.status_code == 200
    del_data = del_res.json()
    assert del_data["action"] == "delete"
    assert len(del_data["content"]["slides"]) == 1
