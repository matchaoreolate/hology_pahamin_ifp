export interface Asset {
  id: string;
  type: "image";
  /** How this asset should be rendered by the FE.
   *  "asset"      → rendered inline as part of the slide layout.
   *  "fullscreen" → rendered as the primary visual occupying the full slide area.
   *  Defaults to "asset" when absent (backward-compatible). */
  display?: "asset" | "fullscreen";
  url: string;
  alt?: string;
}

export interface InteractionFeedback {
  correct: string;
  incorrect: string;
}

export interface ChoiceOption {
  id: string;
  label: string;
}

export interface ChoiceInteraction {
  type: "choice";
  instruction: string;
  options: ChoiceOption[];
  correct_answer: string;
  feedback: InteractionFeedback;
}

export interface MatchingItem {
  id: string;
  label: string;
}

export interface MatchingPair {
  id: string;
  left: MatchingItem;
  right: MatchingItem;
}

export interface MatchingInteraction {
  type: "matching";
  instruction: string;
  pairs: MatchingPair[];
  feedback: InteractionFeedback;
}

export interface SortingCategory {
  id: string;
  label: string;
}

export interface SortingItem {
  id: string;
  label: string;
  correct_category: string;
}

export interface SortingInteraction {
  type: "sorting";
  instruction: string;
  categories: SortingCategory[];
  items: SortingItem[];
  feedback: InteractionFeedback;
}

export interface RevealItem {
  id: string;
  label: string;
  revealed_content: string;
  asset?: Asset;
}

export interface RevealInteraction {
  type: "reveal";
  instruction?: string;
  items: RevealItem[];
}

export interface DragDropInteraction {
  type: "drag_drop";
  instruction: string;
  items: MatchingItem[];
  targets: MatchingItem[];
  answers: { item_id: string; target_id: string }[];
  feedback: InteractionFeedback;
}

export type Interaction =
  | ChoiceInteraction
  | MatchingInteraction
  | SortingInteraction
  | RevealInteraction
  | DragDropInteraction;

export type SlideType =
  | "opening"
  | "content"
  | "visual"
  | "interactive"
  | "closing";

export interface PresentationSlide {
  id: string;
  order: number;
  type: SlideType;
  title?: string;
  content?: string;
  assets?: Asset[];
  interaction?: Interaction | null;
  teacher_note?: string;
  speaker_script?: string;
}

export interface PresentationMeta {
  title: string;
  mata_pelajaran: string;
  topik: string;
  fase: string;
  total_slides: number;
}

export interface PresentationArtifact {
  version: "0.2";
  meta: PresentationMeta;
  slides: PresentationSlide[];
}
