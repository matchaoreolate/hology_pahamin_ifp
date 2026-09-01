import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

interface ShowcaseNavigationProps {
  current: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
}

export function ShowcaseNavigation({ current, total, onPrev, onNext }: ShowcaseNavigationProps) {
  return (
    <div className="mt-1 flex items-center justify-between sm:mt-4">
      <button
        onClick={onPrev}
        aria-label="Contoh sebelumnya"
        className="flex size-4 items-center justify-center rounded-full border border-[#001456]/20 text-[#001456] transition-colors hover:bg-[#001456]/5 sm:size-8"
      >
        <ChevronLeft className="size-2 sm:size-4" />
      </button>

      <div className="flex items-center gap-1">
        {Array.from({ length: total }).map((_, index) => (
          <span
            key={index}
            className={cn(
              "rounded-full transition-all",
              index === current ? "size-1.5 bg-[#001456] sm:size-2" : "size-1 bg-[#c6c5d2] sm:size-1.5",
            )}
          />
        ))}
      </div>

      <button
        onClick={onNext}
        aria-label="Contoh berikutnya"
        className="flex size-4 items-center justify-center rounded-full border border-[#001456]/20 text-[#001456] transition-colors hover:bg-[#001456]/5 sm:size-8"
      >
        <ChevronRight className="size-2 sm:size-4" />
      </button>
    </div>
  );
}
