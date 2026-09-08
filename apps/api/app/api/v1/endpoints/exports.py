"""
Export endpoints — Print-ready PDF and offline bundle downloads.
"""
from fastapi import APIRouter, HTTPException, Response, status

from app.api.deps import CurrentUser, DBSession
from app.services.outputs.output_viewer import OutputViewerService
from app.services.pdf.lkpd_pdf_service import LKPD_PDFService

router = APIRouter(prefix="/exports", tags=["Exports"])


@router.get("/projects/{project_id}/lkpd-pdf", summary="Download LKPD as print-ready A4 PDF")
async def download_lkpd_pdf(
    project_id: str,
    current_user: CurrentUser,
    db: DBSession,
) -> Response:
    """Mengunduh lembar kerja peserta didik dalam format PDF A4 siap cetak."""
    output = await OutputViewerService.get_by_type(db, project_id, current_user.id, "lkpd")
    content = output.get("content")
    if not content or not isinstance(content, dict):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Konten LKPD belum tersedia atau belum selesai digenerate",
        )

    try:
        pdf_bytes = LKPD_PDFService.generate_pdf(content)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Gagal mengonversi LKPD ke format PDF: {e}",
        )

    topik = (
        content.get("meta", {}).get("topik")
        or content.get("header", {}).get("topik")
        or "Materi"
    )
    clean_topik = "".join(c for c in str(topik) if c.isalnum() or c in (" ", "_", "-"))[:25].strip().replace(" ", "_")
    filename = f"LKPD-{clean_topik or 'Materi'}.pdf"
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )
