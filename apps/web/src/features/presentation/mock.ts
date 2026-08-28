import type { PresentationArtifact } from "./types";

export const mockPresentation: PresentationArtifact = {
  version: "0.2",
  meta: {
    title: "Siklus Air",
    mata_pelajaran: "IPAS",
    topik: "Siklus Air",
    fase: "Fase C",
    total_slides: 7,
  },
  slides: [
    {
      id: "slide-1",
      order: 1,
      type: "opening",
      title: "Siklus Air",
      content: "Perjalanan air yang tiada henti di Bumi kita.",
      teacher_note: "Ajak siswa mengingat pengalaman melihat hujan.",
      speaker_script:
        "Selamat datang! Hari ini kita akan belajar tentang siklus air.",
    },
    {
      id: "slide-2",
      order: 2,
      type: "visual",
      title: "Ilustrasi Siklus Air",
      content: "Air menguap, membentuk awan, lalu turun kembali sebagai hujan.",
      assets: [
        {
          id: "asset-1",
          type: "image",
          url: "https://placehold.co/960x540/eeeeef/1a1c1d?text=Ilustrasi+Siklus+Air",
          alt: "Ilustrasi siklus air",
        },
      ],
    },
    {
      id: "slide-3",
      order: 3,
      type: "content",
      title: "Tahapan Siklus Air",
      content:
        "Evaporasi: air berubah menjadi uap.\nKondensasi: uap air membentuk awan.\nPresipitasi: air turun sebagai hujan.",
    },
    {
      id: "slide-4",
      order: 4,
      type: "interactive",
      title: "Susun Tahapan Siklus Air",
      interaction: {
        type: "sorting",
        id: "sort-1",
        prompt: "Urutkan tahapan siklus air dari awal hingga akhir.",
        correctOrder: [
          { id: "evaporasi", label: "Evaporasi" },
          { id: "kondensasi", label: "Kondensasi" },
          { id: "presipitasi", label: "Presipitasi" },
        ],
      },
    },
    {
      id: "slide-5",
      order: 5,
      type: "interactive",
      title: "Apa yang Terjadi Saat Air Menguap?",
      interaction: {
        type: "reveal",
        id: "reveal-1",
        prompt: "Klik untuk melihat jawaban.",
        hiddenContent:
          "Air berubah menjadi uap air karena panas matahari, lalu naik ke atmosfer.",
      },
    },
    {
      id: "slide-6",
      order: 6,
      type: "interactive",
      title: "Kuis: Proses Terjadinya Hujan",
      interaction: {
        type: "choice",
        id: "choice-1",
        prompt: "Proses uap air berubah menjadi awan disebut?",
        options: [
          { id: "opt-1", label: "Evaporasi", isCorrect: false },
          { id: "opt-2", label: "Kondensasi", isCorrect: true },
          { id: "opt-3", label: "Presipitasi", isCorrect: false },
        ],
      },
    },
    {
      id: "slide-7",
      order: 7,
      type: "closing",
      title: "Terima Kasih",
      content: "Siklus air menjaga keseimbangan kehidupan di Bumi.",
    },
  ],
};
