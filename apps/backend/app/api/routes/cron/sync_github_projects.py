from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database.session import get_db

from ._base import (
    prefix,
    run_sync_github_projects_job,
    tags,
    verify_cron_request,
)

router = APIRouter()


class SyncGithubProjectsCronResponse(BaseModel):
    status: str
    synced: int
    skipped: int
    warnings: list[str]


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


__all__ = ["router", "prefix", "tags"]
