from fastapi import APIRouter

from app.api.routes import cron
from app.api.routes import health
from app.api.routes import projects

api_router = APIRouter()
api_router.include_router(cron.router, prefix=cron.prefix, tags=cron.tags)
api_router.include_router(health.router, prefix="/health", tags=["health"])
api_router.include_router(projects.router, prefix=projects.prefix, tags=projects.tags)
