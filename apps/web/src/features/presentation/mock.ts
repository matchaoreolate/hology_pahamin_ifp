import type { PresentationArtifact } from "./types";

export const mockPresentation: PresentationArtifact = {
  version: "0.2",
  meta: {
    title: "Siklus Air di Bumi",
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
      title: "Siklus Air di Bumi",
      content: "Perjalanan luar biasa molekul air yang menjaga kelestarian kehidupan di planet kita.",
      teacher_note: "Ajak siswa mengingat kembali saat melihat hujan dan genangan air yang menghilang saat panas.",
      speaker_script: "Halo anak-anak hebat! Hari ini kita akan menjelajahi petualangan tetesan air dalam siklus air.",
    },
    {
      id: "slide-2",
      order: 2,
      type: "visual",
      title: "Diagram Siklus Air",
      content: "Air dari laut menguap karena panas matahari, membentuk awan, dan kembali turun sebagai hujan ke tanah.",
      assets: [
        {
          id: "asset-1",
          type: "image",
          url: "https://placehold.co/960x540/1e293b/ffffff?text=Ilustrasi+Siklus+Air",
          alt: "Diagram lengkap tahapan evaporasi, kondensasi, presipitasi, dan infiltrasi",
        },
      ],
      teacher_note: "Tunjuk bagian-bagian utama siklus air pada gambar.",
    },
    {
      id: "slide-3",
      order: 3,
      type: "content",
      title: "Tiga Tahapan Utama",
      content: "1. Evaporasi: Penguapan air dari permukaan bumi ke atmosfer.\n2. Kondensasi: Pembentukan titik-titik air menjadi awan.\n3. Presipitasi: Turunnya titik air ke bumi dalam bentuk hujan.",
      teacher_note: "Jelaskan definisi istilah ilmiah dengan bahasa sederhana.",
    },
    {
      id: "slide-4",
      order: 4,
      type: "interactive",
      title: "Tantangan 1: Pengelompokan Tahapan",
      interaction: {
        type: "sorting",
        instruction: "Kelompokkan fenomena berikut ke dalam tahapan yang tepat!",
        categories: [
          { id: "cat-uap", label: "Proses Penguapan (Evaporasi)" },
          { id: "cat-turun", label: "Proses Air Turun (Presipitasi)" },
        ],
        items: [
          { id: "item-1", label: "Air danau terkena terik matahari", correct_category: "cat-uap" },
          { id: "item-2", label: "Baju basah dijemur hingga kering", correct_category: "cat-uap" },
          { id: "item-3", label: "Hujan rintik di sore hari", correct_category: "cat-turun" },
          { id: "item-4", label: "Hujan salju di pegunungan", correct_category: "cat-turun" },
        ],
        feedback: {
          correct: "Hebat sekali! Kamu berhasil mengelompokkan semua peristiwa dengan tepat.",
          incorrect: "Masih ada peristiwa yang letaknya belum pas, yuk kita diskusikan bersama!",
        },
      },
    },
    {
      id: "slide-5",
      order: 5,
      type: "interactive",
      title: "Tantangan 2: Buka Kotak Rahasia",
      interaction: {
        type: "reveal",
        instruction: "Ketuk kartu di bawah untuk melihat fakta menarik tentang awan!",
        items: [
          {
            id: "rev-1",
            label: "Bagaimana awan bisa melayang?",
            revealed_content: "Awan terdiri dari jutaan tetes air yang sangat kecil dan ringan sehingga dapat tertahan oleh hembusan udara hangat dari bawah.",
          },
          {
            id: "rev-2",
            label: "Berapa berat rata-rata sebuah awan kumulus?",
            revealed_content: "Meskipun terlihat seperti kapas ringan, satu awan kumulus sedang bisa memiliki berat sekitar 500 ton atau setara 100 ekor gajah!",
          },
        ],
      },
    },
    {
      id: "slide-6",
      order: 6,
      type: "interactive",
      title: "Tantangan 3: Kuis Kilat",
      interaction: {
        type: "choice",
        instruction: "Apakah nama proses ketika uap air mendingin dan berubah menjadi awan?",
        options: [
          { id: "opt-1", label: "Evaporasi" },
          { id: "opt-2", label: "Kondensasi" },
          { id: "opt-3", label: "Infiltrasi" },
        ],
        correct_answer: "opt-2",
        feedback: {
          correct: "Tepat sekali! Kondensasi adalah proses uap air menjadi awan.",
          incorrect: "Kurang tepat. Ingat, saat uap mendingin dan mengembun, itu disebut kondensasi.",
        },
      },
    },
    {
      id: "slide-7",
      order: 7,
      type: "closing",
      title: "Mari Menjaga Kelestarian Air",
      content: "Air di bumi terus berputar dan tidak pernah bertambah atau berkurang. Mari gunakan air bersih secara bijak setiap hari!",
      teacher_note: "Ajak siswa membuat komitmen hemat air di sekolah dan rumah.",
      speaker_script: "Terima kasih anak-anak hebat! Sampai jumpa di petualangan sains berikutnya.",
    },
  ],
};
