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
  }
}
