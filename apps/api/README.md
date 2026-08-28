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

### 4. Akses

| Service | URL |
|---------|-----|
| FastAPI Docs | http://localhost:8000/docs |
| ReDoc | http://localhost:8000/redoc |
| Health Check | http://localhost:8000/health |
| Flower (Celery) | http://localhost:5555 |

---

## 🗂️ Struktur Project

```
be-pahamin/
├── app/
│   ├── main.py                  # FastAPI app entrypoint
│   ├── api/
│   │   ├── deps.py              # Auth dependency injection
│   │   └── v1/
│   │       ├── router.py        # Central v1 router
│   │       └── endpoints/
│   │           ├── auth.py      # Register, login, me
│   │           ├── contexts.py  # Learning Context CRUD (Tahap 1)
│   │           ├── projects.py  # Media Project CRUD + generate trigger
│   │           └── outputs.py   # Generated content retrieval
│   ├── core/
│   │   ├── config.py            # Pydantic Settings
│   │   ├── security.py          # JWT + bcrypt
│   │   └── logging.py           # Structured logging (structlog)
│   ├── db/
│   │   └── base.py              # SQLAlchemy async engine + session
│   ├── models/
│   │   ├── user.py              # User (guru)
│   │   ├── learning_context.py  # Tahap 1 inputs
│   │   ├── media_project.py     # Tahap 2 config + status
│   │   └── generated_output.py  # AI output content
│   ├── schemas/
│   │   ├── auth.py              # Auth Pydantic schemas
│   │   ├── learning_context.py  # Tahap 1 validation schemas
│   │   └── media_project.py     # Tahap 2 + output schemas
│   ├── services/
│   │   ├── ai/
│   │   │   └── gemini_service.py
│   │   └── prompts/
│   │       ├── context_builder.py   # Fase/geo/level logic
│   │       ├── presentation_prompt.py
│   │       ├── lkpd_prompt.py
│   │       └── ebook_prompt.py
│   └── tasks/
│       ├── celery_app.py        # Celery config
│       └── generate.py          # Background generation tasks
├── migrations/                  # Alembic migrations
├── tests/
│   ├── api/test_auth.py
│   └── services/test_prompt_builder.py
├── Dockerfile                   # FastAPI image
├── Dockerfile.worker            # Celery worker image
├── docker-compose.yml           # Dev environment
└── pyproject.toml
```

---

## 🐳 Docker Services

| Container | Image | Port | Peran |
|-----------|-------|------|-------|
| `pahamin_api` | Custom FastAPI | 8000 | REST API |
| `pahamin_worker` | Custom Celery | — | AI generate jobs |
| `pahamin_db` | postgres:16-alpine | 5432 | Database |
| `pahamin_redis` | redis:7-alpine | 6379 | Broker Celery |
| `pahamin_flower` | mher/flower | 5555 | Monitor (dev only) |

---

## 🧪 Testing

```bash
# Install dev deps
pip install -e ".[dev]"

# Run semua test
pytest

# Run dengan coverage
pytest --cov=app --cov-report=html
```

---

## 📋 API Overview

```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
GET    /api/v1/auth/me

POST   /api/v1/contexts
GET    /api/v1/contexts
GET    /api/v1/contexts/{id}
PUT    /api/v1/contexts/{id}
DELETE /api/v1/contexts/{id}

POST   /api/v1/projects
GET    /api/v1/projects
GET    /api/v1/projects/{id}
PUT    /api/v1/projects/{id}/config
DELETE /api/v1/projects/{id}
POST   /api/v1/projects/{id}/generate     ← trigger AI
GET    /api/v1/projects/{id}/status       ← polling
GET    /api/v1/projects/{id}/presentation
GET    /api/v1/projects/{id}/lkpd
GET    /api/v1/projects/{id}/ebook
GET    /api/v1/projects/{id}/summary

GET    /health
```
