# PahamIn Backend API

Backend API untuk PahamIn — Platform Generator Media Pembelajaran AI untuk Guru SD.

## Stack
- Framework: NestJS
- Database: PostgreSQL 16 (via Docker)
- ORM: Prisma v5
- Auth: JWT + Passport
- AI: Google Gemini
- Docs: Swagger UI

---

## Cara Menjalankan (Docker)

### 1. Setup environment
```bash
cp apps/api/.env.example apps/api/.env
# Edit apps/api/.env — isi GEMINI_API_KEY
```

### 2. Jalankan semua service (DB + API)
```bash
docker-compose up -d
```

Server berjalan di: `http://localhost:3001`  
Swagger Docs: `http://localhost:3001/api/docs`

### 3. Stop semua service
```bash
docker-compose down
```

### 4. Hapus data DB juga
```bash
docker-compose down -v
```

---

## Development Lokal (tanpa Docker API, hanya DB di Docker)

```bash
# 1. Jalankan hanya PostgreSQL di Docker
docker-compose up db -d

# 2. Install deps
pnpm install

# 3. Generate Prisma Client & jalankan migration
pnpm prisma generate
pnpm prisma migrate dev --name init

# 4. Jalankan dev server
pnpm start:dev
```

---

## API Endpoints Auth

| Method | URL | Aksi | Auth |
|--------|-----|------|------|
| POST | `/api/auth/register` | Daftar Guru baru | Tidak |
| POST | `/api/auth/login` | Login & dapat JWT token | Tidak |
| GET | `/api/auth/me` | Profil + sisa kuota Guru | Bearer JWT |
