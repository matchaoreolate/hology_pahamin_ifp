"""
Integration tests for Learning Context endpoints (Tahap 1).
"""
import pytest
from httpx import AsyncClient

STRONG_PASSWORD = "Password123!"


async def get_authenticated_client(client: AsyncClient, email: str = "guru.context@sekolah.id") -> tuple[AsyncClient, dict]:
    """Helper to register and login a test user, returning auth headers."""
    await client.post("/api/v1/auth/register", json={
        "email": email,
        "password": STRONG_PASSWORD,
        "full_name": "Guru Uji Konteks",
    })
    login_res = await client.post("/api/v1/auth/login", json={
        "email": email,
        "password": STRONG_PASSWORD,
    })
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    return client, headers


@pytest.mark.asyncio
async def test_create_and_get_learning_context(client: AsyncClient):
    _, headers = await get_authenticated_client(client, "guru1@sekolah.id")

    # 1. Create context
    payload = {
        "fase": "B",
        "kelas": "3&4",
        "mata_pelajaran": "IPAS",
        "topik": "Siklus Air",
        "tujuan_pembelajaran": "Peserta didik dapat memahami proses evaporasi dan presipitasi",
        "alokasi_waktu_jp": 2,
        "fokus_pendekatan": ["visual_gambar", "analogi_sehari_hari"],
        "konteks_geografis": "pesisir",
        "level_kemampuan_kelas": "campuran",
        "apersepsi": "Hujan kemarin sore",
    }
    create_res = await client.post("/api/v1/contexts/", json=payload, headers=headers)
    assert create_res.status_code == 201
    data = create_res.json()
    assert data["topik"] == "Siklus Air"
    assert data["fase"] == "B"
    context_id = data["id"]

    # 2. Get context by ID
    get_res = await client.get(f"/api/v1/contexts/{context_id}", headers=headers)
    assert get_res.status_code == 200
    assert get_res.json()["id"] == context_id

    # 3. List contexts
    list_res = await client.get("/api/v1/contexts/", headers=headers)
    assert list_res.status_code == 200
    assert len(list_res.json()) >= 1

    # 4. Update context
    update_res = await client.put(
        f"/api/v1/contexts/{context_id}",
        json={"topik": "Siklus Air dan Cuaca"},
        headers=headers,
    )
    assert update_res.status_code == 200
    assert update_res.json()["topik"] == "Siklus Air dan Cuaca"

    # 5. Delete context
    del_res = await client.delete(f"/api/v1/contexts/{context_id}", headers=headers)
    assert del_res.status_code == 204

    # 6. Verify deleted
    get_after_del = await client.get(f"/api/v1/contexts/{context_id}", headers=headers)
    assert get_after_del.status_code == 404
