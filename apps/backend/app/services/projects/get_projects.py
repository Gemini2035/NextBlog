from copy import deepcopy
from typing import Any, Literal, TypedDict

from .mock import MOCK_PROJECTS, MOCK_STATS, MockProject, MockStats


class ProjectListItem(TypedDict):
    id: int
    name: str
    description: str
    stars: int
    forks: int
    primaryLanguage: dict[str, Any] | None
    topics: list[str]
    isFork: bool
    isArchived: bool
    isPinned: bool
    createdAt: str
    updatedAt: str
    pushedAt: str
    weight: float | int | None
    contributorCount: int


class ProjectsPayload(TypedDict):
    projects: list[ProjectListItem]
    stats: MockStats
    rateLimit: None
    source: Literal["mock"]


def _to_project_list_item(project: MockProject) -> ProjectListItem:
    return {
        "id": int(project["id"]),
        "name": str(project["name"]),
        "description": str(project["description"]),
        "stars": int(project["stars"]),
        "forks": int(project["forks"]),
        "primaryLanguage": deepcopy(project.get("primaryLanguage")),
        "topics": list(project["topics"]),
        "isFork": bool(project["isFork"]),
        "isArchived": bool(project["isArchived"]),
        "isPinned": bool(project["isPinned"]),
        "createdAt": str(project["createdAt"]),
        "updatedAt": str(project["updatedAt"]),
        "pushedAt": str(project["pushedAt"]),
        "weight": project.get("weight"),
        "contributorCount": len(project.get("contributors") or []),
    }


def get_projects() -> ProjectsPayload:
    return {
        "projects": [_to_project_list_item(project) for project in MOCK_PROJECTS],
        "stats": deepcopy(MOCK_STATS),
        "rateLimit": None,
        "source": "mock",
    }
