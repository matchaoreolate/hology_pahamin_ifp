import { ShowcaseVisual } from "./ShowcaseVisual";
import type { ShowcaseSlideData } from "./types";

interface ShowcaseSlideProps {
  slide: ShowcaseSlideData;
  onNext: () => void;
}

export function ShowcaseSlide({ slide, onNext }: ShowcaseSlideProps) {
  return (
    <div className="flex h-full min-w-0 shrink-0 grow-0 basis-full items-center justify-between gap-2 sm:gap-8">
      <div className="max-w-[60%] lg:max-w-[428px]">
        <p className="mb-0.5 text-[7px] font-bold tracking-wide text-[#001456] sm:mb-2 sm:text-xs lg:text-sm">
          {slide.subject}
        </p>
        <h2 className="mb-1 text-xs leading-tight font-bold text-[#001456] sm:mb-4 sm:text-xl lg:text-4xl">
          {slide.title}
        </h2>
        <p className="mb-1.5 hidden text-[10px] text-[#454650] sm:mb-8 sm:block sm:text-sm lg:text-base">
          {slide.content}
        </p>
        <button
          onClick={onNext}
          className="flex items-center gap-1 rounded-full bg-[#001456] px-2 py-1 text-[7px] font-semibold text-white transition-colors hover:bg-[#001456]/90 sm:gap-2 sm:px-6 sm:py-2 sm:text-sm lg:text-base"
        >
          Selanjutnya
        </button>
      </div>
      <div className="flex shrink-0 px-10 items-center justify-center">
        <ShowcaseVisual visual={slide.visual} />
      </div>
    </div>
  );
}
