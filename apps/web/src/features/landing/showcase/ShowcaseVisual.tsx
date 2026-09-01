import { useState } from "react";

import { cn } from "@/lib/utils";

import type {
  ChoiceInteraction,
  SortingInteraction,
  SortingItem,
} from "@/features/presentation/types";

import type { FractionVisual, ShowcaseVisual as ShowcaseVisualData } from "./types";

function FractionCircle({ numerator, denominator }: { numerator: number; denominator: number }) {
  const pct = (numerator / denominator) * 100;
  return (
    <div className="flex flex-col items-center gap-0.5 sm:gap-4">
      <div
        className="size-6 rounded-full border border-[#767681] sm:size-16 sm:border-2 lg:size-32"
        style={{ background: `conic-gradient(#fdd34d 0% ${pct}%, transparent ${pct}% 100%)` }}
      />
      <span className="text-[8px] font-bold text-[#001456] sm:text-base lg:text-2xl">
        {numerator}/{denominator}
      </span>
    </div>
  );
}

function FractionShowcase({ visual }: { visual: FractionVisual }) {
  return (
    <div className="flex shrink-0 items-center gap-1.5 sm:gap-8">
      <FractionCircle {...visual.left} />
      <span className="text-[8px] font-bold text-[#001456] sm:text-base lg:text-2xl">=</span>
      <FractionCircle {...visual.right} />
    </div>
  );
}

function SortingShowcase({ visual }: { visual: SortingInteraction }) {
  const [placed, setPlaced] = useState<Record<string, SortingItem>>({});

  const placedIds = new Set(Object.values(placed).map((item) => item.id));
  const remaining = visual.items.filter((item) => !placedIds.has(item.id));

  function handleTap(item: SortingItem) {
    const nextSlot = visual.categories.find((category) => !placed[category.id]);
    if (!nextSlot) return;
    setPlaced((prev) => ({ ...prev, [nextSlot.id]: item }));
  }

  return (
    <div className="flex max-w-[150px] flex-col gap-1 sm:max-w-[260px] sm:gap-3 lg:max-w-none">
      <div className="flex gap-1 sm:gap-2">
        {visual.categories.map((category, index) => {
          const item = placed[category.id];
          const correct = item && item.correct_category === category.id;
          return (
            <div
              key={category.id}
              className={cn(
                "flex size-5 items-center justify-center rounded-sm border text-[6px] font-bold sm:size-10 sm:rounded-md sm:text-[10px] lg:size-14 lg:text-xs",
                item
                  ? correct
                    ? "border-[#90d792] bg-[#90d792]/30 text-[#002107]"
                    : "border-[#fdd34d] bg-[#fdd34d]/40 text-[#725b00]"
                  : "border-dashed border-[#767681]/50 text-[#767681]",
              )}
            >
              {item ? item.label.slice(0, 3) : index + 1}
            </div>
          );
        })}
      </div>
      <div className="flex flex-wrap gap-1 sm:gap-1.5">
        {remaining.map((item) => (
          <button
            key={item.id}
            onClick={() => handleTap(item)}
            className="rounded-full border border-[#001456]/20 bg-white px-1.5 py-0.5 text-[6px] font-semibold text-[#001456] transition-colors hover:bg-[#001456]/5 sm:px-2.5 sm:py-1 sm:text-[10px] lg:text-xs"
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function ChoiceShowcase({ visual }: { visual: ChoiceInteraction }) {
  const [selected, setSelected] = useState<string | null>(null);
  const answered = selected !== null;

  return (
    <div className="flex max-w-[160px] flex-col gap-1 sm:max-w-[260px] sm:gap-2 lg:max-w-[320px]">
      <p className="line-clamp-3 text-[6px] text-[#454650] italic sm:text-[10px] lg:text-sm">
        {visual.instruction}
      </p>
      <div className="flex flex-col gap-1 sm:gap-1.5">
        {visual.options.map((option) => {
          const isSelected = selected === option.id;
          const isCorrect = option.id === visual.correct_answer;
          return (
            <button
              key={option.id}
              onClick={() => setSelected(option.id)}
              className={cn(
                "rounded-sm border px-1.5 py-1 text-left text-[6px] font-medium transition-colors sm:rounded-md sm:px-2.5 sm:py-1.5 sm:text-[10px] lg:text-sm",
                answered && isCorrect
                  ? "border-[#90d792] bg-[#90d792]/20 text-[#002107]"
                  : answered && isSelected
                    ? "border-[#fdd34d] bg-[#fdd34d]/20 text-[#725b00]"
                    : "border-[#c6c5d2] bg-white text-[#454650] hover:border-[#001456]/30",
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function ShowcaseVisual({ visual }: { visual: ShowcaseVisualData }) {
  switch (visual.type) {
    case "fraction":
      return <FractionShowcase visual={visual} />;
    case "sorting":
      return <SortingShowcase visual={visual} />;
    case "choice":
      return <ChoiceShowcase visual={visual} />;
  }
}
