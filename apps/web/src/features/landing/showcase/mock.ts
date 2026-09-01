import type { ShowcaseSlideData } from "./types";

export const showcaseSlides: ShowcaseSlideData[] = [
  {
    id: "matematika",
    subject: "Matematika • Pecahan",
    title: "Mengenal Pecahan Senilai",
    content: "Perhatikan gambar. Geser bagian yang berwarna untuk mencari pecahan senilai.",
    visual: {
      type: "fraction",
      left: { numerator: 1, denominator: 2 },
      right: { numerator: 4, denominator: 8 },
    },
  },
  {
    id: "ipas",
    subject: "IPAS • Siklus Air",
    title: "Bagaimana Air Berputar?",
    content: "Susun tahapan siklus air dari proses awal hingga kembali ke bumi.",
    visual: {
      type: "sorting",
      instruction: "Ketuk tahapan sesuai urutannya.",
      categories: [
        { id: "step-1", label: "1" },
        { id: "step-2", label: "2" },
        { id: "step-3", label: "3" },
        { id: "step-4", label: "4" },
      ],
      items: [
        { id: "evaporasi", label: "Penguapan", correct_category: "step-1" },
        { id: "kondensasi", label: "Kondensasi", correct_category: "step-2" },
        { id: "presipitasi", label: "Presipitasi", correct_category: "step-3" },
        { id: "pengumpulan", label: "Pengumpulan", correct_category: "step-4" },
      ],
      feedback: {
        correct: "Tepat! Begitulah air terus berputar.",
        incorrect: "Coba urutkan lagi, ya.",
      },
    },
  },
  {
    id: "bahasa-indonesia",
    subject: "Bahasa Indonesia • Ide Pokok",
    title: "Temukan Ide Pokok",
    content: "Baca paragraf berikut, lalu pilih kalimat yang menjadi ide pokok.",
    visual: {
      type: "choice",
      instruction:
        "Hutan mangrove melindungi pantai dari abrasi. Akarnya menahan tanah dari ombak, dan menjadi rumah bagi banyak hewan.",
      options: [
        { id: "opt-1", label: "Hutan mangrove melindungi pantai dari abrasi." },
        { id: "opt-2", label: "Akarnya menahan tanah dari ombak." },
        { id: "opt-3", label: "Mangrove menjadi rumah bagi banyak hewan." },
      ],
      correct_answer: "opt-1",
      feedback: {
        correct: "Benar! Itulah ide pokok paragrafnya.",
        incorrect: "Coba baca lagi paragrafnya.",
      },
    },
  },
];
