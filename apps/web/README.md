# PahamIn — Web Frontend

> Antarmuka web modern, interaktif, dan responsif untuk platform media pembelajaran guru SD Indonesia.

Frontend PahamIn dibangun dengan **React 19**, **TypeScript**, **Vite**, dan **TailwindCSS v4**, dioptimalkan untuk penggunaan desktop guru serta tampilan layar sentuh interaktif (*Interactive Flat Panel / IFP TV*) di ruang kelas.

---

## 🚀 Fitur Utama

- **Studio Presentasi Interaktif (IFP TV Runtime)**:
  - Viewer slide layar sentuh interaktif dengan tombol virtual, kuis langsung, dan catatan guru (*teacher notes*).
  - **AI Transform Bar**: Ubah isi, ringkas poin, atau tambahkan interaksi pada slide aktif dengan instruksi natural language (didukung Gemini AI).
  - **Manual Slide Editor**: Dialog pengeditan instan untuk judul, poin materi, elemen visual, interaksi siswa, dan naskah bicara guru.
  - **Add & Delete Slide**: Tambah slide baru secara manual atau otomatis via AI, serta hapus slide yang tidak diperlukan.
  - **Standalone Export**: Build runtime mandiri ke dalam 1 file HTML (`singlefile`) yang siap dipindahkan via flashdisk dan dijalankan di TV sekolah secara offline tanpa internet.
- **Manajemen Konteks Pembelajaran**:
  - Formulir Kurikulum Merdeka: Fase A–C, Kelas, Mata Pelajaran, Tujuan Pembelajaran (TP), Konteks Geografis, dan Kearifan Lokal.
- **Project Wizard & Background Generation**:
  - Konfigurasi output media (Presentasi, LKPD, E-Book) dengan pemantauan progress status paralel via polling REST API.
- **LKPD Cetak & Diferensiasi TaRL**:
  - Tampilan lembar kerja siswa berjenjang (Perlu Bimbingan, Cukup Mahir, Sangat Mahir) dengan fitur ekspor ke PDF siap cetak.
- **E-Book Siswa**:
  - Pembaca buku digital kontekstual bergambar dengan rubrik evaluasi pemahaman siswa.
- **Autentikasi & Profil Guru**:
  - Manajemen sesi login berbasis JWT dengan penyimpanan kredensial yang aman.

---

## 🛠️ Tech Stack

| Kategori | Teknologi |
|---|---|
| **Framework & Runtime** | [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite 8](https://vite.dev/) |
| **Styling & Desain** | [TailwindCSS v4](https://tailwindcss.com/), `@tailwindcss/vite`, CSS Variables |
| **Komponen UI & Animasi** | `@base-ui/react`, [Framer Motion](https://www.framer.com/motion/), [Lenis](https://lenis.darkroom.engineering/) |
| **Ikonografi & Font** | `lucide-react`, `@hugeicons/react`, `@fontsource-variable/dm-sans`, `@fontsource-variable/roboto` |
| **Interaktivitas & Alur** | `@xyflow/react` (React Flow), `embla-carousel-react`, `intro.js` |
| **Ekspor & Utilitas** | `jspdf`, `html2canvas-pro`, `vite-plugin-singlefile`, `axios` |
| **Linter** | [oxlint](https://oxc.rs/docs/guide/usage/linter.html) |

---

## 📂 Struktur Direktori

```text
apps/web/
├── public/
│   ├── export/               # Template runtime HTML mandiri
│   └── favicon.svg
├── src/
│   ├── components/           # Komponen UI global (Navbar, Button, Modal, dll.)
│   ├── export-runtime/       # Engine renderer untuk ekspor offline single-file
│   ├── features/             # Modul domain aplikasi
│   │   ├── auth/             # Login, Register, Protected Route
│   │   ├── dashboard/        # Beranda guru, ringkasan konteks & project
│   │   ├── presentation/     # Presentation Studio, AI Transform Bar, Dialogs
│   │   ├── lkpd/             # Viewer LKPD berjenjang & print layout
│   │   ├── ebook/            # Viewer E-Book kontekstual
│   │   ├── landing/          # Halaman beranda publik
│   │   └── projects/         # Wizard pembuatan proyek & konfigurasi media
│   ├── lib/
│   │   ├── api/              # Klien HTTP Axios terpusat (auth, context, project, outputs)
│   │   └── utils.ts          # Helper styling (clsx, tailwind-merge)
│   ├── types/                # Definisi tipe TypeScript
│   ├── App.tsx               # Konfigurasi routing utama
│   ├── index.css             # Entry stylesheet & utility layer
│   └── main.tsx              # Entrypoint aplikasi React
├── vite.config.ts            # Konfigurasi Vite aplikasi web utama
├── vite.export.config.ts     # Konfigurasi Vite bundle standalone single-file
└── package.json
```

---

## ⚙️ Variabel Lingkungan (.env)

Buat file `.env` di dalam folder `apps/web/` jika perlu menyesuaikan alamat backend:

```dotenv
# URL basis REST API backend FastAPI
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

> **Catatan**: Jika dijalankan langsung via browser tanpa Docker reverse proxy, pastikan backend FastAPI mengizinkan origin frontend melalui konfigurasi `ALLOWED_ORIGINS` di backend.

---

## 💻 Menjalankan Secara Lokal

### 1. Instal Dependensi

Jalankan instalasi dari root monorepo:

```bash
pnpm install
```

### 2. Menjalankan Dev Server

```bash
# Dari root monorepo:
pnpm dev:web

# Atau langsung dari direktori apps/web:
cd apps/web
pnpm dev
```

Aplikasi web dapat diakses di: **http://localhost:5173**

### 3. Perintah Build & Lint

```bash
# Linting kode dengan Oxlint super cepat:
pnpm lint

# Build production untuk web utama:
pnpm build

# Build engine standalone export offline:
pnpm build:export

# Preview hasil build production lokal:
pnpm preview
```
