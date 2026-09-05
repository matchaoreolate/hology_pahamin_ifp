"""
Differentiation endpoints — Teaching at the Right Level (TaRL) generator.
"""
from fastapi import APIRouter, HTTPException, status

from app.api.deps import CurrentUser, DBSession
from app.schemas.differentiation import DifferentiatedResponse
from app.services.differentiation.tarl_service import TaRLService

router = APIRouter(prefix="/projects", tags=["Differentiated Learning (TaRL)"])


@router.post(
    "/{project_id}/differentiate",
    response_model=DifferentiatedResponse,
    summary="Generate 3-tier differentiated learning plan (TaRL)",
)
async def generate_differentiated_content(
    project_id: str,
    current_user: CurrentUser,
    db: DBSession,
) -> DifferentiatedResponse:
    """
    Menghasilkan paket pembelajaran terdiferensiasi (Perintis, Cakap, Mahir)
    dari konteks project sesuai konsep Teaching at the Right Level (TaRL) Kurikulum Merdeka.
    """
    try:
        return await TaRLService.generate_differentiated_plan(db, project_id, current_user.id)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Gagal menghasilkan pembelajaran terdiferensiasi: {e}",
        )
