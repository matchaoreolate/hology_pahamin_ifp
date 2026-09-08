# PahamIn — Backend API

> Layanan REST API terdistribusi dan pipeline generasi AI untuk platform media pembelajaran guru Sekolah Dasar Indonesia.

**Stack**: FastAPI · Python 3.11 · SQLAlchemy (Async) · Alembic · PostgreSQL 16 · Redis 7 · Celery · Google Gemini AI · Edge TTS · Docker

---

## 🚀 Fitur Utama Backend

1. **Autentikasi Guru**: Registrasi, login, verifikasi password kuat (bcrypt), dan otorisasi berbasis Bearer JWT.
2. **Konteks Pembelajaran (Tahap 1)**: CRUD konteks kurikulum (Fase A–C, Mata Pelajaran, Capaian/Tujuan Pembelajaran, Kearifan Lokal, Kondisi Geografis).
3. **Proyek Media & Pipeline Latar Belakang (Tahap 2 & 3)**:
   - Pembuatan konfigurasi proyek output.
   - Penjadwalan asynchronous generation job via Celery worker & Redis broker.
   - Generasi terstruktur (JSON schema) berbasis Google Gemini untuk Presentasi IFP, LKPD Cetak, dan E-Book Siswa.
4. **Presentation Studio & AI Transform Engine**:
   - **Manual Output Patching**: API review & edit manual isi konten slide (`PATCH /api/v1/projects/{id}/{output_type}`).
   - **AI Presentation Transform**: Pengeditan slide natural language berbasis LLM scoped single-slide dengan snapshot replace atomik di database (`POST /api/v1/projects/{id}/presentation/ai-transform`). Mendukung mode:
     - `slide` (modifikasi teks/visual/interaksi slide aktif),
     - `add_slide` (penambahan slide baru via AI atau manual),
     - `delete_slide` (penghapusan slide terarah).
   - **TV Runtime Mode**: Endpoint khusus untuk menyajikan struktur presentasi interaktif siap pakai di layar sentuh IFP TV (`GET /api/v1/projects/{id}/runtime`).
5. **Text-to-Speech (TTS) Narasi Suara**:
   - Generator suara sintetis bahasa Indonesia (Edge TTS) untuk naskah bicara guru di setiap slide.
6. **Ekspor Mandiri & Diferensiasi TaRL**:
   - Ekspor LKPD ke format dokumen/PDF.
   - Ekspor bundle presentasi HTML standalone mandiri tanpa dependensi server.
   - Modul adaptasi diferensiasi Teaching at the Right Level (TaRL).

---

## 🗂️ Struktur Direktori

```text
apps/api/
├── app/
│   ├── main.py                  # Inisialisasi FastAPI, CORS, middleware, dan lifecycle
│   ├── api/
│   │   ├── deps.py              # Dependency injection (Auth CurrentUser, DBSession)
│   │   └── v1/
│   │       ├── router.py        # Central v1 router registry
│   │       └── endpoints/
│   │           ├── auth.py              # Register, login, me
│   │           ├── contexts.py          # CRUD Konteks Pembelajaran
│   │           ├── projects.py          # CRUD Project Media & trigger generate AI
│   │           ├── outputs.py           # Get output, Manual edit, AI Transform, Runtime, Feedback
│   │           ├── narrations.py        # Text-to-Speech audio narasi slide
│   │           ├── exports.py           # Ekspor PDF LKPD dan standalone bundle
│   │           ├── differentiations.py  # Adaptasi TaRL (Tingkat kemampuan siswa)
│   │           └── public.py            # Akses publik share presentasi
│   ├── core/
│   │   ├── config.py            # Pydantic BaseSettings & manajemen environment
│   │   ├── security.py          # JWT sign/decode & bcrypt password hashing
│   │   └── logging.py           # Structured logging via Structlog & stdlib
│   ├── db/
│   │   └── base.py              # SQLAlchemy async engine, sessionmaker, & Base model
│   ├── models/
│   │   ├── user.py              # Model User (guru)
│   │   ├── learning_context.py  # Model Konteks Pembelajaran (Kurikulum Merdeka)
│   │   ├── media_project.py     # Model Media Project & status generasi
│   │   └── generated_output.py  # Model Output konten (Presentasi, LKPD, E-Book)
│   ├── schemas/
│   │   ├── auth.py              # Pydantic schemas untuk autentikasi
│   │   ├── learning_context.py  # Validasi input konteks guru
│   │   └── media_project.py     # Konfigurasi media & respons output
│   ├── services/
│   │   ├── ai/
│   │   │   └── gemini_service.py        # Klien Google Gemini dengan parsing JSON terstruktur
│   │   ├── outputs/
│   │   │   ├── output_viewer.py         # Pengambilan output per tipe
│   │   │   ├── output_editor.py         # Penyuntingan manual konten
│   │   │   ├── presentation_transform.py# Engine AI Transform & manipulasi slide
│   │   │   ├── runtime_viewer.py        # Penyaji runtime TV IFP
│   │   │   └── feedback_handler.py      # Penyimpan evaluasi pasca-pembelajaran
│   │   └── prompts/
│   │       ├── context_builder.py       # Pembangun instruksi berbasis kurikulum SD
│   │       ├── presentation_prompt.py   # Prompt struktur slide interaktif
│   │       ├── lkpd_prompt.py           # Prompt LKPD 3 tingkat kemahiran
│   │       └── ebook_prompt.py          # Prompt buku cerita kontekstual
│   └── tasks/
│       ├── celery_app.py        # Konfigurasi broker Redis & worker Celery
│       └── generate.py          # Background worker tasks untuk generasi media
├── migrations/                  # Skrip migrasi skema basis data Alembic
├── tests/                       # Automated testing (Unit & Integrasi via SQLite in-memory)
│   ├── api/
│   │   ├── test_auth.py
│   │   ├── test_contexts.py
│   │   ├── test_projects.py
│   │   ├── test_presentation_transform.py
│   │   └── test_cors.py
│   └── services/
│       └── test_prompt_builder.py
├── Dockerfile                   # Docker image untuk FastAPI
├── Dockerfile.worker            # Docker image untuk Celery worker
├── pyproject.toml               # Dependensi proyek & konfigurasi tool
└── alembic.ini
```

---

## 📋 Daftar Endpoint REST API (v1)

### 1. Autentikasi
| Method | Path | Deskripsi |
|---|---|---|
| `POST` | `/api/v1/auth/register` | Pendaftaran akun guru baru |
| `POST` | `/api/v1/auth/login` | Login guru & perolehan JWT Bearer Token |
| `GET` | `/api/v1/auth/me` | Informasi profil akun guru yang sedang login |

### 2. Konteks Pembelajaran (Tahap 1)
| Method | Path | Deskripsi |
|---|---|---|
| `POST` | `/api/v1/contexts` | Buat konteks pembelajaran baru |
| `GET` | `/api/v1/contexts` | Ambil daftar semua konteks milik guru |
| `GET` | `/api/v1/contexts/{id}` | Ambil detail satu konteks pembelajaran |
| `PUT` | `/api/v1/contexts/{id}` | Perbarui data konteks pembelajaran |
| `DELETE` | `/api/v1/contexts/{id}` | Hapus konteks pembelajaran |

### 3. Proyek Media Pembelajaran (Tahap 2 & 3)
| Method | Path | Deskripsi |
|---|---|---|
| `POST` | `/api/v1/projects` | Inisialisasi proyek media baru dari konteks |
| `GET` | `/api/v1/projects` | Daftar proyek media milik guru |
| `GET` | `/api/v1/projects/{id}` | Detail proyek & konfigurasi media |
| `PUT` | `/api/v1/projects/{id}/config` | Perbarui pilihan output (presentasi, lkpd, ebook) |
| `DELETE` | `/api/v1/projects/{id}` | Hapus proyek media |
| `POST` | `/api/v1/projects/{id}/generate` | Memicu background generation AI via Celery |
| `GET` | `/api/v1/projects/{id}/status` | Polling status eksekusi generasi tiap output |
| `GET` | `/api/v1/projects/{id}/summary` | Ringkasan konten semua media dalam proyek |

### 4. Output Tergenerasi & Presentation Studio
| Method | Path | Deskripsi |
|---|---|---|
| `GET` | `/api/v1/projects/{id}/presentation` | Ambil konten lengkap slide presentasi interaktif |
| `GET` | `/api/v1/projects/{id}/lkpd` | Ambil konten lembar kerja peserta didik (LKPD) |
| `GET` | `/api/v1/projects/{id}/ebook` | Ambil konten buku cerita digital (E-Book) |
| `PATCH` | `/api/v1/projects/{id}/{output_type}` | Simpan perubahan manual pada konten output |
| `POST` | `/api/v1/projects/{id}/presentation/ai-transform` | **Transformasi slide via instruksi prompt AI** |
| `GET` | `/api/v1/projects/{id}/runtime` | Runtime paket presentasi siap tayang untuk IFP TV |
| `POST` | `/api/v1/projects/{id}/feedback` | Kirim evaluasi & catatan pelaksanaan pembelajaran |

### 5. Fitur Ekstra (TTS, Ekspor, TaRL, Publik)
| Method | Path | Deskripsi |
|---|---|---|
| `POST` | `/api/v1/narrations` | Generate audio naskah suara guru (Edge TTS) |
| `GET` | `/api/v1/exports/{id}/lkpd.pdf` | Unduh dokumen LKPD format PDF siap cetak |
| `GET` | `/api/v1/exports/{id}/presentation.html` | Unduh bundle presentasi mandiri untuk offline IFP |
| `POST` | `/api/v1/differentiations/{id}/adapt` | Penyesuaian materi berbasis tingkat kemahiran siswa |
| `GET` | `/api/v1/public/share/{token}` | Akses pratinjau presentasi untuk publik/guru lain |
| `GET` | `/health` | Pemeriksaan kesehatan layanan API |

---

## ⚙️ Variabel Lingkungan (.env)

Contoh template konfigurasi backend:

```dotenv
APP_ENV=development
DEBUG=True
SECRET_KEY=kunci_rahasia_jwt_minimal_32_karakter

# Koneksi Database PostgreSQL
DATABASE_URL=postgresql+asyncpg://pahamin:pahamin_secret@localhost:5432/pahamin_db

# Koneksi Redis & Celery
REDIS_URL=redis://localhost:6379/0
CELERY_BROKER_URL=redis://localhost:6379/0
CELERY_RESULT_BACKEND=redis://localhost:6379/0

# Google Gemini AI
GEMINI_API_KEY=AIzaSy...isi_api_key_anda
GEMINI_MODEL=gemini-2.5-flash
GEMINI_TEMPERATURE=0.7
GEMINI_MAX_OUTPUT_TOKENS=8192

# CORS
ALLOWED_ORIGINS=["http://localhost:5173","http://localhost:8081"]

# Storage Opsional (Supabase / Local)
SUPABASE_URL=
SUPABASE_KEY=
```

---

## 🧪 Pengujian Otomatis

Pengujian backend dirancang mandiri menggunakan database **SQLite in-memory** (`sqlite+aiosqlite`), sehingga tidak membutuhkan koneksi PostgreSQL, Redis, maupun panggilan API eksternal:

```bash
# Menjalankan seluruh rangkaian tes:
pytest

# Menjalankan tes dengan laporan coverage kode:
pytest --cov=app --cov-report=html

# Menjalankan tes khusus AI transform presentasi:
pytest tests/api/test_presentation_transform.py -v
```
