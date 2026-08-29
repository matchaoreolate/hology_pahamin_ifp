import { useState } from "react";
import type { ChoiceInteraction as ChoiceInteractionType } from "../types";

export function ChoiceInteraction({ interaction }: { interaction: ChoiceInteractionType }) {
  const [selected, setSelected] = useState<string | null>(null);

  const isAnswered = selected !== null;
  const isCorrect = selected === interaction.correct_answer;

  return (
    <div className="flex w-full max-w-2xl flex-col items-center gap-6">
      <p className="text-center text-xl font-semibold text-[#1a1c1d]">
        {interaction.instruction}
      </p>

      <div className="flex w-full flex-col gap-3">
        {interaction.options.map((option) => {
          const isSelected = selected === option.id;
          const isCurrentCorrect = option.id === interaction.correct_answer;

          let btnClass = "border-2 border-[#c4c7c7] bg-white hover:border-black text-black";
          if (isAnswered) {
            if (isCurrentCorrect) {
              btnClass = "border-emerald-600 bg-emerald-50 text-emerald-950 font-medium";
            } else if (isSelected && !isCurrentCorrect) {
              btnClass = "border-rose-500 bg-rose-50 text-rose-950 line-through";
            } else {
              btnClass = "border-[#e0e2e2] bg-[#f9f9fa] text-neutral-400 opacity-60";
            }
          }

          return (
            <button
              key={option.id}
              disabled={isAnswered}
              onClick={() => setSelected(option.id)}
              className={`flex items-center justify-between rounded-xl px-6 py-4 text-left text-lg font-medium transition-all active:scale-[0.99] cursor-pointer disabled:cursor-default ${btnClass}`}
            >
              <span>{option.label}</span>
              {isAnswered && isCurrentCorrect && (
                <span className="text-emerald-700 font-bold text-sm bg-emerald-100 px-2.5 py-1 rounded-md">
                  ✓ Benar
                </span>
              )}
              {isAnswered && isSelected && !isCurrentCorrect && (
                <span className="text-rose-700 font-bold text-sm bg-rose-100 px-2.5 py-1 rounded-md">
                  ✗ Kurang Tepat
                </span>
              )}
            </button>
          );
        })}
      </div>

      {isAnswered && (
        <div
          className={`w-full rounded-xl p-4 text-center text-base font-medium transition-all ${
            isCorrect
              ? "border border-emerald-300 bg-emerald-100 text-emerald-900"
              : "border border-rose-300 bg-rose-100 text-rose-900"
          }`}
        >
          <p>{isCorrect ? interaction.feedback.correct : interaction.feedback.incorrect}</p>
          {!isCorrect && (
            <button
              onClick={() => setSelected(null)}
              className="mt-2 text-xs font-semibold text-rose-800 underline hover:text-rose-950"
            >
              Coba Pilih Lagi
            </button>
          )}
        </div>
      )}
    </div>
  );
}
