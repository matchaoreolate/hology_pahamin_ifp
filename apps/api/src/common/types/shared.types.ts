// ─────────────────────────────────────────────
// Enums
// ─────────────────────────────────────────────

export enum FaseKelas {
  A = 'A', // Kelas 1 & 2
  B = 'B', // Kelas 3 & 4
  C = 'C', // Kelas 5 & 6
}

export enum GeoContext {
  PESISIR = 'pesisir',
  PERKOTAAN = 'perkotaan',
  PEGUNUNGAN = 'pegunungan',
}

export enum ClassLevel {
  BELUM_PAHAM = 'belum_paham',
  SUDAH_PAHAM = 'sudah_paham',
  CAMPURAN = 'campuran',
}

export enum VisualTheme {
  CUTE_3D = 'cute_3d',
  NEON_FUTURISTIC = 'neon_futuristic',
  FLAT_COLORFUL = 'flat_colorful',
  WATERCOLOR = 'watercolor',
}

export enum ClassMode {
  FOKUS = 'fokus',
  SEIMBANG = 'seimbang',
  SUPER_AKTIF = 'super_aktif',
}

export enum LkpdQuestionType {
  ISIAN_SINGKAT = 'isian_singkat',
  PILIHAN_GANDA = 'pilihan_ganda',
  MENCOCOKKAN = 'mencocokkan',
  CAMPURAN = 'campuran',
}

export enum EbookNarrativeStyle {
  BUKU_CERITA = 'buku_cerita',
  DIALOG_KARAKTER = 'dialog_karakter',
}

// ─────────────────────────────────────────────
// LKPD Types
// ─────────────────────────────────────────────

export interface LkpdQuestion {
  no: number;
  type: 'pilihan_ganda' | 'isian_singkat' | 'mencocokkan' | 'uraian';
  difficulty: 'mudah' | 'sedang' | 'hots';
  question: string;
  options?: string[];
  answer?: string;
  score?: number;
  hotsLevel?: string | null;
}

export interface LkpdRubrik {
  totalScore: number;
  answerKey: Array<{
    no: number;
    answer: string;
    score: number;
  }>;
  scoringGuide: string;
}

export interface LkpdData {
  title: string;
  subject: string;
  topic: string;
  fase: string;
  petunjuk: string;
  identitySection: {
    fields: string[];
  };
  questions: LkpdQuestion[];
  rubrik?: LkpdRubrik | null;
}
