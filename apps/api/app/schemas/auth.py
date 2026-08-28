"""Pydantic schemas for auth endpoints."""
import re

from pydantic import BaseModel, EmailStr, Field, field_validator


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    full_name: str = Field(min_length=2, max_length=255)
    nama_sekolah: str | None = Field(default=None, max_length=255)
    kota: str | None = Field(default=None, max_length=100)

    @field_validator("password")
    @classmethod
    def validate_password_strength(cls, v: str) -> str:
        errors = []
        if not re.search(r"[A-Z]", v):
            errors.append("minimal 1 huruf kapital (A-Z)")
        if not re.search(r"[a-z]", v):
            errors.append("minimal 1 huruf kecil (a-z)")
        if not re.search(r"\d", v):
            errors.append("minimal 1 angka (0-9)")
        if not re.search(r"[!@#$%^&*()_+\-=\[\]{};':\"\\|,.<>\/?`~]", v):
            errors.append("minimal 1 karakter spesial (!@#$%^&* dll)")
        if errors:
            raise ValueError("Password harus mengandung: " + ", ".join(errors))
        return v


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class UserResponse(BaseModel):
    id: str
    email: str
    full_name: str
    nama_sekolah: str | None
    kota: str | None
    is_active: bool

    model_config = {"from_attributes": True}

    @classmethod
    def from_orm_model(cls, user) -> "UserResponse":
        return cls(
            id=str(user.id),
            email=user.email,
            full_name=user.full_name,
            nama_sekolah=user.nama_sekolah,
            kota=user.kota,
            is_active=user.is_active,
        )
