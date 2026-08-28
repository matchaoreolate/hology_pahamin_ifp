"""
Application configuration using Pydantic Settings.
All values are loaded from environment variables / .env file.
"""
from functools import lru_cache

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",  # Ignore POSTGRES_* vars used by Docker Compose
    )

    # --- App ---
    APP_NAME: str = "PahamIn API"
    APP_ENV: str = "development"
    DEBUG: bool = True
    API_V1_STR: str = "/api/v1"
    ALLOWED_ORIGINS: str = "http://localhost:3000"

    @field_validator("ALLOWED_ORIGINS", mode="before")
    @classmethod
    def parse_cors_origins(cls, v: object) -> str:
        # Accept either a plain comma-separated string or a JSON list string
        if isinstance(v, list):
            return ",".join(v)
        return str(v) if v else "http://localhost:3000"

    def get_cors_origins(self) -> list[str]:
        """Return ALLOWED_ORIGINS as a list for use in CORSMiddleware."""
        return [o.strip() for o in self.ALLOWED_ORIGINS.split(",") if o.strip()]

    # --- Security ---
    SECRET_KEY: str = "CHANGE_ME_IN_PRODUCTION"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # --- Database ---
    DATABASE_URL: str = "postgresql+asyncpg://pahamin:pahamin_secret@localhost:5432/pahamin_db"
    DB_ECHO: bool = False  # Set True to log all SQL queries in dev

    # --- Redis ---
    REDIS_URL: str = "redis://localhost:6379/0"

    # --- Celery ---
    CELERY_BROKER_URL: str = "redis://localhost:6379/0"
    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/1"

    # --- AI (Google Gemini) ---
    GEMINI_API_KEY: str = ""
    GEMINI_MODEL: str = "gemini-1.5-flash"
    GEMINI_MAX_OUTPUT_TOKENS: int = 8192
    GEMINI_TEMPERATURE: float = 0.7


@lru_cache
def get_settings() -> Settings:
    """Cached settings instance — call this anywhere in the app."""
    return Settings()


settings = get_settings()
