import type { PresentationSlide } from "../types";
import { SlideRenderer } from "./SlideRenderer";

export function SlideViewport({
  slide,
  className = "",
}: {
  slide: PresentationSlide;
  className?: string;
}) {
  return (
    <div className={`flex aspect-video w-full items-center justify-center bg-card ${className}`}>
      <SlideRenderer slide={slide} />
    </div>
  );
}
