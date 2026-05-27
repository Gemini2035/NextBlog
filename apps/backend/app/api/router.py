from fastapi import APIRouter

from app.api.routes import cron
from app.api.routes import health
from app.api.routes import post
from app.api.routes import projects
from app.api.routes import locales

api_router = APIRouter()
api_router.include_router(
    post.post_routes.router,
    prefix=post.post_routes.prefix,
    tags=post.post_routes.tags,
)
api_router.include_router(
    post.post_tag_routes.router,
    prefix=post.post_tag_routes.prefix,
    tags=post.post_tag_routes.tags,
)
api_router.include_router(cron.router, prefix=cron.prefix, tags=cron.tags)
api_router.include_router(health.router, prefix="/health", tags=["health"])
api_router.include_router(projects.router, prefix=projects.prefix, tags=projects.tags)
api_router.include_router(
    locales.router,
    prefix=locales.prefix,
    tags=locales.tags,
)
