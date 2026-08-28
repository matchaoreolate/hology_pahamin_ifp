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
// User & Auth Types
// ─────────────────────────────────────────────

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  schoolName?: string | null;
  role: string;
  quota: number;
  createdAt: string;
}

export interface AuthResponse {
  user: UserProfile;
  token: string;
}

// ─────────────────────────────────────────────
// Presentation Types
// ─────────────────────────────────────────────

export interface InteractiveConfig {
  activityType: 'tap_answer' | 'drag_drop' | 'true_false' | 'word_match';
  question: string;
  options: string[];
  correctAnswer: string;
  feedback?: {
    correct: string;
    incorrect: string;
  };
}

export interface PresentationSlide {
  id: number;
  type: 'apersepsi' | 'pembuka' | 'materi' | 'interaktif' | 'ice_breaking' | 'penutup';
  title: string;
  content: string;
  visualDescription: string;
  speakerNotes: string;
  interactive: boolean;
  interactiveConfig?: InteractiveConfig | null;
}

export interface PresentationData {
  title: string;
  theme: string;
  colorPalette: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  slides: PresentationSlide[];
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

// ─────────────────────────────────────────────
// E-Book Types
// ─────────────────────────────────────────────

export interface EbookChapter {
  no: number;
  title: string;
  content: string;
  illustration: string;
  keyPoints: string[];
}

export interface EbookCharacter {
  name: string;
  role: string;
  description: string;
}

export interface EbookGlossaryItem {
  term: string;
  definition: string;
}

export interface EbookParentDiscussionPrompt {
  question: string;
  hint: string;
}

export interface EbookData {
  title: string;
  subtitle?: string;
  subject: string;
  topic: string;
  targetAge: string;
  characters?: EbookCharacter[];
  chapters: EbookChapter[];
  glossary?: EbookGlossaryItem[];
  parentDiscussion?: EbookParentDiscussionPrompt[];
  closingMessage?: string;
}

// ─────────────────────────────────────────────
// Project Model Type
// ─────────────────────────────────────────────

export interface ProjectDetail {
  id: string;
  userId: string;
  title: string;
  subject: string;
  phase: string;
  topic: string;
  learningGoal: string;
  durationJP: number;
  geoContext?: string | null;
  classLevel?: string | null;
  apersepsi?: string | null;
  hasPresentasi: boolean;
  hasLkpd: boolean;
  hasEbook: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
  presentationData?: PresentationData | null;
  lkpdData?: LkpdData | null;
  ebookData?: EbookData | null;
}

export interface ProjectListItem {
  id: string;
  title: string;
  subject: string;
  phase: string;
  topic: string;
  status: string;
  hasPresentasi: boolean;
  hasLkpd: boolean;
  hasEbook: boolean;
  createdAt: string;
  updatedAt: string;
}
