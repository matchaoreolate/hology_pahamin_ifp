import { useState } from "react";

import type { MatchingInteraction as MatchingInteractionType } from "../types";
import { MatchingCanvas } from "./matching/MatchingCanvas";

export function MatchingInteraction({ interaction }: { interaction: MatchingInteractionType }) {
  // leftItemId -> rightItemId
  const [matches, setMatches] = useState<Record<string, string>>({});

  const totalPairs = interaction.pairs.length;
  const pairedCount = Object.keys(matches).length;
  const isCompleted = pairedCount === totalPairs;
  const isAllCorrect =
    isCompleted &&
    interaction.pairs.every((pair) => matches[pair.left.id] === pair.right.id);

  function handleConnect(leftId: string, rightId: string) {
    setMatches((prev) => {
      const next: Record<string, string> = {};
      // A left card and a right card may each hold at most one active
      // connection, so re-dragging either end replaces the old one.
      for (const [existingLeft, existingRight] of Object.entries(prev)) {
        if (existingLeft === leftId || existingRight === rightId) continue;
        next[existingLeft] = existingRight;
      }
      next[leftId] = rightId;
      return next;
    });
  }

  function handleRemoveConnection(leftId: string) {
    setMatches((prev) => {
      const next = { ...prev };
      delete next[leftId];
      return next;
    });
  }

  function handleReset() {
    setMatches({});
  }

  return (
    <div className="flex w-full max-w-6xl flex-col items-center gap-2">
      <p className="text-center text-xl font-semibold text-foreground">{interaction.instruction}</p>
      <p className="text-center font-mono text-xs text-muted-foreground">
        Sentuh titik di kartu kiri, lalu tarik garis ke pasangannya. Ketuk garis untuk menghapusnya.
      </p>

      <MatchingCanvas
        pairs={interaction.pairs}
        matches={matches}
        onConnect={handleConnect}
        onRemoveConnection={handleRemoveConnection}
      />

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
