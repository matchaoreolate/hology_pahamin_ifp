"""
Auth endpoints: register, login, get profile.
Delegates business logic to AuthService.
"""
from fastapi import APIRouter, status

from app.api.deps import CurrentUser, DBSession
from app.schemas.auth import LoginRequest, RegisterRequest, TokenResponse, UserResponse
from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(payload: RegisterRequest, db: DBSession) -> UserResponse:
    """Daftar akun guru baru."""
    return await AuthService.register_user(db, payload)


@router.post("/login", response_model=TokenResponse)
async def login(payload: LoginRequest, db: DBSession) -> TokenResponse:
    """Login guru dan dapatkan JWT token."""
    return await AuthService.authenticate_user(db, payload)


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: CurrentUser) -> UserResponse:
    """Ambil profil guru yang sedang login."""
    return AuthService.get_current_user_profile(current_user)
