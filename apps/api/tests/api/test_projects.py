"""
Integration tests for Media Project endpoints (Tahap 2, Smart Summary, Workspace).
"""
import pytest
from httpx import AsyncClient

STRONG_PASSWORD = "Password123!"


async def setup_context(client: AsyncClient, email: str = "guru.proj@sekolah.id") -> tuple[dict, str]:
    """Helper to setup a user and an initial learning context."""
    await client.post("/api/v1/auth/register", json={
        "email": email,
        "password": STRONG_PASSWORD,
        "full_name": "Guru Project Test",
    })
    login_res = await client.post("/api/v1/auth/login", json={
        "email": email,
        "password": STRONG_PASSWORD,
    })
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    ctx_res = await client.post("/api/v1/contexts/", json={
        "fase": "B",
        "kelas": "3&4",
        "mata_pelajaran": "IPAS",
        "topik": "Ekosistem Hutan Mangrove",
        "tujuan_pembelajaran": "Mengidentifikasi rantai makanan pada ekosistem mangrove",
        "alokasi_waktu_jp": 2,
    }, headers=headers)
    context_id = ctx_res.json()["id"]
    return headers, context_id


@pytest.mark.asyncio
async def test_project_lifecycle(client: AsyncClient):
    headers, context_id = await setup_context(client, "guru.lifecycle@sekolah.id")

    # 1. Create Media Project
    project_payload = {
        "learning_context_id": context_id,
        "title": "Paket Belajar Ekosistem Mangrove",
        "selected_outputs": ["presentation", "lkpd"],
        "output_config": {
            "presentation": {
                "gaya_visual": "cute_3d",
                "mode_dinamika": "seimbang",
            },
            "lkpd": {
                "jumlah_soal": 10,
            },
        },
    }
    create_res = await client.post("/api/v1/projects/", json=project_payload, headers=headers)
    assert create_res.status_code == 201
    project_data = create_res.json()
    assert project_data["title"] == "Paket Belajar Ekosistem Mangrove"
    assert project_data["status"] == "draft"
    project_id = project_data["id"]

    # 2. Get Smart Summary (Tahap 3)
    summary_res = await client.get(f"/api/v1/projects/{project_id}/summary", headers=headers)
    assert summary_res.status_code == 200
    summary_json = summary_res.json()
    assert "Ekosistem Hutan Mangrove" in summary_json["summary"]

    # 3. Get Workspace
    workspace_res = await client.get(f"/api/v1/projects/{project_id}/workspace", headers=headers)
    assert workspace_res.status_code == 200
    ws_json = workspace_res.json()
    assert ws_json["project"]["id"] == project_id
    assert "presentation" in ws_json["outputs"]

    # 4. Update Project Config
    update_res = await client.put(
        f"/api/v1/projects/{project_id}/config",
        json={"title": "Paket Belajar Mangrove Revisi"},
        headers=headers,
    )
    assert update_res.status_code == 200
    assert update_res.json()["title"] == "Paket Belajar Mangrove Revisi"

    # 5. Delete Project
    del_res = await client.delete(f"/api/v1/projects/{project_id}", headers=headers)
    assert del_res.status_code == 204
