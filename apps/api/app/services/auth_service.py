"""
Authentication Service.
Handles user registration, authentication, token issuance, and user retrieval.
"""
from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import (
    create_access_token,
    create_refresh_token,
    hash_password,
    verify_password,
)
from app.models.user import User
from app.schemas.auth import LoginRequest, RegisterRequest, TokenResponse, UserResponse


class AuthService:
    @staticmethod
    async def register_user(db: AsyncSession, payload: RegisterRequest) -> UserResponse:
        """Register a new teacher account."""
        # Check if email is already taken
        existing_user = await db.execute(
            select(User).where(User.email == payload.email)
        )
        if existing_user.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Email sudah terdaftar. Silakan login atau gunakan email lain.",
            )

        user = User(
            email=payload.email,
            hashed_password=hash_password(payload.password),
            full_name=payload.full_name,
            nama_sekolah=payload.nama_sekolah,
            kota=payload.kota,
        )
        db.add(user)
        await db.flush()
        await db.refresh(user)
        return UserResponse.from_orm_model(user)

    @staticmethod
    async def authenticate_user(db: AsyncSession, payload: LoginRequest) -> TokenResponse:
        """Authenticate user credentials and issue JWT tokens."""
        result = await db.execute(select(User).where(User.email == payload.email))
        user = result.scalar_one_or_none()

        if not user or not verify_password(payload.password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Email atau password salah",
            )

        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Akun tidak aktif",
            )

        return TokenResponse(
            access_token=create_access_token(str(user.id)),
            refresh_token=create_refresh_token(str(user.id)),
        )

    @staticmethod
    def get_current_user_profile(user: User) -> UserResponse:
        """Serialize current active user profile."""
        return UserResponse.from_orm_model(user)
