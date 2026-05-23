from datetime import datetime
from typing import Any

from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session

from app.models.project import Project


def _format_datetime(value: datetime) -> str:
    return value.isoformat()


def _to_primary_language(project: Project) -> dict[str, str] | None:
    if not project.primary_language_name:
        return None

    return {
        "name": project.primary_language_name,
        "color": project.primary_language_color or "",
    }


def _to_project_detail(project: Project) -> dict[str, Any]:
    return {
        "id": project.id,
        "name": project.name,
        "fullName": project.full_name,
        "description": project.description,
        "url": project.url,
        "homepage": project.homepage,
        "stars": project.stars,
        "forks": project.forks,
        "watchers": project.watchers,
        "openIssues": project.open_issues,
        "owner": {
            "login": project.owner_login,
            "avatarUrl": project.owner_avatar_url,
            "url": project.owner_url,
        },
        "primaryLanguage": _to_primary_language(project),
        "topics": project.topics,
        "languages": project.languages,
        "languageStats": project.language_stats,
        "contributors": project.contributors,
        "isFork": project.is_fork,
        "isArchived": project.is_archived,
        "isPinned": project.is_pinned,
        "isTemplate": False,
        "isPrivate": False,
        "isFeatured": project.is_pinned,
        "license": project.license,
        "defaultBranch": "main",
        "createdAt": _format_datetime(project.github_created_at),
        "updatedAt": _format_datetime(project.github_updated_at),
        "pushedAt": _format_datetime(project.github_pushed_at),
        "activityScore": project.activity_score,
        "displayWeight": project.display_weight,
        "weight": project.weight,
        "contributorCount": len(project.contributors),
    }


def get_project_detail(db: Session, project_id: str) -> dict[str, Any] | None:
    normalized_project_id = project_id.lower()
    id_filter = Project.id == int(project_id) if project_id.isdigit() else False

    statement = select(Project).where(
        or_(
            id_filter,
            func.lower(Project.name) == normalized_project_id,
            func.lower(Project.full_name) == normalized_project_id,
        )
    )
    project = db.scalar(statement)

    if project is None:
        return None

    return _to_project_detail(project)
