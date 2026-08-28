"""Integration tests for auth endpoints."""
import pytest
from httpx import AsyncClient

STRONG_PASSWORD = "Password123!"


@pytest.mark.asyncio
async def test_register_success(client: AsyncClient):
    response = await client.post("/api/v1/auth/register", json={
        "email": "guru@sekolah.id",
        "password": STRONG_PASSWORD,
        "full_name": "Bu Sari",
        "nama_sekolah": "SDN 01 Surabaya",
        "kota": "Surabaya",
    })
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "guru@sekolah.id"
    assert data["full_name"] == "Bu Sari"


@pytest.mark.asyncio
async def test_register_duplicate_email(client: AsyncClient):
    payload = {
        "email": "duplikat@sekolah.id",
        "password": STRONG_PASSWORD,
        "full_name": "Pak Budi",
    }
    await client.post("/api/v1/auth/register", json=payload)
    response = await client.post("/api/v1/auth/register", json=payload)
    assert response.status_code == 409


@pytest.mark.asyncio
async def test_register_weak_password_rejected(client: AsyncClient):
    """Password tanpa special char harus ditolak."""
    response = await client.post("/api/v1/auth/register", json={
        "email": "weak@sekolah.id",
        "password": "password123",  # no uppercase, no special char
        "full_name": "Pak Lemah",
    })
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_login_success(client: AsyncClient):
    await client.post("/api/v1/auth/register", json={
        "email": "login_test@sekolah.id",
        "password": STRONG_PASSWORD,
        "full_name": "Pak Guru",
    })
    response = await client.post("/api/v1/auth/login", json={
        "email": "login_test@sekolah.id",
        "password": STRONG_PASSWORD,
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


@pytest.mark.asyncio
async def test_login_wrong_password(client: AsyncClient):
    await client.post("/api/v1/auth/register", json={
        "email": "wrong_pass@sekolah.id",
        "password": STRONG_PASSWORD,
        "full_name": "Pak Guru",
    })
    response = await client.post("/api/v1/auth/login", json={
        "email": "wrong_pass@sekolah.id",
        "password": "SalahPassword123!",
    })
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_get_me_unauthorized(client: AsyncClient):
    response = await client.get("/api/v1/auth/me")
    assert response.status_code == 401  # No Bearer token returns 401 Unauthorized

