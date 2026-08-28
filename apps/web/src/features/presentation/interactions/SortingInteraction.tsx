import { useState } from "react";
import type { SortingInteraction as SortingInteractionType } from "../types";

function shuffled<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

export function SortingInteraction({ interaction }: { interaction: SortingInteractionType }) {
  const [pool, setPool] = useState(() => shuffled(interaction.correctOrder));
  const [placed, setPlaced] = useState<(typeof interaction.correctOrder)[number][]>([]);

  return (
    <div className="flex w-full max-w-2xl flex-col gap-6">
      <p className="text-center text-lg font-medium text-[#1a1c1d]">{interaction.prompt}</p>

      <div className="flex min-h-16 flex-wrap items-center gap-3 border-2 border-dashed border-[#c4c7c7] bg-[#f9f9fa] p-4">
        {placed.length === 0 && (
          <span className="font-mono text-xs text-[#747878]">
            Klik elemen di bawah sesuai urutan
          </span>
        )}
        {placed.map((item, index) => (
          <span
            key={item.id}
            className="border-2 border-black bg-white px-4 py-2 text-sm font-medium"
          >
            {index + 1}. {item.label}
          </span>
        ))}
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        {pool.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setPlaced((prev) => [...prev, item]);
              setPool((prev) => prev.filter((i) => i.id !== item.id));
            }}
            className="border border-[#747878] bg-[#f9f9fa] px-4 py-2 text-sm hover:border-black"
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
