from fastapi import APIRouter

from app.api.routes import cron
from app.api.routes import health
from app.api.routes import post
from app.api.routes import projects
from app.api.routes import locales
from app.api.routes import site

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
api_router.include_router(
    cron.daily_cron_routes.router,
    prefix=cron.daily_cron_routes.prefix,
    tags=cron.daily_cron_routes.tags,
)
api_router.include_router(
    cron.sync_github_projects_cron_routes.router,
    prefix=cron.sync_github_projects_cron_routes.prefix,
    tags=cron.sync_github_projects_cron_routes.tags,
)
api_router.include_router(health.router, prefix="/health", tags=["health"])
api_router.include_router(projects.router, prefix=projects.prefix, tags=projects.tags)
api_router.include_router(
    locales.router,
    prefix=locales.prefix,
    tags=locales.tags,
)
api_router.include_router(
    site.site_setting_routes.router,
    prefix=site.site_setting_routes.prefix,
    tags=site.site_setting_routes.tags,
)
api_router.include_router(
    site.site_navigation_routes.router,
    prefix=site.site_navigation_routes.prefix,
    tags=site.site_navigation_routes.tags,
)
api_router.include_router(
    site.site_config_category_routes.router,
    prefix=site.site_config_category_routes.prefix,
    tags=site.site_config_category_routes.tags,
)
