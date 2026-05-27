import logging
from collections.abc import Callable
from enum import Enum

from fastapi import APIRouter, Depends, Header, HTTPException
from pydantic import BaseModel, Field
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


class CronJobResult(BaseModel):
    name: str
    status: str
    synced: int = 0
    skipped: int = 0
    warnings: list[str] = Field(default_factory=list)


class DailyCronResponse(BaseModel):
    status: str
    jobs: list[CronJobResult]


def verify_cron_request(authorization: str | None = Header(default=None)) -> None:
    if not settings.admin_api_secret:
        raise HTTPException(status_code=500, detail="ADMIN_API_SECRET is not configured")

    if authorization != f"Bearer {settings.admin_api_secret}":
        raise HTTPException(status_code=401, detail="Unauthorized")


def run_sync_github_projects_job(db: Session) -> CronJobResult:
    try:
        github_config = get_github_site_config(db)
    except GitHubSiteConfigError as error:
        logger.warning("GitHub project sync skipped: %s", error)
        return CronJobResult(
            name="sync-github-projects",
            status="error",
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

    return CronJobResult(name="sync-github-projects", status="ok", **result)


def run_daily_job(
    db: Session,
    *,
    name: str,
    runner: Callable[[Session], CronJobResult],
) -> CronJobResult:
    try:
        return runner(db)
    except Exception as error:
        logger.exception("Daily cron job failed: %s", name)
        return CronJobResult(name=name, status="error", warnings=[str(error)])


@router.get("/daily")
def daily_cron(
    db: Session = Depends(get_db),
    _: None = Depends(verify_cron_request),
) -> DailyCronResponse:
    jobs = [
        run_daily_job(
            db,
            name="sync-github-projects",
            runner=run_sync_github_projects_job,
        ),
    ]
    status = "ok" if all(job.status == "ok" for job in jobs) else "partial_error"
    return DailyCronResponse(status=status, jobs=jobs)


@router.get("/sync-github-projects")
def sync_github_projects_cron(
    db: Session = Depends(get_db),
    _: None = Depends(verify_cron_request),
) -> SyncGithubProjectsCronResponse:
    job = run_sync_github_projects_job(db)
    return SyncGithubProjectsCronResponse(
        status=job.status,
        synced=job.synced,
        skipped=job.skipped,
        warnings=job.warnings,
    )
