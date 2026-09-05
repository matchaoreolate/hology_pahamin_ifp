"""
Pydantic schemas for LKPD & E-book document artifacts (v0.1).
Lightweight structured output contract for student worksheets and reading materials.
"""
from typing import Annotated, Literal, Union
from pydantic import BaseModel, Field, field_validator


# ─────────────────────────────────────────────────────────────────────────────
# LKPD (Lembar Kerja Peserta Didik) Schema v0.1
# ─────────────────────────────────────────────────────────────────────────────

class LkpdMeta(BaseModel):
    title: str
    mata_pelajaran: str
    topik: str
    fase: str
    alokasi_waktu_menit: int | None = None

    @field_validator("alokasi_waktu_menit", mode="before")
    @classmethod
    def coerce_waktu(cls, v):
        if isinstance(v, str):
            # If AI returns "30 menit", extract the digits
            digits = "".join(filter(str.isdigit, v))
            return int(digits) if digits else None
        return v


AnswerSpaceType = Literal["lined", "boxed", "short"]


class LkpdQuestionActivity(BaseModel):
    type: Literal["question"] = "question"
    question: str
    answer_space: AnswerSpaceType | None = "lined"

    @field_validator("question", mode="before")
    @classmethod
    def coerce_question_str(cls, v):
        if isinstance(v, list):
            return "\n".join(str(item) for item in v)
        return v


class LkpdInstructionActivity(BaseModel):
    type: Literal["instruction"] = "instruction"
    content: str

    @field_validator("content", mode="before")
    @classmethod
    def coerce_content_str(cls, v):
        if isinstance(v, list):
            return "\n".join(str(item) for item in v)
        return v


LkpdActivity = Annotated[
    Union[LkpdQuestionActivity, LkpdInstructionActivity],
    Field(discriminator="type"),
]


class LkpdSection(BaseModel):
    title: str
    instruction: str | None = None
    activities: list[LkpdActivity] = Field(min_length=1)

    @field_validator("instruction", mode="before")
    @classmethod
    def coerce_instruction_str(cls, v):
        if isinstance(v, list):
            return "\n".join(str(item) for item in v)
        return v


class LkpdArtifact(BaseModel):
    version: Literal["0.1"] = "0.1"
    meta: LkpdMeta
    sections: list[LkpdSection] = Field(min_length=1)


# ─────────────────────────────────────────────────────────────────────────────
# E-book Schema v0.1
# ─────────────────────────────────────────────────────────────────────────────

class EbookMeta(BaseModel):
    title: str
    mata_pelajaran: str
    topik: str
    fase: str


class EbookSection(BaseModel):
    title: str
    content: str

    @field_validator("content", mode="before")
    @classmethod
    def coerce_content_str(cls, v):
        if isinstance(v, list):
            return "\n\n".join(str(item) for item in v)
        return v


class EbookArtifact(BaseModel):
    version: Literal["0.1"] = "0.1"
    meta: EbookMeta
    sections: list[EbookSection] = Field(min_length=1)
