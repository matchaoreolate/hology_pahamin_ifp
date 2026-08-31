import { useState } from "react";
import type { SortingInteraction as SortingInteractionType, SortingItem } from "../types";

export function SortingInteraction({ interaction }: { interaction: SortingInteractionType }) {
  const [selectedItem, setSelectedItem] = useState<SortingItem | null>(null);
  // categoryAssignments: categoryId -> array of SortingItems
  const [assignments, setAssignments] = useState<Record<string, SortingItem[]>>(() => {
    const init: Record<string, SortingItem[]> = {};
    for (const cat of interaction.categories) {
      init[cat.id] = [];
    }
    return init;
  });

  const allPlacedItems = Object.values(assignments).flat();
  const unplacedPool = interaction.items.filter(
    (item) => !allPlacedItems.some((placed) => placed.id === item.id),
  );

  const isAllPlaced = unplacedPool.length === 0;

  // Validation
  const isAllCorrect =
    isAllPlaced &&
    Object.entries(assignments).every(([catId, items]) =>
      items.every((item) => item.correct_category === catId),
    );

  const handleAssignToCategory = (catId: string) => {
    if (!selectedItem) return;
    setAssignments((prev) => ({
      ...prev,
      [catId]: [...(prev[catId] || []), selectedItem],
    }));
    setSelectedItem(null);
  };

  const handleRemoveFromCategory = (catId: string, itemId: string) => {
    setAssignments((prev) => ({
      ...prev,
      [catId]: prev[catId].filter((i) => i.id !== itemId),
    }));
  };

  const handleReset = () => {
    const init: Record<string, SortingItem[]> = {};
    for (const cat of interaction.categories) {
      init[cat.id] = [];
    }
    setAssignments(init);
    setSelectedItem(null);
  };

  return (
    <div className="flex w-full max-w-4xl flex-col items-center gap-6">
      <p className="text-center text-xl font-semibold text-foreground">{interaction.instruction}</p>

      {/* Unplaced Items Pool */}
      <div className="flex w-full flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-border bg-muted/50 p-4">
        <span className="text-center font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Item Tersedia (Ketuk item lalu ketuk kotak kategori)
        </span>
        <div className="flex min-h-[48px] flex-wrap items-center justify-center gap-2.5">
          {unplacedPool.length === 0 && (
            <span className="text-sm font-medium text-success">✓ Semua item telah dikelompokkan</span>
          )}
          {unplacedPool.map((item) => {
            const isSelected = selectedItem?.id === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setSelectedItem(isSelected ? null : item)}
                className={`rounded-xl border-2 px-4 py-2.5 text-sm font-semibold shadow-sm transition-all ${
                  isSelected
                    ? "scale-105 border-accent bg-accent text-accent-foreground"
                    : "border-border bg-card text-foreground hover:border-primary"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Drop Targets */}
      <div
        className="grid w-full gap-4"
        style={{
          gridTemplateColumns: `repeat(${Math.min(interaction.categories.length, 3)}, minmax(0, 1fr))`,
        }}
      >
        {interaction.categories.map((cat) => {
          const itemsInCat = assignments[cat.id] || [];
          return (
            <div
              key={cat.id}
              onClick={() => {
                if (selectedItem) handleAssignToCategory(cat.id);
              }}
              className={`flex min-h-[160px] flex-col rounded-2xl border-2 p-4 transition-all ${
                selectedItem
                  ? "cursor-pointer border-accent/50 bg-accent/5 hover:border-accent"
                  : "border-border bg-card"
              }`}
            >
              <div className="mb-3 border-b border-border pb-2 text-center font-bold text-foreground">
                {cat.label}
              </div>
              <div className="flex flex-1 flex-wrap items-start gap-2">
                {itemsInCat.map((item) => (
                  <span
                    key={item.id}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary px-3 py-1.5 text-xs font-semibold text-foreground"
                  >
                    {item.label}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFromCategory(cat.id, item.id);
                      }}
                      className="ml-1 font-bold text-muted-foreground hover:text-destructive"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Feedback when all items placed */}
      {isAllPlaced && (
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
              Reset Pengelompokan
            </button>
          )}
        </div>
      )}
    </div>
  );
}
