"""
Celery application instance.
Workers are started separately via: celery -A app.tasks.celery_app worker
"""
from celery import Celery

from app.core.config import settings

celery_app = Celery(
    "pahamin",
    broker=settings.CELERY_BROKER_URL,
    backend=settings.CELERY_RESULT_BACKEND,
    include=["app.tasks.generate"],
)

celery_app.conf.update(
    task_serializer="json",
    result_serializer="json",
    accept_content=["json"],
    timezone="Asia/Jakarta",
    enable_utc=True,
    task_track_started=True,
    task_acks_late=True,  # Only ack after task completes (safer)
    worker_prefetch_multiplier=1,  # Process one task at a time per worker
    task_routes={
        "app.tasks.generate.*": {"queue": "generate"},
    },
)
