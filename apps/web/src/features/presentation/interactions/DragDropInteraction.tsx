import { useState } from "react";
import type { DragDropInteraction as DragDropInteractionType } from "../types";

export function DragDropInteraction({ interaction }: { interaction: DragDropInteractionType }) {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [placements, setPlacements] = useState<Record<string, string>>({});

  const isCompleted = Object.keys(placements).length === interaction.items.length;
  const isAllCorrect =
    isCompleted &&
    interaction.answers.every((answer) => placements[answer.item_id] === answer.target_id);

  const placedItemIds = new Set(Object.keys(placements));

  const handleTargetClick = (targetId: string) => {
    if (!selectedItem) return;
    setPlacements((prev) => {
      const next = { ...prev };
      for (const [itemId, tId] of Object.entries(next)) {
        if (tId === targetId) delete next[itemId];
      }
      next[selectedItem] = targetId;
      return next;
    });
    setSelectedItem(null);
  };

  const handleReset = () => {
    setPlacements({});
    setSelectedItem(null);
  };

  return (
    <div className="flex w-full max-w-3xl flex-col items-center gap-6">
      <p className="text-center text-xl font-semibold text-foreground">{interaction.instruction}</p>

      <div className="flex w-full flex-wrap justify-center gap-3 rounded-2xl border-2 border-dashed border-border bg-muted/50 p-4">
        {interaction.items
          .filter((item) => !placedItemIds.has(item.id))
          .map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedItem(selectedItem === item.id ? null : item.id)}
              className={`rounded-xl border-2 px-4 py-2.5 text-sm font-semibold shadow-sm transition-all ${
                selectedItem === item.id
                  ? "scale-105 border-accent bg-accent text-accent-foreground"
                  : "border-border bg-card text-foreground hover:border-primary"
              }`}
            >
              {item.label}
            </button>
          ))}
        {placedItemIds.size === interaction.items.length && (
          <span className="text-sm font-medium text-success">✓ Semua item telah ditempatkan</span>
        )}
      </div>

      <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-3">
        {interaction.targets.map((target) => {
          const placedItemId = Object.entries(placements).find(([, t]) => t === target.id)?.[0];
          const placedItem = interaction.items.find((i) => i.id === placedItemId);
          return (
            <div
              key={target.id}
              onClick={() => handleTargetClick(target.id)}
              className={`flex min-h-[96px] flex-col items-center justify-center gap-2 rounded-2xl border-2 p-4 text-center transition-all ${
                selectedItem
                  ? "cursor-pointer border-accent/50 bg-accent/5 hover:border-accent"
                  : "border-border bg-card"
              }`}
            >
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {target.label}
              </span>
              {placedItem && (
                <span className="rounded-lg border border-border bg-secondary px-3 py-1 text-sm font-semibold text-foreground">
                  {placedItem.label}
                </span>
              )}
            </div>
          );
        })}
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
              Reset Penempatan
            </button>
          )}
        </div>
      )}
    </div>
  );
}
