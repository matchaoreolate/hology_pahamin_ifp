import type { PresentationSlide } from "../../types";

export function ClosingSlide({ slide }: { slide: PresentationSlide }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6 px-12 text-center">
      <div className="rounded-full bg-rose-500/10 p-4 text-5xl shadow-inner animate-bounce">
        🌟
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight text-foreground md:text-5xl drop-shadow-xs">
        {slide.title}
      </h1>
      {slide.content && (
        <p className="max-w-2xl text-xl font-medium text-muted-foreground leading-relaxed">
          {slide.content}
        </p>
      )}
      <div className="mt-2 flex items-center gap-2 rounded-full border border-rose-500/20 bg-rose-500/5 px-5 py-2 text-sm font-bold text-rose-600">
        <span>🎉 Hebat Sekali! Kalian Berhasil Menyelesaikan Materi Ini! 👏</span>
      </div>
    </div>
  );
}
