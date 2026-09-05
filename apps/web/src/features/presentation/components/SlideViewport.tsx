import type { PresentationSlide } from "../types";
import { SlideRenderer } from "./SlideRenderer";

const SLIDE_TYPE_BADGES: Record<string, { label: string; emoji: string; color: string }> = {
  opening: { label: "Apersepsi & Mulai", emoji: "🚀", color: "bg-blue-500/10 text-blue-600 border-blue-200" },
  content: { label: "Materi Belajar", emoji: "💡", color: "bg-amber-500/10 text-amber-700 border-amber-200" },
  visual: { label: "Ayo Amati Visual", emoji: "🔍", color: "bg-emerald-500/10 text-emerald-700 border-emerald-200" },
  interactive: { label: "Aktivitas Interaktif", emoji: "🎮", color: "bg-purple-500/10 text-purple-700 border-purple-200" },
  closing: { label: "Refleksi & Apresiasi", emoji: "🎉", color: "bg-rose-500/10 text-rose-700 border-rose-200" },
};

export function SlideViewport({
  slide,
  className = "",
}: {
  slide: PresentationSlide;
  className?: string;
}) {
  const badge = SLIDE_TYPE_BADGES[slide.type] ?? {
    label: "Materi",
    emoji: "📚",
    color: "bg-secondary text-foreground border-border",
  };

  return (
    <div
      className={`relative flex aspect-video w-full flex-col items-center justify-center overflow-hidden bg-radial from-card via-card to-secondary/30 transition-all ${className}`}
    >
      {/* Top Pedagogical Stage Badge */}
      <div className="absolute top-4 left-6 z-10 flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-xs font-semibold shadow-2xs backdrop-blur-xs ${badge.color}">
        <span>{badge.emoji}</span>
        <span>{badge.label}</span>
      </div>

      {/* Main Slide Content */}
      <div className="flex h-full w-full items-center justify-center pt-6">
        <SlideRenderer slide={slide} />
      </div>
    </div>
  );
}
