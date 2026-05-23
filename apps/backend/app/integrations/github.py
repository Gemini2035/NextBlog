from collections.abc import Sequence
from typing import TypedDict, cast

import httpx

GITHUB_API_BASE_URL = "https://api.github.com"


class GitHubOwner(TypedDict):
    login: str
    avatar_url: str
    html_url: str


class GitHubLicense(TypedDict):
    name: str


class GitHubRepository(TypedDict):
    id: int
    name: str
    full_name: str
    description: str | None
    html_url: str
    homepage: str | None
    owner: GitHubOwner
    stargazers_count: int
    forks_count: int
    watchers_count: int
    open_issues_count: int
    language: str | None
    topics: list[str]
    fork: bool
    archived: bool
    license: GitHubLicense | None
    created_at: str | None
    updated_at: str | None
    pushed_at: str | None


class GitHubContributor(TypedDict):
    login: str
    avatar_url: str
    html_url: str
    contributions: int


JsonObject = dict[str, object]
QueryParams = dict[str, str | int | bool]


class GitHubRateLimitError(RuntimeError):
    pass


class GitHubRequestError(RuntimeError):
    pass


def _as_object(value: object) -> JsonObject:
    return cast(JsonObject, value) if isinstance(value, dict) else {}


def _as_list(value: object) -> list[object]:
    if not isinstance(value, list):
        return []

    sequence = cast(Sequence[object], value)
    items: list[object] = []
    for item in sequence:
        items.append(item)

    return items


def _get_str(data: JsonObject, key: str, default: str = "") -> str:
    value = data.get(key)
    return value if isinstance(value, str) else default


def _get_optional_str(data: JsonObject, key: str) -> str | None:
    value = data.get(key)
    return value if isinstance(value, str) and value else None


def _get_int(data: JsonObject, key: str) -> int:
    value = data.get(key)
    return value if isinstance(value, int) else 0


def _get_bool(data: JsonObject, key: str) -> bool:
    value = data.get(key)
    return value if isinstance(value, bool) else False


def _to_owner(value: object) -> GitHubOwner:
    owner = _as_object(value)
    return {
        "login": _get_str(owner, "login"),
        "avatar_url": _get_str(owner, "avatar_url"),
        "html_url": _get_str(owner, "html_url"),
    }


def _to_license(value: object) -> GitHubLicense | None:
    if not isinstance(value, dict):
        return None

    license_data = cast(JsonObject, value)
    name = _get_optional_str(license_data, "name")
    return {"name": name} if name else None


def _to_repository(value: object) -> GitHubRepository | None:
    if not isinstance(value, dict):
        return None

    repo = cast(JsonObject, value)
    repo_id = repo.get("id")
    if not isinstance(repo_id, int):
        return None

    return {
        "id": repo_id,
        "name": _get_str(repo, "name"),
        "full_name": _get_str(repo, "full_name"),
        "description": _get_optional_str(repo, "description"),
        "html_url": _get_str(repo, "html_url"),
        "homepage": _get_optional_str(repo, "homepage"),
        "owner": _to_owner(repo.get("owner")),
        "stargazers_count": _get_int(repo, "stargazers_count"),
        "forks_count": _get_int(repo, "forks_count"),
        "watchers_count": _get_int(repo, "watchers_count"),
        "open_issues_count": _get_int(repo, "open_issues_count"),
        "language": _get_optional_str(repo, "language"),
        "topics": [
            topic
            for topic in _as_list(repo.get("topics"))
            if isinstance(topic, str)
        ],
        "fork": _get_bool(repo, "fork"),
        "archived": _get_bool(repo, "archived"),
        "license": _to_license(repo.get("license")),
        "created_at": _get_optional_str(repo, "created_at"),
        "updated_at": _get_optional_str(repo, "updated_at"),
        "pushed_at": _get_optional_str(repo, "pushed_at"),
    }


def _to_contributor(value: object) -> GitHubContributor | None:
    if not isinstance(value, dict):
        return None

    contributor = cast(JsonObject, value)
    login = _get_optional_str(contributor, "login")
    if not login:
        return None

    return {
        "login": login,
        "avatar_url": _get_str(contributor, "avatar_url"),
        "html_url": _get_str(contributor, "html_url"),
        "contributions": _get_int(contributor, "contributions"),
    }


class GitHubClient:
    def __init__(self, token: str | None = None) -> None:
        headers = {
            "Accept": "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
            "User-Agent": "nextblog-project-sync",
        }
        if token:
            headers["Authorization"] = f"Bearer {token}"

        self.client = httpx.Client(
            base_url=GITHUB_API_BASE_URL,
            headers=headers,
            timeout=30,
        )

    def close(self) -> None:
        self.client.close()

    def __enter__(self) -> "GitHubClient":
        return self

    def __exit__(self, *args: object) -> None:
        self.close()

    def get_user_repositories(self, username: str) -> list[GitHubRepository]:
        return self._get_paginated(
            f"/users/{username}/repos",
            {
                "type": "all",
                "sort": "updated",
                "direction": "desc",
                "per_page": 100,
            },
        )

    def get_repository_languages(self, full_name: str) -> dict[str, int]:
        response = self.client.get(f"/repos/{full_name}/languages")
        _raise_for_status(response)
        data = response.json()
        if not isinstance(data, dict):
            return {}

        languages = cast(JsonObject, data)
        return {
            str(language): bytes_count
            for language, bytes_count in languages.items()
            if isinstance(bytes_count, int)
        }

    def get_repository_contributors(self, full_name: str) -> list[GitHubContributor]:
        response = self.client.get(
            f"/repos/{full_name}/contributors",
            params={
                "per_page": 10,
                "anon": "false",
            },
        )
        if response.status_code in {204, 404}:
            return []

        _raise_for_status(response)
        data = response.json()
        return [
            contributor
            for contributor in (_to_contributor(item) for item in _as_list(data))
            if contributor is not None
        ]

    def _get_paginated(self, path: str, params: QueryParams) -> list[GitHubRepository]:
        items: list[GitHubRepository] = []
        page = 1

        while True:
            response = self.client.get(path, params={**params, "page": page})
            _raise_for_status(response)
            data = response.json()

            items.extend(
                repository
                for repository in (_to_repository(item) for item in _as_list(data))
                if repository is not None
            )

            if "next" not in response.links:
                return items

            page += 1


def _raise_for_status(response: httpx.Response) -> None:
    try:
        response.raise_for_status()
    except httpx.HTTPStatusError as error:
        if response.status_code == 403:
            remaining = response.headers.get("x-ratelimit-remaining")
            if remaining == "0" or "rate limit" in response.text.lower():
                raise GitHubRateLimitError("GitHub API rate limit exceeded") from error

        raise GitHubRequestError(str(error)) from error
