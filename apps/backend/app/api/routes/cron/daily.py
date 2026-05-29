from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database.session import get_db

from ._base import (
    CronJobResult,
    prefix,
    run_daily_job,
    run_sync_github_projects_job,
    tags,
    verify_cron_request,
)

router = APIRouter()


class DailyCronResponse(BaseModel):
    status: str
    jobs: list[CronJobResult]


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


__all__ = ["router", "prefix", "tags"]
