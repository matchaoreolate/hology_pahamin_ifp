import type { Interaction } from "../types";
import { ChoiceInteraction } from "./ChoiceInteraction";
import { MatchingInteraction } from "./MatchingInteraction";
import { RevealInteraction } from "./RevealInteraction";
import { SortingInteraction } from "./SortingInteraction";

export function InteractionRenderer({ interaction }: { interaction: Interaction }) {
  switch (interaction.type) {
    case "choice":
      return <ChoiceInteraction interaction={interaction} />;
    case "matching":
      return <MatchingInteraction interaction={interaction} />;
    case "sorting":
      return <SortingInteraction interaction={interaction} />;
    case "reveal":
      return <RevealInteraction interaction={interaction} />;
    case "drag_drop":
      // Fallback for drag_drop if generated
      return (
        <div className="rounded-xl border border-slate-300 p-6 text-center text-sm text-slate-600">
          <p className="font-semibold">{interaction.instruction}</p>
          <p className="mt-2 text-xs text-slate-400">Mode Drag & Drop interaktif</p>
        </div>
      );
    default:
      return null;
  }
}
