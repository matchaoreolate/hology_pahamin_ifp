"""
Integration tests for Generated Output endpoints (Review/Edit, Runtime, Feedback).
"""
import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.generated_output import GeneratedOutput

STRONG_PASSWORD = "Password123!"


@pytest.mark.asyncio
async def test_output_edit_runtime_and_feedback(client: AsyncClient, db_session: AsyncSession):
    # Register & Login
    email = "guru.output@sekolah.id"
    await client.post("/api/v1/auth/register", json={
        "email": email,
        "password": STRONG_PASSWORD,
        "full_name": "Guru Output Test",
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
        "mata_pelajaran": "Matematika",
        "topik": "Pecahan Senilai",
        "tujuan_pembelajaran": "Memahami konsep pecahan senilai menggunakan gambar",
        "alokasi_waktu_jp": 1,
    }, headers=headers)
    ctx_id = ctx_res.json()["id"]

    # Create Project
    proj_res = await client.post("/api/v1/projects/", json={
        "learning_context_id": ctx_id,
        "title": "Projek Pecahan Senilai",
        "selected_outputs": ["presentation"],
        "output_config": {
            "presentation": {"gaya_visual": "cute_3d", "mode_dinamika": "seimbang"}
        },
    }, headers=headers)
    proj_id = proj_res.json()["id"]

    # Manually inject a completed GeneratedOutput in database for testing
    import uuid
    output_record = GeneratedOutput(
        project_id=uuid.UUID(proj_id),
        output_type="presentation",
        status="done",
        content={
            "slides": [
                {"slide_number": 1, "title": "Mengenal Pecahan", "content": "Apa itu pecahan?"}
            ]
        },
    )
    db_session.add(output_record)
    await db_session.commit()

    # 1. Test GET /presentation
    get_pres = await client.get(f"/api/v1/projects/{proj_id}/presentation", headers=headers)
    assert get_pres.status_code == 200
    assert get_pres.json()["content"]["slides"][0]["title"] == "Mengenal Pecahan"

    # 2. Test PATCH review/edit
    patch_res = await client.patch(
        f"/api/v1/projects/{proj_id}/presentation",
        json={"content": {"slides": [{"slide_number": 1, "title": "Pecahan Senilai Kelas 4"}]}},
        headers=headers,
    )
    assert patch_res.status_code == 200
    assert patch_res.json()["content"]["slides"][0]["title"] == "Pecahan Senilai Kelas 4"

    # 3. Test GET /runtime (IFP TV Screen)
    runtime_res = await client.get(f"/api/v1/projects/{proj_id}/runtime", headers=headers)
    assert runtime_res.status_code == 200
    assert runtime_res.json()["mode"] == "interactive_tv"
    assert runtime_res.json()["ifp_settings"]["optimized_for"] == "interactive_flat_panel"

    # 4. Test GET /public/presentations/{project_id} (No Auth required for IFP)
    public_res = await client.get(f"/api/v1/public/presentations/{proj_id}")
    assert public_res.status_code == 200
    assert "artifact" in public_res.json()
    assert public_res.json()["project_id"] == proj_id

    # 5. Test POST /feedback
    fb_res = await client.post(
        f"/api/v1/projects/{proj_id}/feedback",
        json={
            "rating": 5,
            "catatan": "Siswa sangat antusias dengan simulasi visual pecahan.",
            "siswa_aktif": 30,
        },
        headers=headers,
    )
    assert fb_res.status_code == 200
    assert fb_res.json()["feedback"]["rating"] == 5

