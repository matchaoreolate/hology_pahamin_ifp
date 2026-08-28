import type { PresentationSlide } from "../types";
import { ClosingSlide } from "./slides/ClosingSlide";
import { ContentSlide } from "./slides/ContentSlide";
import { InteractiveSlide } from "./slides/InteractiveSlide";
import { OpeningSlide } from "./slides/OpeningSlide";
import { VisualSlide } from "./slides/VisualSlide";

export function SlideRenderer({ slide }: { slide: PresentationSlide }) {
  switch (slide.type) {
    case "opening":
      return <OpeningSlide slide={slide} />;
    case "content":
      return <ContentSlide slide={slide} />;
    case "visual":
      return <VisualSlide slide={slide} />;
    case "interactive":
      return <InteractiveSlide slide={slide} />;
    case "closing":
      return <ClosingSlide slide={slide} />;
  }
}
