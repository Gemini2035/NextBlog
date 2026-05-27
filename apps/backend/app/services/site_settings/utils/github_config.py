from typing import Any, TypedDict

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.site_setting import SiteSetting


class GitHubFetchOptions(TypedDict, total=False):
    repo_type: str
    include_forked: bool
    include_archived: bool
    include_languages: bool
    include_contributors: bool
    min_stars: int
    sort_by: str
    max_projects: int
    max_pages: int


class GitHubSiteConfig(TypedDict):
    username: str
    token: str
    fetch_options: GitHubFetchOptions
    featured_repos: list[str]
    exclude_repos: list[str]
    cache_time: int


def _as_object(value: object) -> dict[str, Any]:
    return value if isinstance(value, dict) else {}


class GitHubSiteConfigError(RuntimeError):
    pass


def _as_str(value: object, default: str = "") -> str:
    return value if isinstance(value, str) and value else default


def _as_bool(value: object, default: bool) -> bool:
    return value if isinstance(value, bool) else default


def _as_int(value: object, default: int) -> int:
    return value if isinstance(value, int) else default


def _as_str_list(value: object) -> list[str]:
    return [item for item in value if isinstance(item, str)] if isinstance(value, list) else []


def get_github_site_config(db: Session) -> GitHubSiteConfig:
    setting = db.scalar(
        select(SiteSetting)
        .where(
            SiteSetting.key == "github",
            SiteSetting.is_enabled.is_(True),
        )
        .order_by(SiteSetting.id.asc())
        .limit(1)
    )
    if setting is None:
        raise GitHubSiteConfigError("GitHub site setting is not configured")

    value = _as_object(setting.value if setting else None)
    username = _as_str(value.get("username"))
    token = _as_str(value.get("token"))
    if not username:
        raise GitHubSiteConfigError("GitHub site setting username is not configured")
    if not token:
        raise GitHubSiteConfigError("GitHub site setting token is not configured")

    fetch_options = _as_object(value.get("fetchOptions"))

    return {
        "username": username,
        "token": token,
        "fetch_options": {
            "repo_type": _as_str(fetch_options.get("repoType"), "all"),
            "include_forked": _as_bool(fetch_options.get("includeForked"), True),
            "include_archived": _as_bool(fetch_options.get("includeArchived"), True),
            "include_languages": _as_bool(fetch_options.get("includeLanguages"), True),
            "include_contributors": _as_bool(fetch_options.get("includeContributors"), True),
            "min_stars": _as_int(fetch_options.get("minStars"), 0),
            "sort_by": _as_str(fetch_options.get("sortBy"), "updated"),
            "max_projects": _as_int(fetch_options.get("maxProjects"), 100),
            "max_pages": _as_int(fetch_options.get("maxPages"), 10),
        },
        "featured_repos": _as_str_list(value.get("featuredRepos")),
        "exclude_repos": _as_str_list(value.get("excludeRepos")),
        "cache_time": _as_int(value.get("cacheTime"), 3600),
    }
