import type { ChoiceInteraction, SortingInteraction } from "@/features/presentation/types";

export interface FractionVisual {
  type: "fraction";
  left: { numerator: number; denominator: number };
  right: { numerator: number; denominator: number };
}

export type ShowcaseVisual = FractionVisual | SortingInteraction | ChoiceInteraction;

export interface ShowcaseSlideData {
  id: string;
  subject: string;
  title: string;
  content: string;
  visual: ShowcaseVisual;
}
