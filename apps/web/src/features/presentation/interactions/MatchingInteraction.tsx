import { useState } from "react";
import type { MatchingInteraction as MatchingInteractionType } from "../types";

export function MatchingInteraction({ interaction }: { interaction: MatchingInteractionType }) {
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matched, setMatched] = useState<Record<string, string>>({});

  const rightItems = interaction.pairs.map((pair) => ({ id: pair.id, label: pair.right }));

  return (
    <div className="flex w-full max-w-2xl flex-col gap-4">
      <p className="text-center text-lg font-medium text-[#1a1c1d]">{interaction.prompt}</p>
      <div className="grid grid-cols-2 gap-8">
        <div className="flex flex-col gap-3">
          {interaction.pairs.map((pair) => (
            <button
              key={pair.id}
              onClick={() => setSelectedLeft(pair.id)}
              className={`border-2 px-4 py-3 text-left text-sm ${
                matched[pair.id]
                  ? "border-black bg-[#eeeeef]"
                  : selectedLeft === pair.id
                    ? "border-black"
                    : "border-[#c4c7c7]"
              }`}
            >
              {pair.left}
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-3">
          {rightItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                if (!selectedLeft) return;
                setMatched((prev) => ({ ...prev, [selectedLeft]: item.id }));
                setSelectedLeft(null);
              }}
              className="border-2 border-[#c4c7c7] px-4 py-3 text-left text-sm hover:border-black"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
