import { useState } from "react";
import type { RevealInteraction as RevealInteractionType } from "../types";

export function RevealInteraction({ interaction }: { interaction: RevealInteractionType }) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="flex w-full max-w-2xl flex-col items-center gap-4">
      <p className="text-center text-lg font-medium text-[#1a1c1d]">{interaction.prompt}</p>
      {revealed ? (
        <div className="border-2 border-black bg-[#eeeeef] px-6 py-5 text-center text-base">
          {interaction.hiddenContent}
        </div>
      ) : (
        <button
          onClick={() => setRevealed(true)}
          className="border-2 border-dashed border-[#747878] bg-white px-8 py-5 font-mono text-xs uppercase tracking-wide text-[#444748] hover:border-black"
        >
          Klik untuk mengungkap
        </button>
      )}
    </div>
  );
}
