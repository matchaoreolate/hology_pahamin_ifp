"""Central router — registers all v1 endpoints."""
from fastapi import APIRouter

from app.api.v1.endpoints import auth, contexts, outputs, projects, public

api_router = APIRouter()

api_router.include_router(auth.router)
api_router.include_router(contexts.router)
api_router.include_router(projects.router)
api_router.include_router(outputs.router)
api_router.include_router(public.router)

