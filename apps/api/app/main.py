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
        "name": "Audio Narration",
        "description": "Voice-over edukatif interaktif bahasa Indonesia ramah anak menggunakan Edge-TTS untuk slide presentasi dan materi.",
    },
    {
        "name": "Exports",
        "description": "Download lembar kerja LKPD siap cetak format A4 PDF untuk siswa di kelas.",
    },
    {
        "name": "Differentiated Learning (TaRL)",
        "description": "Generator pembelajaran terdiferensiasi 3 level (Perintis, Cakap, Mahir) sesuai Kurikulum Merdeka.",
    },
    {
        "name": "Public Viewer",
        "description": "Penayangan presentasi publik tanpa login khusus untuk perangkat Interactive Flat Panel (IFP) sekolah.",
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

PahamIn membantu guru Sekolah Dasar menghasilkan media pembelajaran terintegrasi dari satu konteks pembelajaran menggunakan model kecerdasan buatan:

| Output / Fitur | Deskripsi |
|---|---|
| Presentasi Interaktif TV | Slide interaktif yang dioptimalkan untuk Interactive Flat Panel (IFP) touchscreen |
| LKPD Cetak & PDF | Lembar Kerja Peserta Didik dengan soal dan download file A4 PDF siap cetak |
| E-Book | Buku digital naratif dengan materi dan panduan diskusi rumah |
| Audio Narasi (TTS) | Voice-over interaktif ramah anak untuk slide dan materi pembelajaran |
| Diferensiasi TaRL | Rencana pembelajaran adaptif 3 level (Perintis, Cakap, Mahir) |

---

## Alur Penggunaan

1. **Auth**: Register dan Login (`/api/v1/auth/...`) untuk mendapatkan Bearer Token.
2. **Tahap 1**: Simpan Konteks Pembelajaran (`POST /api/v1/contexts/`).
3. **Tahap 2**: Buat Project dan tentukan opsi output (`POST /api/v1/projects/`).
4. **Tahap 3**: Cek Smart Summary (`GET /api/v1/projects/{id}/summary`).
5. **Generate**: Trigger proses AI (`POST /api/v1/projects/{id}/generate`).
6. **Polling Status**: Pantau status generate (`GET /api/v1/projects/{id}/status`).
7. **Ambil Output**: Ambil konten via endpoint `/presentation`, `/lkpd`, atau `/ebook`.
8. **Export PDF**: Unduh lembar LKPD siap cetak via `/api/v1/exports/projects/{id}/lkpd-pdf`.
9. **Audio Narasi**: Dengarkan suara narasi slide via `/api/v1/narrations/...`.
10. **Diferensiasi TaRL**: Generate paket soal 3 level via `/api/v1/projects/{id}/differentiate`.
11. **Runtime TV**: Gunakan endpoint `/runtime` untuk penayangan di layar sentuh IFP.
12. **Feedback**: Kirim evaluasi pembelajaran via `/feedback`.

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
cors_origins = settings.get_cors_origins()
cors_origin_regex = (
    settings.ALLOWED_ORIGIN_REGEX.strip()
    if settings.ALLOWED_ORIGIN_REGEX and settings.ALLOWED_ORIGIN_REGEX.strip()
    else None
)
if "*" in cors_origins:
    cors_origins = []
    cors_origin_regex = r".*"

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_origin_regex=cors_origin_regex,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Content-Disposition", "Content-Type", "Content-Length", "Accept-Ranges"],
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
