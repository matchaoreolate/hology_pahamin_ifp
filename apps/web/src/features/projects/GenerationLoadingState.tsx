import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, Lightbulb, PencilRuler, RotateCcw, Sparkles, TriangleAlert } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

const FACTS = [
  "Visual yang relevan dapat membantu siswa memahami konsep yang sulit dijelaskan hanya dengan teks.",
  "Pertanyaan sederhana di tengah pembelajaran dapat membantu guru mengetahui sejauh mana siswa memahami materi.",
  "Aktivitas interaktif dapat membuka kesempatan bagi siswa untuk ikut berpikir, bukan hanya melihat dan mendengarkan.",
  "Contoh yang dekat dengan kehidupan sehari-hari dapat membantu siswa menghubungkan konsep baru dengan pengalaman mereka.",
  "Materi pembelajaran yang baik tidak harus penuh dengan elemen visual. Setiap visual sebaiknya punya tujuan yang jelas.",
  "Guru dapat menggunakan respons siswa selama pembelajaran sebagai bahan untuk menyesuaikan penjelasan berikutnya.",
  "Satu konsep dapat dipahami dengan cara yang berbeda oleh setiap siswa. Variasi aktivitas dapat membantu menjangkau kebutuhan belajar yang beragam.",
  "Interaksi sederhana seperti memilih, mengurutkan, atau mencocokkan dapat membuat siswa lebih aktif mengeksplorasi materi.",
];

const FACT_INTERVAL_MS = 5000;
const ICON_INTERVAL_MS = 2200;
const NEAR_DONE_THRESHOLD_S = 60;

const cycleIcons = [BookOpen, Lightbulb, Sparkles, PencilRuler];

interface GenerationLoadingStateProps {
  /** "starting": creating project/context. "generating": generation kicked off, polling status. */
  phase: "starting" | "generating";
  errorMessage: string | null;
  onRetry: () => void;
}

export function GenerationLoadingState({ phase, errorMessage, onRetry }: GenerationLoadingStateProps) {
  const [factIndex, setFactIndex] = useState(0);
  const [iconIndex, setIconIndex] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (errorMessage) return;
    const factTimer = setInterval(() => {
      setFactIndex((i) => (i + 1) % FACTS.length);
    }, FACT_INTERVAL_MS);
    const iconTimer = setInterval(() => {
      setIconIndex((i) => (i + 1) % cycleIcons.length);
    }, ICON_INTERVAL_MS);
    const secondsTimer = setInterval(() => {
      setElapsedSeconds((s) => s + 1);
    }, 1000);
    return () => {
      clearInterval(factTimer);
      clearInterval(iconTimer);
      clearInterval(secondsTimer);
    };
  }, [errorMessage]);

  const Icon = cycleIcons[iconIndex];

  if (errorMessage) {
    return (
      <div className="flex flex-col items-center gap-6 rounded-xl border border-border bg-card p-12 text-center shadow-xs">
        <div className="flex size-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <TriangleAlert size={28} />
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold text-foreground">Gagal membuat media</h2>
          <p className="max-w-md text-sm text-muted-foreground">
            Sepertinya terjadi kendala saat menyiapkan media Anda. Jangan khawatir, materi yang
            Anda masukkan tetap aman.
          </p>
        </div>
        <Button type="button" variant="primary" onClick={onRetry}>
          <RotateCcw size={14} />
          Coba lagi
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-8 rounded-xl border border-border bg-card p-12 text-center shadow-xs">
      {/* Educational loading animation: a rotating carousel of learning-related icons. */}
      <div className="relative flex size-24 items-center justify-center rounded-full bg-[#001456] [animation:shadow-pulse_2.4s_ease-in-out_infinite]">
        <AnimatePresence mode="wait">
          <motion.div
            key={iconIndex}
            initial={{ opacity: 0, scale: 0.7, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.7, rotate: 10 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <Icon size={34} className="text-[#fdd34d]" />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold text-foreground">
          Sedang menyiapkan media pembelajaran...
        </h2>
        <p className="max-w-md text-sm text-muted-foreground">
          PahamIn sedang menyusun materi, aktivitas, dan tampilan yang sesuai dengan pembelajaran
          Anda.
        </p>
      </div>

      {/* Indeterminate progress — communicates active work, not a real completion percentage. */}
      <div className="w-full max-w-xs overflow-hidden rounded-full bg-secondary">
        <div className="h-1.5 w-1/3 rounded-full bg-primary [animation:indeterminate-sweep_1.4s_ease-in-out_infinite]" />
      </div>

      <div className="flex flex-col items-center gap-1">
        <p className="font-mono text-xs text-muted-foreground">
          Perkiraan waktu: sekitar 30–60 detik
        </p>
        <p className="text-xs text-muted-foreground">Mohon tunggu, media Anda sedang dibuat.</p>
      </div>

      <div className="min-h-16 w-full max-w-lg rounded-lg border border-border bg-secondary/40 px-6 py-4">
        <AnimatePresence mode="wait">
          {elapsedSeconds > NEAR_DONE_THRESHOLD_S ? (
            <motion.div
              key="near-done"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-1"
            >
              <p className="text-sm font-medium text-foreground">Hampir siap!</p>
              <p className="text-[13px] text-muted-foreground">
                Kami sedang merapikan setiap bagian agar siap digunakan di kelas.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key={factIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-1"
            >
              <p className="text-sm font-medium text-foreground">Tahukah Anda?</p>
              <p className="text-[13px] text-muted-foreground">{FACTS[factIndex]}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* <p className="font-mono text-[10px] tracking-wide text-muted-foreground/70 uppercase">
        {phase === "starting" ? "Menyiapkan proyek..." : "Membuat materi dengan AI..."}
      </p> */}
    </div>
  );
}
