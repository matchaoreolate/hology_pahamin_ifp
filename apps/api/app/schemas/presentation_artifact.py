"""
Pydantic schemas for PresentationArtifact (v0.2).
Provides strict validation for AI generation output and deterministic FE rendering.

Contract guarantees:
- Asset.display distinguishes inline ("asset") from fullscreen ("fullscreen") usage.
  FE uses this to decide render mode; `type` always describes *what* the asset is.
- Interaction primitives: choice | matching | sorting | reveal | drag_drop
"""
from typing import Annotated, Literal, Union
from pydantic import BaseModel, Field


# ─────────────────────────────────────────────
# Asset Schema
# ─────────────────────────────────────────────

class Asset(BaseModel):
    id: str
    type: Literal["image"] = "image"
    # "asset"     → image rendered as part of slide layout (inline)
    # "fullscreen" → image intended to be rendered as the primary visual (full slide)
    display: Literal["asset", "fullscreen"] = "asset"
    url: str
    alt: str | None = None


# ─────────────────────────────────────────────
# Common Feedback Schema
# ─────────────────────────────────────────────

class InteractionFeedback(BaseModel):
    correct: str
    incorrect: str


# ─────────────────────────────────────────────
# Interaction Primitives (Discriminated Union)
# ─────────────────────────────────────────────

class ChoiceOption(BaseModel):
    id: str
    label: str


class ChoiceInteraction(BaseModel):
    type: Literal["choice"] = "choice"
    instruction: str
    options: list[ChoiceOption] = Field(min_length=2)
    correct_answer: str
    feedback: InteractionFeedback


class MatchingItem(BaseModel):
    id: str
    label: str


class MatchingPair(BaseModel):
    id: str
    left: MatchingItem
    right: MatchingItem


class MatchingInteraction(BaseModel):
    type: Literal["matching"] = "matching"
    instruction: str
    pairs: list[MatchingPair] = Field(min_length=2)
    feedback: InteractionFeedback


class SortingCategory(BaseModel):
    id: str
    label: str


class SortingItem(BaseModel):
    id: str
    label: str
    correct_category: str


class SortingInteraction(BaseModel):
    type: Literal["sorting"] = "sorting"
    instruction: str
    categories: list[SortingCategory] = Field(min_length=2)
    items: list[SortingItem] = Field(min_length=2)
    feedback: InteractionFeedback


class RevealItem(BaseModel):
    id: str
    label: str
    revealed_content: str
    asset: Asset | None = None


class RevealInteraction(BaseModel):
    type: Literal["reveal"] = "reveal"
    instruction: str | None = None
    items: list[RevealItem] = Field(min_length=1)


class DragDropAnswer(BaseModel):
    item_id: str
    target_id: str


class DragDropInteraction(BaseModel):
    type: Literal["drag_drop"] = "drag_drop"
    instruction: str
    items: list[MatchingItem] = Field(min_length=1)
    targets: list[MatchingItem] = Field(min_length=1)
    answers: list[DragDropAnswer] = Field(min_length=1)
    feedback: InteractionFeedback


InteractionType = Annotated[
    Union[
        ChoiceInteraction,
        MatchingInteraction,
        SortingInteraction,
        RevealInteraction,
        DragDropInteraction,
    ],
    Field(discriminator="type"),
]


# ─────────────────────────────────────────────
# Slide & Presentation Schemas
# ─────────────────────────────────────────────

SlideTypeEnum = Literal["opening", "content", "visual", "interactive", "closing"]


class PresentationSlide(BaseModel):
    id: str
    order: int
    type: SlideTypeEnum
    title: str | None = None
    content: str | None = None
    assets: list[Asset] = Field(default_factory=list)
    interaction: InteractionType | None = None
    teacher_note: str | None = None
    speaker_script: str | None = None


class PresentationMeta(BaseModel):
    title: str
    mata_pelajaran: str
    topik: str
    fase: str
    total_slides: int


class PresentationArtifact(BaseModel):
    version: Literal["0.2"] = "0.2"
    meta: PresentationMeta
    slides: list[PresentationSlide] = Field(min_length=1)
