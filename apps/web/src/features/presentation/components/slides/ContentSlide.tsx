import type { PresentationSlide } from "../../types";

export function ContentSlide({ slide }: { slide: PresentationSlide }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6 px-12 text-center">
      {slide.title && (
        <h2 className="text-3xl font-bold tracking-tight text-foreground drop-shadow-2xs">
          {slide.title}
        </h2>
      )}
      {slide.content && (
        <div className="relative flex max-w-2xl flex-col gap-3 rounded-2xl border-2 border-primary/15 bg-card/90 p-8 shadow-sm backdrop-blur-xs">
          {slide.content.split("\n").filter(Boolean).map((line, index) => (
            <p
              key={index}
              className="text-lg font-medium text-foreground/90 leading-relaxed text-left"
            >
              {line.startsWith("-") || line.startsWith("•") ? line : `✨ ${line}`}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
