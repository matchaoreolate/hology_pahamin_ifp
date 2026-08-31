import type { PresentationSlide } from "../../types";

export function ContentSlide({ slide }: { slide: PresentationSlide }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 px-16 text-center">
      {slide.title && (
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">{slide.title}</h2>
      )}
      {slide.content && (
        <div className="flex max-w-2xl flex-col gap-2 text-base text-foreground">
          {slide.content.split("\n").map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>
      )}
    </div>
  );
}
