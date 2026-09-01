import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { useEffect, useState } from "react";

import { ShowcaseNavigation } from "./ShowcaseNavigation";
import { ShowcaseSlide } from "./ShowcaseSlide";
import { showcaseSlides } from "./mock";

const AUTOPLAY_MS = 2000;

export function HeroPresentationShowcase() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [autoplay] = useState(() =>
    Autoplay({ delay: AUTOPLAY_MS, stopOnInteraction: false, stopOnMouseEnter: true }),
  );
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [autoplay]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  return (
    <div
      className="flex flex-1 flex-col"
      onFocus={() => autoplay.stop()}
      onBlur={() => autoplay.play()}
    >
      <div className="min-h-0 flex-1 overflow-hidden" ref={emblaRef}>
        <div className="flex h-full">
          {showcaseSlides.map((slide) => (
            <ShowcaseSlide key={slide.id} slide={slide} onNext={() => emblaApi?.scrollNext()} />
          ))}
        </div>
      </div>
      <ShowcaseNavigation
        current={selectedIndex}
        total={showcaseSlides.length}
        onPrev={() => emblaApi?.scrollPrev()}
        onNext={() => emblaApi?.scrollNext()}
      />
    </div>
  );
}
