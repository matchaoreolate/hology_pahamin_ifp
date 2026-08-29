"""
Storage abstractions — base interface for all storage providers.
"""
from abc import ABC, abstractmethod


class BaseStorageProvider(ABC):
    @abstractmethod
    async def upload_file(
        self,
        file_bytes: bytes,
        filename: str,
        content_type: str = "image/png",
        bucket: str = "presentation-assets",
    ) -> str:
        """Upload file bytes, return public URL."""

    @abstractmethod
    async def delete_file(self, file_path: str, bucket: str = "presentation-assets") -> bool:
        """Delete a file from storage, return True if successful."""
