import { useState } from "react";
import type { PresentationArtifact } from "../types";
import { PresentationHeader } from "./PresentationHeader";
import { PresentationNavigation } from "./PresentationNavigation";
import { SlideViewport } from "./SlideViewport";

export function PresentationRuntime({
  artifact,
  onExit,
}: {
  artifact: PresentationArtifact;
  onExit: () => void;
}) {
  const [current, setCurrent] = useState(0);
  const slide = artifact.slides[current];

  return (
    <div className="flex h-full w-full flex-col bg-white">
      <PresentationHeader meta={artifact.meta} current={current} onExit={onExit} />
      <div className="relative flex flex-1 items-center justify-center overflow-hidden px-8 py-8">
        <SlideViewport slide={slide} className="aspect-auto h-full" />
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <PresentationNavigation
            variant="floating"
            current={current}
            total={artifact.slides.length}
            onPrev={() => setCurrent((c) => Math.max(0, c - 1))}
            onNext={() => setCurrent((c) => Math.min(artifact.slides.length - 1, c + 1))}
          />
        </div>
      </div>
    </div>
  );
}
