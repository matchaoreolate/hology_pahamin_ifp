import { useState } from "react";
import type { ChoiceInteraction as ChoiceInteractionType } from "../types";

export function ChoiceInteraction({ interaction }: { interaction: ChoiceInteractionType }) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="flex w-full max-w-2xl flex-col gap-4">
      <p className="text-center text-lg font-medium text-[#1a1c1d]">{interaction.prompt}</p>
      <div className="flex flex-col gap-3">
        {interaction.options.map((option) => {
          const isSelected = selected === option.id;
          const showResult = isSelected;
          return (
            <button
              key={option.id}
              onClick={() => setSelected(option.id)}
              className={`border-2 px-6 py-4 text-left text-base transition-colors ${
                showResult
                  ? option.isCorrect
                    ? "border-black bg-[#eeeeef]"
                    : "border-[#c4c7c7] bg-white"
                  : "border-[#c4c7c7] bg-white hover:border-black"
              }`}
            >
              {option.label}
              {showResult && (
                <span className="ml-2 font-mono text-xs text-[#5d5e66]">
                  {option.isCorrect ? "(Benar)" : "(Coba lagi)"}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
