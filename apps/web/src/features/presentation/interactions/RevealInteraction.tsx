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
        <p className="text-center text-xl font-semibold text-foreground">{interaction.instruction}</p>
      )}

      <div className="flex w-full flex-col gap-4">
        {interaction.items.map((item) => {
          const isRevealed = Boolean(revealedIds[item.id]);

          return (
            <div
              key={item.id}
              onClick={() => toggleReveal(item.id)}
              className={`flex cursor-pointer select-none flex-col rounded-2xl border-2 p-6 transition-all ${
                isRevealed
                  ? "border-accent bg-accent/5 shadow-sm"
                  : "border-dashed border-muted-foreground/50 bg-card hover:border-primary"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-foreground">{item.label}</span>
                <span className="rounded-full border border-border bg-card px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {isRevealed ? "Tutup" : "Ketuk untuk Membuka"}
                </span>
              </div>

              {isRevealed && (
                <div className="mt-4 border-t border-border pt-4">
                  <p className="text-base leading-relaxed text-foreground">
                    {item.revealed_content}
                  </p>
                  {item.asset && (
                    <img
                      src={item.asset.url}
                      alt={item.asset.alt || item.label}
                      className="mt-3 max-h-48 rounded-xl border border-border object-cover"
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
