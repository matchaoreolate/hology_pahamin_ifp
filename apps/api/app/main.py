"""
PahamIn FastAPI application entry point.
"""
from contextlib import asynccontextmanager
from typing import AsyncIterator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.router import api_router
from app.core.config import settings
from app.core.logging import setup_logging


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    """Startup and shutdown logic."""
    setup_logging()
    yield


# --- OpenAPI Tags ---
tags_metadata = [
    {
        "name": "Auth",
        "description": "Registrasi dan autentikasi guru. Semua endpoint yang membutuhkan autentikasi menggunakan **Bearer JWT token** di header `Authorization`.",
    },
    {
        "name": "Learning Contexts",
        "description": (
            "Konteks Pembelajaran **(Tahap 1)**. "
            "Menyimpan semua parameter yang mendefinisikan materi: fase, mata pelajaran, tujuan pembelajaran, "
            "konteks geografis, dan kearifan lokal. Satu konteks bisa digunakan untuk banyak project."
        ),
    },
    {
        "name": "Media Projects",
        "description": (
            "Project Media **(Tahap 2 & 3)**. "
            "Mengelola konfigurasi output (presentasi, LKPD, e-book) dan memicu proses generate AI. "
            "Satu project = satu konteks pembelajaran + satu set konfigurasi output."
        ),
    },
    {
        "name": "Generated Outputs",
        "description": (
            "Hasil Generate AI. "
            "Ambil konten hasil generate, edit, jalankan presentasi runtime di IFP TV, "
            "dan berikan feedback setelah lesson."
        ),
    },
    {
        "name": "System",
        "description": "Health check dan informasi sistem.",
    },
]

app = FastAPI(
    title="PahamIn API",
    description="""
## Platform AI Generator Media Pembelajaran untuk Guru SD Indonesia

PahamIn membantu guru Sekolah Dasar menghasilkan tiga jenis media pembelajaran dari satu konteks pembelajaran menggunakan model kecerdasan buatan:

| Output | Deskripsi |
|---|---|
| Presentasi Interaktif TV | Slide interaktif yang dioptimalkan untuk Interactive Flat Panel (IFP) touchscreen |
| LKPD Cetak | Lembar Kerja Peserta Didik dengan soal dan rubrik penilaian |
| E-Book | Buku digital naratif dengan materi dan panduan diskusi rumah |

---

## Alur Penggunaan

1. **Auth**: Register dan Login (`/api/v1/auth/...`) untuk mendapatkan Bearer Token.
2. **Tahap 1**: Simpan Konteks Pembelajaran (`POST /api/v1/contexts/`).
3. **Tahap 2**: Buat Project dan tentukan opsi output (`POST /api/v1/projects/`).
4. **Tahap 3**: Cek Smart Summary (`GET /api/v1/projects/{id}/summary`).
5. **Generate**: Trigger proses AI (`POST /api/v1/projects/{id}/generate`).
6. **Polling Status**: Pantau status generate (`GET /api/v1/projects/{id}/status`).
7. **Ambil Output**: Ambil konten via endpoint `/presentation`, `/lkpd`, atau `/ebook`.
8. **Runtime TV**: Gunakan endpoint `/runtime` untuk penayangan di layar sentuh IFP.
9. **Feedback**: Kirim evaluasi pembelajaran via `/feedback`.

---

## Autentikasi

Semua endpoint privat mewajibkan JWT token pada header:
```
Authorization: Bearer <access_token>
```

---

## Standar Password
- Minimal 8 karakter
- Minimal 1 huruf kapital (A-Z)
- Minimal 1 huruf kecil (a-z)
- Minimal 1 angka (0-9)
- Minimal 1 karakter spesial (!@#$%^&* dll)
""",
    version="0.1.0",
    openapi_tags=tags_metadata,
    contact={
        "name": "PahamIn Dev Team",
        "email": "dev@pahamin.id",
    },
    license_info={
        "name": "Private",
    },
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan,
)

# --- CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.get_cors_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Routers ---
app.include_router(api_router, prefix=settings.API_V1_STR)


# --- Health Check ---
@app.get("/health", tags=["System"])
async def health_check() -> dict:
    """Liveness probe endpoint."""
    return {"status": "ok", "app": settings.APP_NAME, "env": settings.APP_ENV}


@app.get("/", tags=["System"])
async def root() -> dict:
    return {
        "message": "Selamat datang di PahamIn API",
        "docs": "/docs",
        "version": "0.1.0",
    }
