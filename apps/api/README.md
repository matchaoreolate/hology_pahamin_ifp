# PahamIn — Backend API

> Platform AI generator media pembelajaran terintegrasi untuk guru Sekolah Dasar Indonesia.

**Stack**: FastAPI · PostgreSQL 16 · Redis · Celery · Google Gemini · Docker

---

## 🚀 Quick Start

### 1. Clone & Setup Environment

```bash
cp .env.example .env
# Edit .env — isi GEMINI_API_KEY dan SECRET_KEY
```

### 2. Jalankan dengan Docker

```bash
# Start semua service (API + DB + Redis + Worker)
docker compose up --build

# Dengan Celery monitor (Flower)
docker compose --profile dev up --build
```

### 3. Jalankan Migrations

```bash
docker compose exec api alembic upgrade head
```

### 4. Dokumentasi API Interaktif (Swagger & ReDoc)

FastAPI menyediakan dokumentasi interaktif bawaan yang bisa langsung digunakan untuk mencoba API:

| Dokumentasi | URL Lokal | Deskripsi |
|---|---|---|
| **Swagger UI** | [http://localhost:8000/docs](http://localhost:8000/docs) | UI interaktif untuk tes endpoint langsung di browser |
| **ReDoc** | [http://localhost:8000/redoc](http://localhost:8000/redoc) | Dokumentasi API terstruktur & rapi |
| **Health Check** | [http://localhost:8000/health](http://localhost:8000/health) | Status liveness aplikasi |
| **Flower Dashboard** | [http://localhost:5555](http://localhost:5555) | Pemantau task queue Celery *(dev mode)* |

#### 🔑 Cara Autentikasi di Swagger UI:
1. Buka `http://localhost:8000/docs`.
2. Gunakan endpoint **`POST /api/v1/auth/login`** untuk login dan dapatkan `access_token`.
3. Klik tombol **"Authorize"** (ikon gembok di pojok kanan atas).
4. Masukkan token dengan format: `Bearer <access_token>` atau cukup paste tokennya.
5. Klik **Authorize** — sekarang semua endpoint privat siap diuji langsung!

---

## 🗂️ Struktur Project

```
be-pahamin/
├── app/
│   ├── main.py                  # FastAPI app entrypoint & middleware CORS
│   ├── api/
│   │   ├── deps.py              # Auth dependency injection (JWT)
│   │   └── v1/
│   │       ├── router.py        # Central v1 router
│   │       └── endpoints/
│   │           ├── auth.py      # Register, login, me
│   │           ├── contexts.py  # Learning Context CRUD (Tahap 1)
│   │           ├── projects.py  # Media Project CRUD + generate trigger (Tahap 2 & 3)
│   │           ├── outputs.py   # Generated content retrieval, edit, runtime, feedback
│   │           └── public.py    # Public read-only presentation viewer for IFP TV
│   ├── core/
│   │   ├── config.py            # Pydantic Settings
│   │   ├── security.py          # JWT + bcrypt password hasher
│   │   └── logging.py           # Structured logging (structlog)
│   ├── db/
│   │   └── base.py              # SQLAlchemy async engine + session factory
│   ├── models/                  # SQLAlchemy ORM models
│   ├── schemas/                 # Pydantic request/response schemas
│   ├── services/
│   │   ├── ai/
│   │   │   ├── gemini_service.py        # Google Gemini 2.5 Flash text engine
│   │   │   ├── image_generator.py       # Gemini Flash Image & Pollinations (FLUX)
│   │   │   └── visual_asset_pipeline.py # Visual asset enrichment pipeline
│   │   ├── outputs/                     # Output viewer, editor, runtime & feedback
│   │   └── prompts/                     # Structured prompt templates
│   └── tasks/
│       ├── celery_app.py        # Celery configuration
│       ├── generate.py          # Celery chord orchestration & parallel generation
│       └── pipeline.py          # Pipeline status updater
├── Dockerfile                   # FastAPI production multi-stage image
├── Dockerfile.worker            # Celery worker production image
├── docker-compose.yml           # Complete local dev orchestration
└── pyproject.toml
```

---

## 🤖 AI & Media Generation Pipeline

1. **Text Generation**: Menggunakan **Google Gemini 2.5 Flash** (`gemini-2.5-flash`) dengan structured JSON output untuk memastikan validasi schema Pydantic selalu sesuai.
2. **Visual Asset Enrichment**: 
   * **Primary**: **Google Gemini Flash Image** (`gemini-2.5-flash-image`) menghasilkan gambar resolusi tinggi berkualitas premium.
   * **Fallback**: **Pollinations.ai** (model FLUX gratis tanpa API key) otomatis aktif jika kuota Gemini limit.
3. **Orchestrasi Paralel (Celery Chord)**:
   * Generate Presentasi, LKPD, dan E-Book berjalan secara paralel di background.
   * Menggunakan pola **Celery Chord** dengan callback `finalize_generation_task` untuk menjamin status project otomatis berubah menjadi `"done"` setelah seluruh output selesai.

---

## 🐳 Docker Services

| Container | Image | Port | Peran |
|-----------|-------|------|-------|
| `pahamin_api` | Custom FastAPI | 8000 | REST API |
| `pahamin_worker` | Custom Celery | — | Background AI worker |
| `pahamin_db` | postgres:16-alpine | 5432 | Database PostgreSQL 16 |
| `pahamin_redis` | redis:7-alpine | 6379 | Redis broker & result backend |
| `pahamin_flower` | mher/flower | 5555 | Celery task monitor (dev only) |

---

## 🧪 Testing

```bash
# Install dev deps
pip install -e ".[dev]"

# Run semua unit & integration test
pytest

# Run dengan coverage report
pytest --cov=app --cov-report=html
```

---

## 📋 Ringkasan Endpoint API

### 🔐 Auth
* `POST /api/v1/auth/register` — Registrasi akun guru baru
* `POST /api/v1/auth/login` — Login & dapatkan access token JWT
* `GET  /api/v1/auth/me` — Profil user yang sedang login

### 📚 Tahap 1: Learning Contexts
* `POST   /api/v1/contexts/` — Simpan konteks pembelajaran (Fase, Mapel, Topik, TP, dsb.)
* `GET    /api/v1/contexts/` — Daftar konteks milik guru
* `GET    /api/v1/contexts/{id}` — Detail satu konteks
* `PUT    /api/v1/contexts/{id}` — Update konteks
* `DELETE /api/v1/contexts/{id}` — Hapus konteks

### 🎯 Tahap 2 & 3: Media Projects
* `POST   /api/v1/projects/` — Buat project media dari konteks
* `GET    /api/v1/projects/` — Daftar project media
* `GET    /api/v1/projects/{id}` — Detail project
* `PUT    /api/v1/projects/{id}/config` — Update konfigurasi output
* `DELETE /api/v1/projects/{id}` — Hapus project
* `GET    /api/v1/projects/{id}/summary` — Smart Summary sebelum generate
* `POST   /api/v1/projects/{id}/generate` — **Trigger proses generate AI di background**
* `GET    /api/v1/projects/{id}/status` — Cek status progress generate (untuk polling)

### 📦 Generated Outputs
* `GET    /api/v1/projects/{id}/presentation` — Ambil hasil Presentasi Interaktif TV
* `GET    /api/v1/projects/{id}/lkpd` — Ambil hasil LKPD Siap Cetak
* `GET    /api/v1/projects/{id}/ebook` — Ambil hasil E-Book Materi
* `PATCH  /api/v1/projects/{id}/{output_type}` — Edit konten hasil output AI
* `GET    /api/v1/projects/{id}/runtime` — Data khusus runtime penayangan IFP TV touchscreen
* `POST   /api/v1/projects/{id}/feedback` — Kirim feedback evaluasi pembelajaran

### 🖥️ Public Viewer (Tanpa Login)
* `GET    /api/v1/public/presentations/{project_id}` — Endpoint publik untuk penayangan di Interactive Flat Panel (IFP) sekolah tanpa login

### ⚙️ System
* `GET /health` — Liveness health check
* `GET /` — Root welcome message

