import { useEffect, useState } from "react";

import { ShowcaseNavigation } from "./ShowcaseNavigation";
import { ShowcaseSlide } from "./ShowcaseSlide";
import { showcaseSlides } from "./mock";

const AUTOPLAY_MS = 2500;

export function HeroPresentationShowcase() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  function goTo(next: number) {
    setIndex(((next % showcaseSlides.length) + showcaseSlides.length) % showcaseSlides.length);
  }

  // Restarts automatically whenever `index` changes, which also covers
  // manual navigation resetting the autoplay countdown.
  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % showcaseSlides.length);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [index, paused]);

  const slide = showcaseSlides[index];

  return (
    <div
      className="flex flex-1 flex-col"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <ShowcaseSlide key={slide.id} slide={slide} onNext={() => goTo(index + 1)} />
      <ShowcaseNavigation
        current={index}
        total={showcaseSlides.length}
        onPrev={() => goTo(index - 1)}
        onNext={() => goTo(index + 1)}
      />
    </div>
  );
}
