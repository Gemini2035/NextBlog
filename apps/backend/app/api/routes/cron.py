import logging
from enum import Enum

from fastapi import APIRouter, Depends, Header, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.core.config import settings
from app.database.session import get_db
from app.services.projects.sync_github_projects import sync_github_projects
from app.services.site_settings import (
    GitHubSiteConfigError,
    get_github_site_config,
)

prefix = "/cron"
tags: list[str | Enum] = ["cron"]
router = APIRouter()
logger = logging.getLogger(__name__)


class SyncGithubProjectsCronResponse(BaseModel):
    status: str
    synced: int
    skipped: int
    warnings: list[str]


def verify_cron_request(authorization: str | None = Header(default=None)) -> None:
    if not settings.cron_secret:
        raise HTTPException(status_code=500, detail="CRON_SECRET is not configured")

    if authorization != f"Bearer {settings.cron_secret}":
        raise HTTPException(status_code=401, detail="Unauthorized")


@router.get("/sync-github-projects")
def sync_github_projects_cron(
    db: Session = Depends(get_db),
    _: None = Depends(verify_cron_request),
) -> SyncGithubProjectsCronResponse:
    try:
        github_config = get_github_site_config(db)
    except GitHubSiteConfigError as error:
        logger.warning("GitHub project sync skipped: %s", error)
        return SyncGithubProjectsCronResponse(
            status="error",
            synced=0,
            skipped=0,
            warnings=[str(error)],
        )

    result = sync_github_projects(
        db,
        username=github_config["username"],
        token=github_config["token"],
        fetch_options=github_config["fetch_options"],
        featured_repos=github_config["featured_repos"],
        exclude_repos=github_config["exclude_repos"],
    )

    return SyncGithubProjectsCronResponse(status="ok", **result)
