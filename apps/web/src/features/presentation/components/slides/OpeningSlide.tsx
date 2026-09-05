import type { PresentationSlide } from "../../types";

export function OpeningSlide({ slide }: { slide: PresentationSlide }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6 px-12 text-center">
      <div className="rounded-full bg-primary/10 p-4 text-4xl shadow-inner">
        🎒
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight text-foreground md:text-5xl drop-shadow-xs">
        {slide.title}
      </h1>
      {slide.content && (
        <p className="max-w-2xl text-xl font-medium text-muted-foreground leading-relaxed">
          {slide.content}
        </p>
      )}
      <div className="mt-2 flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary">
        <span>✨ Ayo Bersiap dan Belajar Bersama!</span>
      </div>
    </div>
  );
}
