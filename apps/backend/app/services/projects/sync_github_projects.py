from datetime import UTC, datetime
from typing import Any, TypedDict

from sqlalchemy.orm import Session

from app.integrations.github import (
    GitHubClient,
    GitHubContributor,
    GitHubRateLimitError,
    GitHubRepository,
    GitHubRequestError,
)
from app.models.project import Project

LANGUAGE_COLORS = {
    "CSS": "#563d7c",
    "Go": "#00ADD8",
    "HTML": "#e34c26",
    "JavaScript": "#f1e05a",
    "MDX": "#858585",
    "Python": "#3572A5",
    "Rust": "#dea584",
    "Shell": "#89e051",
    "TypeScript": "#3178c6",
    "Vue": "#41b883",
}


class LanguageStat(TypedDict):
    name: str
    bytes: int
    percentage: float
    color: str


class ContributorStat(TypedDict):
    login: str
    avatarUrl: str
    profileUrl: str
    contributions: int
    percentage: float


class SyncResult(TypedDict):
    synced: int
    skipped: int
    warnings: list[str]


def _parse_github_datetime(value: str | None) -> datetime:
    if not value:
        return datetime.now(UTC)

    return datetime.fromisoformat(value.replace("Z", "+00:00"))


def _get_language_stats(languages: dict[str, int]) -> list[dict[str, Any]]:
    total_bytes = sum(languages.values())
    if total_bytes == 0:
        return []

    stats: list[LanguageStat] = [
        {
            "name": name,
            "bytes": bytes_count,
            "percentage": bytes_count / total_bytes * 100,
            "color": LANGUAGE_COLORS.get(name, ""),
        }
        for name, bytes_count in sorted(
            languages.items(),
            key=lambda item: item[1],
            reverse=True,
        )
    ]
    return [dict(stat) for stat in stats]


def _get_contributor_stats(contributors: list[GitHubContributor]) -> list[dict[str, Any]]:
    total_contributions = sum(contributor["contributions"] for contributor in contributors)
    if total_contributions == 0:
        total_contributions = 1

    stats: list[ContributorStat] = [
        {
            "login": contributor["login"],
            "avatarUrl": contributor["avatar_url"],
            "profileUrl": contributor["html_url"],
            "contributions": contributor["contributions"],
            "percentage": contributor["contributions"] / total_contributions * 100,
        }
        for contributor in contributors
    ]
    return [dict(stat) for stat in stats]


def _get_activity_score(repo: GitHubRepository) -> float:
    return (
        repo["stargazers_count"] * 10
        + repo["forks_count"] * 3
        + repo["watchers_count"]
        - repo["open_issues_count"]
    )


def _upsert_project(
    db: Session,
    repo: GitHubRepository,
    languages: dict[str, int],
    contributors: list[GitHubContributor],
) -> None:
    repo_id = repo["id"]
    owner = repo["owner"]
    existing_project = db.get(Project, repo_id)
    primary_language_name = repo["language"]
    activity_score = _get_activity_score(repo)

    project = existing_project or Project(id=repo_id)
    project.name = repo["name"]
    project.full_name = repo["full_name"]
    project.description = repo["description"] or "No description provided"
    project.url = repo["html_url"]
    project.homepage = repo["homepage"]
    project.owner_login = owner["login"]
    project.owner_avatar_url = owner["avatar_url"]
    project.owner_url = owner["html_url"]
    project.stars = repo["stargazers_count"]
    project.forks = repo["forks_count"]
    project.watchers = repo["watchers_count"]
    project.open_issues = repo["open_issues_count"]
    project.primary_language_name = primary_language_name
    project.primary_language_color = (
        LANGUAGE_COLORS.get(primary_language_name, "") if primary_language_name else None
    )
    project.topics = repo["topics"]
    project.languages = languages
    project.language_stats = _get_language_stats(languages)
    project.contributors = _get_contributor_stats(contributors)
    project.is_fork = repo["fork"]
    project.is_archived = repo["archived"]
    project.is_pinned = bool(existing_project.is_pinned) if existing_project else False
    project.license = repo["license"]["name"] if repo["license"] else None
    project.github_created_at = _parse_github_datetime(repo["created_at"])
    project.github_updated_at = _parse_github_datetime(repo["updated_at"])
    project.github_pushed_at = _parse_github_datetime(repo["pushed_at"])
    project.activity_score = activity_score
    project.display_weight = activity_score
    project.weight = activity_score + (10000 if project.is_pinned else 0)

    db.add(project)


def sync_github_projects(db: Session, username: str, token: str | None = None) -> SyncResult:
    synced = 0
    skipped = 0
    warnings: list[str] = []

    with GitHubClient(token=token) as github:
        repositories = github.get_user_repositories(username)

        for repo in repositories:
            full_name = repo["full_name"]
            if not full_name:
                skipped += 1
                continue

            try:
                languages = github.get_repository_languages(full_name)
            except (GitHubRateLimitError, GitHubRequestError) as error:
                languages = {}
                warnings.append(f"{full_name}: languages unavailable: {error}")

            try:
                contributors = github.get_repository_contributors(full_name)
            except (GitHubRateLimitError, GitHubRequestError) as error:
                contributors = []
                warnings.append(f"{full_name}: contributors unavailable: {error}")

            _upsert_project(db, repo, languages, contributors)
            synced += 1

    db.commit()

    return {
        "synced": synced,
        "skipped": skipped,
        "warnings": warnings,
    }
