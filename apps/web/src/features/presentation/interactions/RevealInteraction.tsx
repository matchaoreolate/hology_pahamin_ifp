import { useState } from "react";
import type { RevealInteraction as RevealInteractionType } from "../types";

export function RevealInteraction({ interaction }: { interaction: RevealInteractionType }) {
  const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({});

  const toggleReveal = (id: string) => {
    setRevealedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="flex w-full max-w-3xl flex-col items-center gap-6">
      {interaction.instruction && (
        <p className="text-center text-xl font-semibold text-[#1a1c1d]">
          {interaction.instruction}
        </p>
      )}

      <div className="flex w-full flex-col gap-4">
        {interaction.items.map((item) => {
          const isRevealed = Boolean(revealedIds[item.id]);

          return (
            <div
              key={item.id}
              onClick={() => toggleReveal(item.id)}
              className={`flex flex-col rounded-2xl border-2 p-6 transition-all cursor-pointer select-none ${
                isRevealed
                  ? "border-amber-400 bg-amber-50/60 shadow-sm"
                  : "border-dashed border-[#747878] bg-white hover:border-black"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-slate-900">{item.label}</span>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 bg-white border border-slate-200 px-3 py-1 rounded-full">
                  {isRevealed ? "Tutup" : "Ketuk untuk Membuka"}
                </span>
              </div>

              {isRevealed && (
                <div className="mt-4 pt-4 border-t border-amber-200/80 animate-in fade-in slide-in-from-top-2">
                  <p className="text-base text-slate-800 leading-relaxed">
                    {item.revealed_content}
                  </p>
                  {item.asset && (
                    <img
                      src={item.asset.url}
                      alt={item.asset.alt || item.label}
                      className="mt-3 max-h-48 rounded-xl object-cover border border-slate-200"
                    />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
