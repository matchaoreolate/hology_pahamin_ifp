"""
StorageService — Facade for active storage provider.
Decouples consumers from concrete provider (Supabase or Local).
"""
import os
import uuid

from app.services.storage.base import BaseStorageProvider
from app.services.storage.providers import LocalStorageProvider, SupabaseStorageProvider


class StorageService:
    _provider: BaseStorageProvider | None = None

    @classmethod
    def get_provider(cls) -> BaseStorageProvider:
        if cls._provider is None:
            cls._provider = (
                SupabaseStorageProvider() if os.getenv("SUPABASE_URL") else LocalStorageProvider()
            )
        return cls._provider

    @classmethod
    async def upload_image(
        cls,
        image_bytes: bytes,
        filename: str,
        alt: str | None = None,
        display: str = "asset",
        bucket: str = "presentation-assets",
        content_type: str = "image/webp",
    ) -> dict[str, str]:
        """Upload image and return an Asset dict {id, type, display, url, alt}."""
        url = await cls.get_provider().upload_file(image_bytes, filename, content_type=content_type, bucket=bucket)
        return {
            "id": str(uuid.uuid4()),
            "type": "image",
            "display": display,
            "url": url,
            "alt": alt or filename,
        }
