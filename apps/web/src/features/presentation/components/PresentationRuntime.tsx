import { Maximize2 } from "lucide-react";
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
  const [headerVisible, setHeaderVisible] = useState(true);
  const slide = artifact.slides[current];

  return (
    <div className="relative flex h-full w-full flex-col bg-background">
      {headerVisible ? (
        <PresentationHeader
          meta={artifact.meta}
          current={current}
          onExit={onExit}
          onHide={() => setHeaderVisible(false)}
        />
      ) : (
        <button
          onClick={() => setHeaderVisible(true)}
          aria-label="Tampilkan header"
          title="Tampilkan header"
          className="absolute top-4 right-4 z-10 flex size-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-md transition-colors hover:text-foreground"
        >
          <Maximize2 size={14} />
        </button>
      )}
      <div className="relative flex flex-1 items-center justify-center overflow-hidden px-8 py-8">
        <SlideViewport slide={slide} className="aspect-auto h-full" />
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
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