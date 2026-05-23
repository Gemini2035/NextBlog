from datetime import datetime
from typing import Any, Literal, TypedDict

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.project import Project


class ProjectListItem(TypedDict):
    id: int
    name: str
    description: str
    stars: int
    forks: int
    primaryLanguage: dict[str, str] | None
    topics: list[str]
    isFork: bool
    isArchived: bool
    isPinned: bool
    createdAt: str
    updatedAt: str
    pushedAt: str
    weight: float | None
    contributorCount: int


class ProjectStatsGroup(TypedDict):
    count: int
    stars: int
    forks: int
    languages: int


class ProjectStats(TypedDict):
    totalProjects: int
    totalStars: int
    totalForks: int
    languageDistribution: list[dict[str, Any]]
    categoryDistribution: dict[str, int]
    activeProjects: int
    archivedProjects: int
    ownedStats: ProjectStatsGroup
    contributedStats: ProjectStatsGroup


class ProjectsPayload(TypedDict):
    projects: list[ProjectListItem]
    stats: ProjectStats
    rateLimit: None
    source: Literal["database"]


def _format_datetime(value: datetime) -> str:
    return value.isoformat()


def _to_primary_language(project: Project) -> dict[str, str] | None:
    if not project.primary_language_name:
        return None

    return {
        "name": project.primary_language_name,
        "color": project.primary_language_color or "",
    }


def _to_project_list_item(project: Project) -> ProjectListItem:
    return {
        "id": project.id,
        "name": project.name,
        "description": project.description,
        "stars": project.stars,
        "forks": project.forks,
        "primaryLanguage": _to_primary_language(project),
        "topics": project.topics,
        "isFork": project.is_fork,
        "isArchived": project.is_archived,
        "isPinned": project.is_pinned,
        "createdAt": _format_datetime(project.github_created_at),
        "updatedAt": _format_datetime(project.github_updated_at),
        "pushedAt": _format_datetime(project.github_pushed_at),
        "weight": project.weight,
        "contributorCount": len(project.contributors),
    }


def _get_language_distribution(projects: list[Project]) -> list[dict[str, Any]]:
    language_totals: dict[str, dict[str, Any]] = {}
    total_bytes = 0

    for project in projects:
        for language in project.language_stats:
            name = str(language.get("name") or "")
            if not name:
                continue

            bytes_count = int(language.get("bytes") or 0)
            total_bytes += bytes_count
            current = language_totals.setdefault(
                name,
                {
                    "name": name,
                    "bytes": 0,
                    "percentage": 0,
                    "color": str(language.get("color") or ""),
                },
            )
            current["bytes"] += bytes_count

    if total_bytes == 0:
        return []

    return [
        {
            **language,
            "percentage": round(int(language["bytes"]) / total_bytes * 100, 1),
        }
        for language in sorted(
            language_totals.values(),
            key=lambda item: int(item["bytes"]),
            reverse=True,
        )
    ]


def _get_language_count(projects: list[Project]) -> int:
    return len(
        {
            project.primary_language_name
            for project in projects
            if project.primary_language_name
        }
    )


def _to_stats(projects: list[Project]) -> ProjectStats:
    owned_projects = [project for project in projects if not project.is_fork]
    contributed_projects = [project for project in projects if project.is_fork]

    return {
        "totalProjects": len(projects),
        "totalStars": sum(project.stars for project in projects),
        "totalForks": sum(project.forks for project in projects),
        "languageDistribution": _get_language_distribution(projects),
        "categoryDistribution": {
            "featured": sum(1 for project in projects if project.is_pinned),
            "active": sum(1 for project in projects if not project.is_archived),
            "stable": 0,
            "completed": 0,
            "archived": sum(1 for project in projects if project.is_archived),
            "fork": sum(1 for project in projects if project.is_fork),
            "learning": 0,
        },
        "activeProjects": sum(1 for project in projects if not project.is_archived),
        "archivedProjects": sum(1 for project in projects if project.is_archived),
        "ownedStats": {
            "count": len(owned_projects),
            "stars": sum(project.stars for project in owned_projects),
            "forks": sum(project.forks for project in owned_projects),
            "languages": _get_language_count(owned_projects),
        },
        "contributedStats": {
            "count": len(contributed_projects),
            "stars": sum(project.stars for project in contributed_projects),
            "forks": sum(project.forks for project in contributed_projects),
            "languages": _get_language_count(contributed_projects),
        },
    }


def get_projects(db: Session) -> ProjectsPayload:
    statement = select(Project).order_by(Project.weight.desc().nullslast(), Project.github_updated_at.desc())
    projects = list(db.scalars(statement))

    return {
        "projects": [_to_project_list_item(project) for project in projects],
        "stats": _to_stats(projects),
        "rateLimit": None,
        "source": "database",
    }
