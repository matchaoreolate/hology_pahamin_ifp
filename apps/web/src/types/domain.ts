export type OutputType = "presentation" | "lkpd" | "ebook";

export interface LearningContext {
  id: string;
  fase: string;
  kelas: string;
  mata_pelajaran: string;
  topik: string;
  tujuan_pembelajaran: string;
  alokasi_waktu_jp: number;
  fokus_pendekatan?: string[] | null;
  konteks_geografis?: string | null;
  level_kemampuan_kelas?: string | null;
  apersepsi?: string | null;
}

export interface MediaProject {
  id: string;
  learning_context_id: string;
  title: string;
  status: "draft" | "processing" | "done" | "error";
  selected_outputs: OutputType[];
}
