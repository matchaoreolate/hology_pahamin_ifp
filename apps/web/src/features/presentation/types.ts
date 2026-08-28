export interface Asset {
  id: string;
  type: "image";
  url: string;
  alt?: string;
}

export interface ChoiceOption {
  id: string;
  label: string;
  isCorrect: boolean;
}

export interface ChoiceInteraction {
  type: "choice";
  id: string;
  prompt: string;
  options: ChoiceOption[];
}

export interface MatchingPair {
  id: string;
  left: string;
  right: string;
}

export interface MatchingInteraction {
  type: "matching";
  id: string;
  prompt: string;
  pairs: MatchingPair[];
}

export interface SortingItem {
  id: string;
  label: string;
}

export interface SortingInteraction {
  type: "sorting";
  id: string;
  prompt: string;
  correctOrder: SortingItem[];
}

export interface RevealInteraction {
  type: "reveal";
  id: string;
  prompt: string;
  hiddenContent: string;
}

export type Interaction =
  | ChoiceInteraction
  | MatchingInteraction
  | SortingInteraction
  | RevealInteraction;

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
