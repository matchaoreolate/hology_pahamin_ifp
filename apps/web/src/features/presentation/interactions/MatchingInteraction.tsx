import { useState } from "react";
import type { MatchingInteraction as MatchingInteractionType } from "../types";

export function MatchingInteraction({ interaction }: { interaction: MatchingInteractionType }) {
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  // matched: mapping leftId -> rightId
  const [matches, setMatches] = useState<Record<string, string>>({});

  const leftItems = interaction.pairs.map((p) => p.left);
  // Right items shuffled or displayed
  const rightItems = interaction.pairs.map((p) => p.right);

  const totalPairs = interaction.pairs.length;
  const pairedCount = Object.keys(matches).length;
  const isCompleted = pairedCount === totalPairs;

  // Validate correctness: each pair id has pair.left.id matching pair.right.id
  const isAllCorrect =
    isCompleted && interaction.pairs.every((p) => matches[p.left.id] === p.right.id);

  const handleRightClick = (rightId: string) => {
    if (!selectedLeft) return;
    setMatches((prev) => {
      const next = { ...prev };
      // Remove any existing match for this rightId
      for (const [lId, rId] of Object.entries(next)) {
        if (rId === rightId) delete next[lId];
      }
      next[selectedLeft] = rightId;
      return next;
    });
    setSelectedLeft(null);
  };

  const handleReset = () => {
    setMatches({});
    setSelectedLeft(null);
  };

  return (
    <div className="flex w-full max-w-3xl flex-col items-center gap-6">
      <p className="text-center text-xl font-semibold text-foreground">{interaction.instruction}</p>

      <div className="grid w-full grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="flex flex-col gap-3">
          <span className="text-center font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Pilih Konsep (Kiri)
          </span>
          {leftItems.map((left) => {
            const isSelected = selectedLeft === left.id;
            const hasMatch = Boolean(matches[left.id]);
            return (
              <button
                key={left.id}
                onClick={() => setSelectedLeft(isSelected ? null : left.id)}
                className={`rounded-xl border-2 px-5 py-4 text-left text-base font-medium transition-all ${
                  isSelected
                    ? "border-accent bg-accent/10 shadow-sm"
                    : hasMatch
                      ? "border-foreground bg-secondary text-foreground"
                      : "border-border bg-card hover:border-primary"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{left.label}</span>
                  {hasMatch && (
                    <span className="rounded border border-border bg-card px-2 py-0.5 font-mono text-xs">
                      Terpasang
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-3">
          <span className="text-center font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Pasangkan (Kanan)
          </span>
          {rightItems.map((right) => {
            const isPairedWithSelected = selectedLeft && matches[selectedLeft] === right.id;
            const isMatchedByAny = Object.values(matches).includes(right.id);

            return (
              <button
                key={right.id}
                onClick={() => handleRightClick(right.id)}
                className={`rounded-xl border-2 px-5 py-4 text-left text-base font-medium transition-all ${
                  isPairedWithSelected
                    ? "border-accent bg-accent/10"
                    : isMatchedByAny
                      ? "border-foreground bg-secondary text-foreground"
                      : selectedLeft
                        ? "cursor-pointer animate-pulse border-accent/50 bg-card hover:border-accent"
                        : "border-border bg-card hover:border-primary"
                }`}
              >
                <span>{right.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {isCompleted && (
        <div
          className={`w-full rounded-xl border p-4 text-center text-base font-medium transition-all ${
            isAllCorrect
              ? "border-success/30 bg-success/10 text-success"
              : "border-destructive/30 bg-destructive/10 text-destructive"
          }`}
        >
          <p>{isAllCorrect ? interaction.feedback.correct : interaction.feedback.incorrect}</p>
          {!isAllCorrect && (
            <button
              onClick={handleReset}
              className="mt-2 text-xs font-semibold underline hover:opacity-80"
            >
              Reset Pasangan
            </button>
          )}
        </div>
      )}
    </div>
  );
}
