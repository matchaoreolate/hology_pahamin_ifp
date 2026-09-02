/**
 * Types mirroring the FastAPI backend contract (apps/api).
 * Source of truth: apps/api/app/schemas/*.py — do not hand-edit without re-checking those files.
 *
 * These are transport-level types. UI-facing types in `@/types/domain.ts` and
 * `@/features/**\/types.ts` may differ in shape/naming where they are intentionally
 * designed for rendering; the `lib/api` modules are responsible for mapping between them.
 */
import type { PresentationArtifact } from "@/features/presentation/types";

// ── Auth ────────────────────────────────────────────────────────────────

export interface RegisterRequest {
  email: string;
  password: string;
  full_name: string;
  nama_sekolah?: string | null;
  kota?: string | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface UserResponse {
  id: string;
  email: string;
  full_name: string;
  nama_sekolah: string | null;
  kota: string | null;
  is_active: boolean;
}

// ── Learning Context (Tahap 1) ─────────────────────────────────────────

export type Fase = "A" | "B" | "C";
export type Kelas = "1&2" | "3&4" | "5&6";
export type MataPelajaran =
  | "IPAS"
  | "Matematika"
  | "Bahasa Indonesia"
  | "Pendidikan Pancasila"
  | "PJOK"
  | "Seni"
  | "Bahasa Inggris"
  | "Agama";
export type FokusPendekatan = "analogi_sehari_hari" | "visual_gambar" | "aktivitas_fisik";
export type KonteksGeografis = "pesisir" | "perkotaan" | "pegunungan";
export type LevelKemampuanKelas = "belum_paham" | "sudah_paham" | "campuran";

export interface LearningContextCreate {
  fase: Fase;
  kelas: Kelas;
  mata_pelajaran: MataPelajaran;
  topik: string;
  tujuan_pembelajaran: string;
  /** Jam Pelajaran — 1 or 2, NOT minutes. Backend field is still `alokasi_waktu_jp`. */
  alokasi_waktu_jp: number;
  fokus_pendekatan?: FokusPendekatan[] | null;
  konteks_geografis?: KonteksGeografis | null;
  level_kemampuan_kelas?: LevelKemampuanKelas | null;
  apersepsi?: string | null;
}

export type LearningContextUpdate = Partial<LearningContextCreate>;

export interface LearningContextApiResponse {
  id: string;
  user_id: string;
  fase: string;
  kelas: string;
  mata_pelajaran: string;
  topik: string;
  tujuan_pembelajaran: string;
  alokasi_waktu_jp: number;
  fokus_pendekatan: string[] | null;
  konteks_geografis: string | null;
  level_kemampuan_kelas: string | null;
  apersepsi: string | null;
  created_at: string;
  updated_at: string;
}

// ── Media Project (Tahap 2 & 3) ────────────────────────────────────────

export type ApiOutputType = "presentation" | "lkpd" | "ebook";

export interface PresentasiConfig {
  gaya_visual?: "cute_3d" | "futuristic_neon" | "flat_colorful" | "minimalist";
  mode_dinamika?: "fokus" | "seimbang" | "super_aktif";
  ice_breaking?: boolean;
  kepadatan_teks?: number;
  gaya_interaksi?: "fasilitator" | "penceramah";
  instruksi_spesifik?: string | null;
}

export interface LKPDConfig {
  format_tantangan?: "isian_singkat" | "pilihan_ganda" | "mencocokkan" | "campuran";
  jumlah_soal?: number;
  distribusi_kesulitan?: "70_mudah_30_hots" | "50_mudah_50_hots" | "30_mudah_70_hots";
  injeksi_konteks_lokal?: boolean;
  rubrik_penilaian?: boolean;
}

export interface EbookConfig {
  format_narasi?: "buku_cerita" | "dialog_karakter";
  glosarium_cerdas?: boolean;
  pemantik_diskusi_rumah?: boolean;
}

export interface OutputConfig {
  presentasi?: PresentasiConfig | null;
  lkpd?: LKPDConfig | null;
  ebook?: EbookConfig | null;
}

export interface MediaProjectCreate {
  learning_context_id: string;
  title: string;
  selected_outputs: ApiOutputType[];
  output_config?: OutputConfig;
}

export interface MediaProjectUpdateConfig {
  title?: string;
  selected_outputs?: ApiOutputType[];
  output_config?: OutputConfig;
}

export type ProjectStatus = "draft" | "processing" | "done" | "error";

export interface MediaProjectApiResponse {
  id: string;
  user_id: string;
  learning_context_id: string;
  title: string;
  status: ProjectStatus;
  selected_outputs: ApiOutputType[];
  output_config: OutputConfig;
  error_message: string | null;
  created_at: string;
  updated_at: string;
}

// ── Generation status / summary / workspace ────────────────────────────

export interface OutputStatusEntry {
  output_type: ApiOutputType;
  status: "pending" | "processing" | "done" | "error";
  generated_at: string | null;
}

export interface ProjectStatusResponse {
  project_id: string;
  project_status: ProjectStatus;
  outputs: OutputStatusEntry[];
  error_message: string | null;
}

export interface ProjectSummaryResponse {
  project_id: string;
  summary: string;
  details: {
    topik: string;
    fase: string;
    kelas: string;
    mata_pelajaran: string;
    selected_outputs: ApiOutputType[];
    output_config: OutputConfig;
  };
}

// Workspace shape is assembled dynamically by ProjectWorkspaceService; treat as opaque.
export type ProjectWorkspaceResponse = Record<string, unknown>;

// ── Generated Outputs ───────────────────────────────────────────────────

export interface OutputContentResponse<TContent> {
  project_id: string;
  output_type: ApiOutputType;
  content: TContent;
  generated_at: string | null;
}

export interface OutputEditResponse<TContent> {
  project_id: string;
  output_type: ApiOutputType;
  message: string;
  content: TContent;
}

export interface RuntimeResponse {
  runtime_id: string;
  mode: "interactive_tv";
  artifact: PresentationArtifact;
  ifp_settings: {
    optimized_for: string;
    touch_target_min_size: string;
    font_scale: string;
    contrast: string;
  };
}

export interface PublicPresentationResponse {
  project_id: string;
  artifact: PresentationArtifact;
}

export interface FeedbackRequest {
  rating?: number | null;
  catatan?: string;
  siswa_aktif?: boolean | null;
  kendala?: string;
}

export interface FeedbackResponse {
  project_id: string;
  message: string;
  feedback: {
    rating: number | null;
    catatan: string;
    siswa_aktif: boolean | null;
    kendala: string;
    submitted_at: string;
  };
}

// LKPD / e-book content is free-form AI output — no fixed Pydantic schema on the backend.
export type LkpdContent = Record<string, unknown>;
export type EbookContent = Record<string, unknown>;

// ── Errors ───────────────────────────────────────────────────────────────

/** Normalised shape for any failed request — see lib/api/client.ts. */
export interface ApiError {
  status: number | null;
  detail: string;
  raw: unknown;
}
