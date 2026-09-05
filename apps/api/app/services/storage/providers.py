"""
Concrete storage providers: Local filesystem and Supabase Storage.
"""
import os
import uuid

from app.core.logging import get_logger
from app.services.storage.base import BaseStorageProvider

logger = get_logger(__name__)


class LocalStorageProvider(BaseStorageProvider):
    """Saves files to a local server directory; for development/fallback use."""

    def __init__(
        self,
        base_dir: str = "static/uploads",
        base_url: str = "http://localhost:8000/static/uploads",
    ):
        self.base_dir = base_dir
        self.base_url = base_url
        os.makedirs(self.base_dir, exist_ok=True)

    async def upload_file(
        self,
        file_bytes: bytes,
        filename: str,
        content_type: str = "image/png",
        bucket: str = "presentation-assets",
    ) -> str:
        target_dir = os.path.join(self.base_dir, bucket)
        os.makedirs(target_dir, exist_ok=True)
        unique_name = f"{uuid.uuid4().hex}_{filename}"
        with open(os.path.join(target_dir, unique_name), "wb") as f:
            f.write(file_bytes)
        return f"{self.base_url}/{bucket}/{unique_name}"

    async def delete_file(self, file_path: str, bucket: str = "presentation-assets") -> bool:
        full_path = os.path.join(self.base_dir, bucket, os.path.basename(file_path))
        if os.path.exists(full_path):
            os.remove(full_path)
            return True
        return False


class SupabaseStorageProvider(BaseStorageProvider):
    """Uploads files to Supabase Storage via REST API."""

    def __init__(self, supabase_url: str | None = None, supabase_key: str | None = None):
        self.supabase_url = supabase_url or os.getenv("SUPABASE_URL", "")
        self.supabase_key = supabase_key or os.getenv("SUPABASE_KEY", "")

    async def upload_file(
        self,
        file_bytes: bytes,
        filename: str,
        content_type: str = "image/png",
        bucket: str = "presentation-assets",
    ) -> str:
        if not self.supabase_url or not self.supabase_key:
            logger.warning("Supabase credentials not configured, returning placeholder URL")
            return f"https://placehold.co/960x540?text={filename}"

        import base64
        import httpx

        unique_name = f"{uuid.uuid4().hex}_{filename}"
        upload_url = f"{self.supabase_url}/storage/v1/object/{bucket}/{unique_name}"
        headers = {
            "Authorization": f"Bearer {self.supabase_key}",
            "apikey": self.supabase_key,
            "Content-Type": content_type,
        }
        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                res = await client.post(upload_url, content=file_bytes, headers=headers)
                res.raise_for_status()
            return f"{self.supabase_url}/storage/v1/object/public/{bucket}/{unique_name}"
        except Exception as err:
            logger.warning(
                "Supabase upload failed, falling back to embedded data-uri image",
                error=str(err),
            )
            # Fallback: embed as valid Base64 data-uri so the image renders reliably in FE
            b64_str = base64.b64encode(file_bytes).decode("utf-8")
            return f"data:{content_type};base64,{b64_str}"

    async def delete_file(self, file_path: str, bucket: str = "presentation-assets") -> bool:
        # Supabase delete not required for current use-case — implemented when needed
        logger.warning("SupabaseStorageProvider.delete_file not yet implemented")
        return False
