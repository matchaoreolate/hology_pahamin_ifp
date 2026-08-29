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
    (item) => !allPlacedItems.some((placed) => placed.id === item.id)
  );

  const isAllPlaced = unplacedPool.length === 0;

  // Validation
  const isAllCorrect = isAllPlaced && Object.entries(assignments).every(([catId, items]) =>
    items.every((item) => item.correct_category === catId)
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
      <p className="text-center text-xl font-semibold text-[#1a1c1d]">
        {interaction.instruction}
      </p>

      {/* Unplaced Items Pool */}
      <div className="flex w-full flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-[#c4c7c7] bg-[#f9f9fa] p-4">
        <span className="text-xs font-bold uppercase tracking-wider text-[#747878]">
          Item Tersedia (Ketuk item lalu ketuk kotak kategori)
        </span>
        <div className="flex flex-wrap justify-center gap-2.5 min-h-[48px] items-center">
          {unplacedPool.length === 0 && (
            <span className="text-sm font-medium text-emerald-600">
              ✓ Semua item telah dikelompokkan
            </span>
          )}
          {unplacedPool.map((item) => {
            const isSelected = selectedItem?.id === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setSelectedItem(isSelected ? null : item)}
                className={`rounded-xl border-2 px-4 py-2.5 text-sm font-semibold transition-all shadow-sm ${
                  isSelected
                    ? "border-blue-600 bg-blue-600 text-white scale-105"
                    : "border-slate-300 bg-white text-slate-800 hover:border-black"
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
                  ? "border-blue-400 bg-blue-50/50 hover:border-blue-600 cursor-pointer"
                  : "border-[#c4c7c7] bg-white"
              }`}
            >
              <div className="border-b border-slate-200 pb-2 mb-3 text-center font-bold text-slate-800">
                {cat.label}
              </div>
              <div className="flex flex-wrap gap-2 flex-1 items-start">
                {itemsInCat.map((item) => (
                  <span
                    key={item.id}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-800"
                  >
                    {item.label}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFromCategory(cat.id, item.id);
                      }}
                      className="text-slate-400 hover:text-rose-600 font-bold ml-1"
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
              Reset Pengelompokan
            </button>
          )}
        </div>
      )}
    </div>
  );
}
