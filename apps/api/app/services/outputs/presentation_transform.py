"""
Presentation Transform Service (AI Transform).
Implements scoped slide transformations, slide additions, and structure updates
inspired by Metabot AI transform pattern (Slide 17, 25, 32).

Contract guarantees:
- Scoped slide edit runs fast (~1-2s) and preserves assets & audio on other slides.
- Returns full snapshot PresentationArtifact so frontend state remains consistent.
"""
import copy
import json
import uuid
from typing import Any, Literal

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.logging import get_logger
from app.repositories.output_repository import OutputRepository
from app.schemas.presentation_artifact import PresentationSlide
from app.services.ai.gemini_service import gemini_service
from app.services.projects.project_crud import ProjectCRUDService
from app.services.prompts.presentation_templates import INTERACTION_RULES

logger = get_logger(__name__)


class PresentationTransformService:
    @staticmethod
    async def transform_presentation(
        db: AsyncSession,
        project_id: str,
        user_id: uuid.UUID,
        prompt: str,
        slide_index: int = 0,
        mode: Literal["auto", "slide", "add_slide", "full"] = "auto",
    ) -> dict[str, Any]:
        """
        Executes an AI transform on a presentation output.
        Returns the updated full PresentationArtifact snapshot.
        """
        project = await ProjectCRUDService.find_or_404(db, project_id, user_id)
        output = await OutputRepository.get_done_output(db, project.id, "presentation")
        if not output or not output.content:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Presentasi belum tersedia untuk ditransformasikan",
            )

        artifact = copy.deepcopy(output.content)
        slides: list[dict[str, Any]] = artifact.get("slides", [])
        if not slides:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Presentasi tidak memiliki slide yang valid",
            )

        # Normalize slide_index within bounds
        safe_index = max(0, min(slide_index, len(slides) - 1))
        meta = artifact.get("meta", {})
        topik = meta.get("topik", "Materi Pembelajaran")
        mata_pelajaran = meta.get("mata_pelajaran", "Tematik")
        fase = meta.get("fase", "Fase A/B/C")

        # Intent detection if mode == "auto"
        lowered_prompt = prompt.lower().strip()
        add_keywords = ["tambah slide", "tambahkan slide", "buatkan slide baru", "sisipkan slide", "tambah kuis baru"]
        delete_keywords = ["hapus slide", "buang slide", "delete slide"]

        resolved_mode = mode
        if resolved_mode == "auto":
            if any(kw in lowered_prompt for kw in add_keywords):
                resolved_mode = "add_slide"
            elif any(kw in lowered_prompt for kw in delete_keywords):
                resolved_mode = "delete_slide"
            else:
                resolved_mode = "slide"

        active_slide_index = safe_index
        action = "modify"
        message = ""

        if resolved_mode == "delete_slide":
            if len(slides) <= 1:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Presentasi harus memiliki minimal 1 slide, tidak dapat menghapus slide terakhir.",
                )
            slides.pop(safe_index)
            # Re-index
            for idx, s in enumerate(slides):
                s["order"] = idx + 1
            artifact["meta"]["total_slides"] = len(slides)
            active_slide_index = max(0, min(safe_index, len(slides) - 1))
            action = "delete"
            message = f"Slide {safe_index + 1} berhasil dihapus."

        elif resolved_mode == "add_slide":
            new_slide = await PresentationTransformService._generate_new_slide(
                prompt=prompt,
                reference_slide=slides[safe_index],
                topik=topik,
                mata_pelajaran=mata_pelajaran,
                fase=fase,
                new_order=safe_index + 2,
            )
            slides.insert(safe_index + 1, new_slide)
            # Re-index
            for idx, s in enumerate(slides):
                s["order"] = idx + 1
            artifact["meta"]["total_slides"] = len(slides)
            active_slide_index = safe_index + 1
            action = "append"
            message = f"Slide baru berhasil ditambahkan pada urutan {active_slide_index + 1}."

        else:
            # Scoped slide modification (Slide 32 - backend authority, single target LLM call)
            target_slide = slides[safe_index]
            updated_slide = await PresentationTransformService._transform_single_slide(
                prompt=prompt,
                current_slide=target_slide,
                topik=topik,
                mata_pelajaran=mata_pelajaran,
                fase=fase,
            )
            slides[safe_index] = updated_slide
            active_slide_index = safe_index
            action = "modify"
            message = f"Slide {safe_index + 1} ('{updated_slide.get('title', '')}') berhasil diperbarui."

        # Save to database
        output.content = artifact
        await db.flush()

        logger.info(
            "Presentation transformed successfully",
            project_id=str(project.id),
            action=action,
            active_slide_index=active_slide_index,
        )

        return {
            "project_id": str(project.id),
            "action": action,
            "message": message,
            "content": output.content,
            "active_slide_index": active_slide_index,
        }

    @staticmethod
    async def _transform_single_slide(
        prompt: str,
        current_slide: dict[str, Any],
        topik: str,
        mata_pelajaran: str,
        fase: str,
    ) -> dict[str, Any]:
        """Call Gemini to modify a single slide according to the user's prompt."""
        preserved_assets = current_slide.get("assets", [])
        assets_json = json.dumps(preserved_assets, ensure_ascii=False)
        current_slide_json = json.dumps(current_slide, ensure_ascii=False, indent=2)

        gemini_prompt = f"""\
Kamu adalah AI asisten pengembang materi pembelajaran interaktif untuk guru SD di Indonesia.
Guru meminta perubahan pada SLIDE SPESIFIK dalam presentasi interaktif TV (IFP).

## KONTEKS PEMBELAJARAN
- Mata Pelajaran: {mata_pelajaran}
- Topik: {topik}
- Fase: {fase}

## SLIDE SAAT INI
{current_slide_json}

## PERMINTAAN GURU
"{prompt}"

## ATURAN TRANSFORMASI SLIDE:
1. Kembalikan HANYA 1 objek JSON slide (PresentationSlide) yang valid.
2. Pertahankan `id`: "{current_slide.get('id', 'slide-1')}" dan `order`: {current_slide.get('order', 1)}.
3. `type` HANYA boleh: "opening", "content", "visual", "interactive", "closing".
4. PENTING: Pertahankan aset gambar berikut di field `assets` kecuali guru meminta secara eksplisit untuk menghapus/mengganti aset:
{assets_json}
5. Field `content` harus bertipe STRING tunggal (maksimal 2-3 kalimat atau 3 poin ramah anak dipisah newline).
6. Jika slide diubah menjadi interaktif atau kuis, ikuti aturan interaktif berikut:
{INTERACTION_RULES}
7. Gunakan bahasa Indonesia yang komunikatif, menarik, dan sesuai fase perkembangan anak SD. Sertakan emoji yang relevan.

Format output WAJIB berupa JSON objek tunggal:
{{
  "id": "{current_slide.get('id', 'slide-1')}",
  "order": {current_slide.get('order', 1)},
  "type": "...",
  "title": "...",
  "content": "...",
  "assets": {assets_json},
  "interaction": null,
  "teacher_note": "...",
  "speaker_script": "..."
}}
"""
        raw_result = await gemini_service.generate(gemini_prompt, context_label="transform_single_slide")
        # Validate through Pydantic
        validated = PresentationSlide.model_validate(raw_result)
        dumped = validated.model_dump()

        # Ensure ID and order remain stable
        dumped["id"] = current_slide.get("id", dumped["id"])
        dumped["order"] = current_slide.get("order", dumped["order"])
        if not dumped.get("assets") and preserved_assets:
            dumped["assets"] = preserved_assets
        return dumped

    @staticmethod
    async def _generate_new_slide(
        prompt: str,
        reference_slide: dict[str, Any],
        topik: str,
        mata_pelajaran: str,
        fase: str,
        new_order: int,
    ) -> dict[str, Any]:
        """Call Gemini to generate a single new slide to insert."""
        new_id = f"slide-{uuid.uuid4().hex[:8]}"

        gemini_prompt = f"""\
Kamu adalah AI asisten pengembang materi pembelajaran interaktif untuk guru SD di Indonesia.
Guru ingin MENAMBAHKAN SATU SLIDE BARU ke dalam presentasi interaktif TV (IFP).

## KONTEKS PEMBELAJARAN
- Mata Pelajaran: {mata_pelajaran}
- Topik: {topik}
- Fase: {fase}

## SLIDE SEBELUMNYA (REFERENSI KONTEKS)
Judul: {reference_slide.get('title', '')}
Tipe: {reference_slide.get('type', '')}
Konten: {reference_slide.get('content', '')}

## PERMINTAAN GURU UNTUK SLIDE BARU
"{prompt}"

## ATURAN SLIDE BARU:
1. Kembalikan HANYA 1 objek JSON slide (PresentationSlide).
2. Set `id`: "{new_id}" dan `order`: {new_order}.
3. `type` HANYA boleh: "opening", "content", "visual", "interactive", "closing".
4. `assets`: Kosongkan ([]) jika slide visual/content baru.
5. Field `content` harus bertipe STRING tunggal.
6. Jika guru meminta kuis / game / interaksi, gunakan format `interaction`:
{INTERACTION_RULES}
7. Gunakan bahasa Indonesia yang ceria, komunikatif, dan ramah anak SD.

Format output WAJIB berupa JSON objek tunggal:
{{
  "id": "{new_id}",
  "order": {new_order},
  "type": "...",
  "title": "...",
  "content": "...",
  "assets": [],
  "interaction": null,
  "teacher_note": "...",
  "speaker_script": "..."
}}
"""
        raw_result = await gemini_service.generate(gemini_prompt, context_label="generate_new_slide")
        validated = PresentationSlide.model_validate(raw_result)
        dumped = validated.model_dump()
        dumped["id"] = new_id
        dumped["order"] = new_order
        return dumped
