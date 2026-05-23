from enum import Enum

from fastapi import APIRouter, Depends, Header, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.core.config import settings
from app.database.session import get_db
from app.services.projects.sync_github_projects import sync_github_projects

prefix = "/cron"
tags: list[str | Enum] = ["cron"]
router = APIRouter()


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
    result = sync_github_projects(
        db,
        username=settings.github_username,
        token=settings.github_token,
    )

    return SyncGithubProjectsCronResponse(status="ok", **result)
