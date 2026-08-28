import { ChevronLeft, ChevronRight } from "lucide-react";

interface PresentationNavigationProps {
  current: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  variant?: "compact" | "floating";
}

export function PresentationNavigation({
  current,
  total,
  onPrev,
  onNext,
  variant = "compact",
}: PresentationNavigationProps) {
  if (variant === "floating") {
    return (
      <div className="flex items-center gap-8 rounded-full border border-[#c4c7c7] bg-[#eeeeef] px-6 py-3 shadow-lg">
        <button
          onClick={onPrev}
          disabled={current === 0}
          className="flex size-14 items-center justify-center rounded-full border-2 border-black bg-white disabled:opacity-30"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="flex items-center gap-2">
          {Array.from({ length: total }).map((_, index) => (
            <span
              key={index}
              className={`rounded-full transition-all ${
                index === current ? "size-3 bg-black" : "size-2 bg-[#c4c7c7]"
              }`}
            />
          ))}
        </div>
        <button
          onClick={onNext}
          disabled={current === total - 1}
          className="flex size-14 items-center justify-center rounded-full border-2 border-black bg-black text-white disabled:opacity-30"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 border border-[#c4c7c7] bg-white px-[17px] py-[9px]">
      <button onClick={onPrev} disabled={current === 0} className="disabled:opacity-30">
        <ChevronLeft size={14} />
      </button>
      <span className="font-mono text-xs text-[#444748]">
        Scene {current + 1} dari {total}
      </span>
      <button onClick={onNext} disabled={current === total - 1} className="disabled:opacity-30">
        <ChevronRight size={14} />
      </button>
    </div>
  );
}
