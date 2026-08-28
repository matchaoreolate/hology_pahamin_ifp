import type { MediaProject, OutputType } from "../../types/domain";

export interface ProjectSummary extends MediaProject {
  mata_pelajaran: string;
  kelas: string;
  updated_label: string;
}

export const mockProjects: ProjectSummary[] = [
  {
    id: "siklus-air",
    learning_context_id: "ctx-siklus-air",
    title: "Siklus Air",
    status: "done",
    selected_outputs: ["presentation", "lkpd", "ebook"] as OutputType[],
    mata_pelajaran: "IPAS",
    kelas: "Kelas 5",
    updated_label: "Terakhir diubah: 2 jam lalu",
  },
  {
    id: "penjumlahan-pecahan",
    learning_context_id: "ctx-pecahan",
    title: "Penjumlahan Pecahan",
    status: "done",
    selected_outputs: ["presentation", "lkpd"] as OutputType[],
    mata_pelajaran: "Matematika",
    kelas: "Kelas 4",
    updated_label: "Terakhir diubah: 1 hari lalu",
  },
];
