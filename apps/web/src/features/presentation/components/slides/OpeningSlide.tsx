import type { PresentationSlide } from "../../types";

export function OpeningSlide({ slide }: { slide: PresentationSlide }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-4xl font-semibold tracking-tight text-foreground">{slide.title}</h1>
      {slide.content && <p className="max-w-xl text-lg text-muted-foreground">{slide.content}</p>}
    </div>
  );
}
