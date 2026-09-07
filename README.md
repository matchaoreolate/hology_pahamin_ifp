# PahamIn

PahamIn adalah platform pembuat media pembelajaran berbantuan AI untuk guru Sekolah Dasar Indonesia. Dari satu konteks pembelajaran, guru dapat membuat presentasi interaktif untuk IFP, LKPD siap cetak, dan e-book; kemudian meninjau, menyunting, menjalankan, atau mengekspornya.

## Fitur utama

- Autentikasi guru berbasis JWT.
- Penyimpanan konteks pembelajaran yang dapat digunakan ulang.
- Pembuatan proyek dan generasi paralel untuk presentasi, LKPD, dan e-book.
- Presentasi interaktif, narasi text-to-speech, diferensiasi pembelajaran TaRL, dan ekspor LKPD ke PDF.
- Pembuatan aset visual untuk slide dan penyimpanan lokal atau Supabase Storage.

## Arsitektur singkat

```mermaid
flowchart LR
    B[Browser\nReact + Vite] -->|REST / JWT| A[FastAPI]
    A --> P[(PostgreSQL)]
    A --> R[(Redis)]
    A -->|enqueue job| W[Celery worker]
    W --> R
    W -->|generate JSON| G[Google Gemini]
    W -->|generate visual| I[Image provider]
    W --> S[Local storage / Supabase Storage]
    W --> P
```

Alur utamanya adalah sebagai berikut:

1. Guru mendaftar/login, lalu menyimpan **Learning Context** (fase, mapel, topik, tujuan, dan konteks lokal).
2. Guru membuat **Media Project** dan memilih output yang diperlukan.
3. API membuat pekerjaan Celery. Worker menjalankan generasi setiap output secara paralel.
4. Hasil tervalidasi disimpan sebagai JSON pada PostgreSQL. Untuk presentasi, worker dapat memperkaya slide visual dengan aset gambar.
5. Frontend melakukan polling status proyek lalu menampilkan hasil untuk diedit, dipresentasikan, atau diekspor.

| Komponen | Peran | Teknologi |
|---|---|---|
| `apps/web` | Antarmuka guru dan runtime presentasi | React 19, TypeScript, Vite, Nginx |
| `apps/api` | REST API, autentikasi, validasi, dan ekspor | FastAPI, SQLAlchemy, Alembic |
| `worker` | Proses generasi yang berjalan di latar belakang | Celery |
| `db` | Data pengguna, konteks, proyek, dan output | PostgreSQL 16 |
| `redis` | Broker dan result backend pekerjaan Celery | Redis 7 |
| Layanan eksternal | Generasi teks/gambar dan penyimpanan aset | Gemini, image provider, Supabase opsional |

Dokumen ERD dan detail pipeline tersedia di [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Prasyarat

Cara paling mudah adalah memakai Docker Compose. Siapkan:

- Docker Engine / Docker Desktop dengan Docker Compose v2.
- Google Gemini API key untuk menggunakan fitur generasi AI.

Untuk menjalankan tanpa Docker, siapkan Node.js 22+, Corepack/pnpm 10+, Python 3.11+, PostgreSQL 16, dan Redis 7.

## Instalasi dan menjalankan dengan Docker

1. Siapkan konfigurasi backend.

   ```bash
   cp apps/api/.env.example apps/api/.env
   ```

2. Buka `apps/api/.env`, lalu minimal isi nilai berikut:

   ```dotenv
   SECRET_KEY=ganti_dengan_string_acak_minimal_32_karakter
   GEMINI_API_KEY=isi_api_key_gemini_anda
   ```

   Konfigurasi PostgreSQL, Redis, dan Celery pada contoh env sudah sesuai dengan nama service Docker Compose. Untuk deployment Docker yang membutuhkan aset gambar tampil di browser, isi `SUPABASE_*`. Jika `SUPABASE_URL` kosong, worker menggunakan filesystem lokal sebagai fallback; konfigurasi Compose saat ini belum membagikan folder tersebut ke API atau menyajikannya sebagai static files.

3. Bangun dan jalankan seluruh layanan.

   ```bash
   docker compose up --build
   ```

4. Pada terminal lain, jalankan migrasi basis data setelah container API aktif.

   ```bash
   docker compose exec api alembic upgrade head
   ```

5. Akses layanan:

   | Layanan | Alamat |
   |---|---|
   | Web | http://localhost:8081 |
   | API health check | http://localhost:8000/health |
   | Dokumentasi OpenAPI | http://localhost:8000/docs |
   | ReDoc | http://localhost:8000/redoc |
   | PostgreSQL | `localhost:5432` |
   | Redis | `localhost:6379` |

Untuk memantau Celery melalui Flower, jalankan `docker compose --profile dev up --build`; Flower tersedia di http://localhost:5555. Kredensial lokalnya adalah `admin` / `pahamin123`.

> Catatan integrasi Docker: build frontend saat ini menggunakan `VITE_API_BASE_URL=/api/v1`, sedangkan konfigurasi Nginx belum memproksikan path `/api` ke container API. Untuk menjalankan frontend melalui container, tambahkan reverse proxy `/api/` ke `api:8000` pada `apps/web/nginx.conf`, atau ubah build arg `VITE_API_BASE_URL` ke `http://localhost:8000/api/v1` untuk penggunaan lokal. Menjalankan frontend lokal dengan langkah berikut tidak memerlukan perubahan tersebut.

Untuk menghentikan layanan, gunakan:

```bash
docker compose down
```

## Menjalankan untuk pengembangan lokal

### Frontend

Instal dependensi dari root monorepo, kemudian jalankan Vite:

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm dev:web
```

Frontend tersedia di http://localhost:5173 dan secara default mengakses API pada `http://localhost:8000/api/v1`.

### Backend dan worker

Jalankan PostgreSQL dan Redis (misalnya melalui service `db` dan `redis` pada Docker Compose), lalu dari direktori backend:

```bash
cd apps/api
cp .env.example .env
# Sesuaikan DATABASE_URL, REDIS_URL, CELERY_*, SECRET_KEY, dan GEMINI_API_KEY untuk host lokal.
python3.11 -m venv .venv
source .venv/bin/activate
pip install -e ".[dev]" aiosqlite
alembic upgrade head
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Di terminal lain, dengan virtual environment yang sama aktif:

```bash
cd apps/api
source .venv/bin/activate
celery -A app.tasks.celery_app worker --loglevel=info --queues=generate
```

Variabel `DATABASE_URL`, `REDIS_URL`, `CELERY_BROKER_URL`, dan `CELERY_RESULT_BACKEND` pada `.env.example` menggunakan hostname Docker (`db` dan `redis`). Untuk proses yang dijalankan langsung di mesin host, gunakan `localhost`, misalnya `postgresql+asyncpg://pahamin:pahamin_secret@localhost:5432/pahamin_db` dan `redis://localhost:6379/0`.

## Pengujian

Tes API dan data backend memakai database SQLite in-memory (`sqlite+aiosqlite`), sehingga tidak membutuhkan PostgreSQL, Redis, worker Celery, maupun API key Gemini. Salah satu tes TTS menggunakan Edge TTS dan membutuhkan koneksi internet. Jalankan dari `apps/api`:

```bash
pip install -e ".[dev]" aiosqlite
pytest
pytest --cov=app --cov-report=html
```

Pemeriksaan frontend yang tersedia:

```bash
pnpm --filter @pahamin/web lint
pnpm --filter @pahamin/web build
```

| Area | Lingkungan pengujian yang digunakan proyek |
|---|---|
| Backend | Python 3.11+, pytest 8+, pytest-asyncio, FastAPI/HTTPX ASGI transport |
| Database tes | SQLite in-memory melalui `aiosqlite` |
| Validasi kode backend | Ruff dan mypy (tercantum sebagai dependensi dev) |
| Frontend | Node.js 22+, pnpm 10+, TypeScript 6, Vite 8, oxlint |
| Layanan integrasi/dev | PostgreSQL 16 dan Redis 7 via Docker Compose |

## Akun demo

Repository ini **tidak menyertakan akun demo atau data seed pengguna**. Buat akun guru dari halaman registrasi, atau lewat API berikut setelah backend berjalan:

```bash
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "guru.demo@example.com",
    "password": "DemoPahamIn!2026",
    "full_name": "Guru Demo",
    "nama_sekolah": "SD Demo",
    "kota": "Jakarta"
  }'
```

Password harus memiliki minimal 8 karakter dan setidaknya satu huruf besar, huruf kecil, angka, serta karakter spesial. Setelah itu login dengan kredensial yang sama melalui halaman web atau endpoint `POST /api/v1/auth/login`.

## Struktur repository

```text
.
├── apps/
│   ├── api/                 # FastAPI, Alembic, Celery, dan test backend
│   └── web/                 # React/Vite frontend
├── packages/shared/         # Tipe/utilitas bersama workspace
├── docs/ARCHITECTURE.md     # ERD dan detail pipeline AI
├── docker-compose.yml       # Environment API, worker, DB, Redis, dan web
└── package.json             # Perintah workspace pnpm
```

## Catatan keamanan

- Jangan commit `apps/api/.env`, API key Gemini, atau `SECRET_KEY` produksi.
- Ganti nilai default kredensial database dan Flower sebelum deployment publik.
- Batasi `ALLOWED_ORIGINS` ke domain frontend yang digunakan pada lingkungan produksi.
