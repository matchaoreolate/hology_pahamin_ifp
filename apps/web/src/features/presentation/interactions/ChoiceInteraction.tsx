import { useState } from "react";
import { soundFx } from "@/lib/soundFx";
import type { ChoiceInteraction as ChoiceInteractionType } from "../types";

export function ChoiceInteraction({ interaction }: { interaction: ChoiceInteractionType }) {
  const [selected, setSelected] = useState<string | null>(null);

  const isAnswered = selected !== null;
  const isCorrect = selected === interaction.correct_answer;

  const handleSelect = (optionId: string) => {
    setSelected(optionId);
    if (optionId === interaction.correct_answer) {
      soundFx.playCorrect();
    } else {
      soundFx.playIncorrect();
    }
  };

  return (
    <div className="flex w-full max-w-2xl flex-col items-center gap-6">
      <p className="text-center text-xl font-semibold text-foreground">{interaction.instruction}</p>

      <div className="flex w-full flex-col gap-3">
        {interaction.options.map((option) => {
          const isSelected = selected === option.id;
          const isCurrentCorrect = option.id === interaction.correct_answer;

          let btnClass = "border-2 border-border bg-card hover:border-primary text-foreground";
          if (isAnswered) {
            if (isCurrentCorrect) {
              btnClass = "border-2 border-success bg-success/10 text-success font-medium";
            } else if (isSelected && !isCurrentCorrect) {
              btnClass = "border-2 border-destructive bg-destructive/10 text-destructive line-through";
            } else {
              btnClass = "border-2 border-border bg-muted text-muted-foreground opacity-60";
            }
          }

          return (
            <button
              key={option.id}
              disabled={isAnswered}
              onClick={() => handleSelect(option.id)}
              className={`flex items-center justify-between rounded-xl px-6 py-4 text-left text-lg font-medium transition-all active:scale-[0.99] cursor-pointer disabled:cursor-default ${btnClass}`}
            >
              <span>{option.label}</span>
              {isAnswered && isCurrentCorrect && (
                <span className="rounded-md bg-success/15 px-2.5 py-1 text-sm font-bold text-success">
                  ✓ Benar
                </span>
              )}
              {isAnswered && isSelected && !isCurrentCorrect && (
                <span className="rounded-md bg-destructive/15 px-2.5 py-1 text-sm font-bold text-destructive">
                  ✗ Kurang Tepat
                </span>
              )}
            </button>
          );
        })}
      </div>

      {isAnswered && (
        <div
          className={`w-full rounded-xl border p-4 text-center text-base font-medium transition-all ${
            isCorrect
              ? "border-success/30 bg-success/10 text-success"
              : "border-destructive/30 bg-destructive/10 text-destructive"
          }`}
        >
          <p>{isCorrect ? interaction.feedback.correct : interaction.feedback.incorrect}</p>
          {!isCorrect && (
            <button
              onClick={() => setSelected(null)}
              className="mt-2 text-xs font-semibold underline hover:opacity-80"
            >
              Coba Pilih Lagi
            </button>
          )}
        </div>
      )}
    </div>
  );
}
