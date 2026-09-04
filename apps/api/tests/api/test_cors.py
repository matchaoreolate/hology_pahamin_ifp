"""Tests for CORS configuration, localhost:5173, trailing slash normalization, and deploy URLs."""
import pytest
from httpx import AsyncClient

from app.core.config import Settings


@pytest.mark.asyncio
async def test_cors_localhost_5173_allowed(client: AsyncClient):
    """Vite dev server (http://localhost:5173) must be allowed by CORS."""
    headers = {
        "Origin": "http://localhost:5173",
        "Access-Control-Request-Method": "GET",
    }
    response = await client.get("/health", headers=headers)
    assert response.status_code == 200
    assert response.headers.get("access-control-allow-origin") == "http://localhost:5173"
    assert response.headers.get("access-control-allow-credentials") == "true"


@pytest.mark.asyncio
async def test_cors_preflight_options(client: AsyncClient):
    """OPTIONS preflight requests from localhost:5173 should succeed with proper headers."""
    headers = {
        "Origin": "http://localhost:5173",
        "Access-Control-Request-Method": "POST",
        "Access-Control-Request-Headers": "authorization,content-type",
    }
    response = await client.options("/api/v1/auth/login", headers=headers)
    assert response.status_code == 200
    assert response.headers.get("access-control-allow-origin") == "http://localhost:5173"
    assert "POST" in response.headers.get("access-control-allow-methods", "")


@pytest.mark.asyncio
@pytest.mark.parametrize(
    "deploy_origin",
    [
        "https://pahamin-web.vercel.app",
        "https://preview-deploy-branch-123.vercel.app",
        "https://pahamin.netlify.app",
        "https://frontend.pages.dev",
        "https://pahamin.onrender.com",
    ],
)
async def test_cors_deployment_origins_allowed(client: AsyncClient, deploy_origin: str):
    """Preview and production deploy domains (Vercel, Netlify, Pages, Render) should pass CORS."""
    headers = {"Origin": deploy_origin}
    response = await client.get("/health", headers=headers)
    assert response.status_code == 200
    assert response.headers.get("access-control-allow-origin") == deploy_origin


@pytest.mark.asyncio
async def test_cors_disallowed_origin(client: AsyncClient):
    """Unapproved foreign origins should not receive access-control-allow-origin headers."""
    headers = {"Origin": "https://random-unauthorized-site.com"}
    response = await client.get("/health", headers=headers)
    assert response.status_code == 200
    assert "access-control-allow-origin" not in response.headers


def test_cors_trailing_slash_normalization():
    """Ensure trailing slashes in configured origins are safely stripped."""
    s = Settings(
        ALLOWED_ORIGINS="http://localhost:5173/,http://localhost:3000/,https://custom-domain.com/"
    )
    origins = s.get_cors_origins()
    assert "http://localhost:5173" in origins
    assert "http://localhost:3000" in origins
    assert "https://custom-domain.com" in origins
    assert all(not o.endswith("/") for o in origins)
