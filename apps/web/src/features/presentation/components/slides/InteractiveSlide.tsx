import { InteractionRenderer } from "../../interactions/InteractionRenderer";
import type { PresentationSlide } from "../../types";

export function InteractiveSlide({ slide }: { slide: PresentationSlide }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 px-16 text-center">
      {slide.title && (
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">{slide.title}</h2>
      )}
      {slide.interaction && <InteractionRenderer interaction={slide.interaction} />}
    </div>
  );
}
