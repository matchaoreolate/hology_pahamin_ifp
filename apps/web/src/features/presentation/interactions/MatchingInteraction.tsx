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
  const isAllCorrect = isCompleted && interaction.pairs.every(
    (p) => matches[p.left.id] === p.right.id
  );

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
      <p className="text-center text-xl font-semibold text-[#1a1c1d]">
        {interaction.instruction}
      </p>

      <div className="grid w-full grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="flex flex-col gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#747878] text-center">
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
                    ? "border-blue-600 bg-blue-50 shadow-sm"
                    : hasMatch
                    ? "border-slate-800 bg-slate-100 text-slate-900"
                    : "border-[#c4c7c7] bg-white hover:border-black"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{left.label}</span>
                  {hasMatch && <span className="text-xs font-mono bg-white px-2 py-0.5 rounded border border-slate-300">Terpasang</span>}
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#747878] text-center">
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
                    ? "border-blue-600 bg-blue-50"
                    : isMatchedByAny
                    ? "border-slate-700 bg-slate-50 text-slate-800"
                    : selectedLeft
                    ? "border-blue-400 bg-white hover:border-blue-700 cursor-pointer animate-pulse"
                    : "border-[#c4c7c7] bg-white hover:border-black"
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
          className={`w-full rounded-xl p-4 text-center text-base font-medium transition-all ${
            isAllCorrect
              ? "border border-emerald-300 bg-emerald-100 text-emerald-900"
              : "border border-rose-300 bg-rose-100 text-rose-900"
          }`}
        >
          <p>{isAllCorrect ? interaction.feedback.correct : interaction.feedback.incorrect}</p>
          {!isAllCorrect && (
            <button
              onClick={handleReset}
              className="mt-2 text-xs font-semibold text-rose-800 underline hover:text-rose-950"
            >
              Reset Pasangan
            </button>
          )}
        </div>
      )}
    </div>
  );
}
