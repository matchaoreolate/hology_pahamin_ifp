"""Central router — registers all v1 endpoints."""
from fastapi import APIRouter

from app.api.v1.endpoints import (
    auth,
    contexts,
    differentiations,
    exports,
    narrations,
    outputs,
    projects,
    public,
)

api_router = APIRouter()

api_router.include_router(auth.router)
api_router.include_router(contexts.router)
api_router.include_router(projects.router)
api_router.include_router(outputs.router)
api_router.include_router(public.router)
api_router.include_router(narrations.router)
api_router.include_router(exports.router)
api_router.include_router(differentiations.router)

