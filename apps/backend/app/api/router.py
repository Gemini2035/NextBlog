from fastapi import APIRouter

from app.api.routes import blog
from app.api.routes import cron
from app.api.routes import health
from app.api.routes import projects
from app.api.routes import site_languages

api_router = APIRouter()
api_router.include_router(blog.router, prefix=blog.prefix, tags=blog.tags)
api_router.include_router(cron.router, prefix=cron.prefix, tags=cron.tags)
api_router.include_router(health.router, prefix="/health", tags=["health"])
api_router.include_router(projects.router, prefix=projects.prefix, tags=projects.tags)
api_router.include_router(
    site_languages.router,
    prefix=site_languages.prefix,
    tags=site_languages.tags,
)
