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
      <div className="flex items-center gap-8 rounded-full border border-border bg-card px-4 py-2 shadow-lg">
        <button
          onClick={onPrev}
          disabled={current === 0}
          className="flex size-12 items-center justify-center rounded-full border-2 border-primary bg-card text-foreground transition-colors hover:bg-secondary disabled:opacity-30"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="flex items-center gap-2">
          {Array.from({ length: total }).map((_, index) => (
            <span
              key={index}
              className={`rounded-full transition-all ${
                index === current ? "size-3 bg-primary" : "size-2 bg-border"
              }`}
            />
          ))}
        </div>
        <button
          onClick={onNext}
          disabled={current === total - 1}
          className="flex size-12 items-center justify-center rounded-full border-2 border-primary bg-primary text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-30"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2">
      <button
        onClick={onPrev}
        disabled={current === 0}
        className="text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30"
      >
        <ChevronLeft size={14} />
      </button>
      <span className="font-mono text-xs text-muted-foreground">
        Slide {current + 1} dari {total}
      </span>
      <button
        onClick={onNext}
        disabled={current === total - 1}
        className="text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30"
      >
        <ChevronRight size={14} />
      </button>
    </div>
  );
}
