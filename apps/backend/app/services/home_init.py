from collections import Counter
from datetime import UTC, datetime, timedelta
from typing import Any

from sqlalchemy.orm import Session

from app.services.post import get_posts

HOME_POST_QUERY_LIMIT = 100
HOME_FLOATING_POST_LIMIT = 6
HOME_RECENT_POST_LIMIT = 10
HOME_POPULAR_TAG_LIMIT = 5


def _get_post_timestamp(post: dict[str, Any], field: str) -> float:
    value = _get_post_datetime(post, field)

    if value is None:
        return 0

    return float(value.timestamp())


def _get_post_datetime(post: dict[str, Any], field: str) -> datetime | None:
    value = post.get(field)
    return value if isinstance(value, datetime) else None


def _sort_posts_by_time(posts: list[dict[str, Any]], field: str) -> list[dict[str, Any]]:
    return sorted(posts, key=lambda post: _get_post_timestamp(post, field), reverse=True)


def _build_floating_posts(
    *,
    recent_posts: list[dict[str, Any]],
    latest_posts: list[dict[str, Any]],
) -> list[dict[str, Any]]:
    posts_to_show = recent_posts[:HOME_FLOATING_POST_LIMIT]

    if len(posts_to_show) < HOME_FLOATING_POST_LIMIT:
        remaining_count = HOME_FLOATING_POST_LIMIT - len(posts_to_show)
        used_ids = {post["id"] for post in posts_to_show}
        posts_to_show = [
            *posts_to_show,
            *[
                post
                for post in latest_posts
                if post["id"] not in used_ids
            ][:remaining_count],
        ]

    if len(posts_to_show) < HOME_FLOATING_POST_LIMIT and len(latest_posts) >= HOME_FLOATING_POST_LIMIT:
        return latest_posts[:HOME_FLOATING_POST_LIMIT]

    return posts_to_show


def _build_popular_tags(posts: list[dict[str, Any]]) -> list[str]:
    tag_counts = Counter(
        tag
        for post in posts
        for tag in _get_post_tags(post)
        if isinstance(tag, str) and tag
    )
    return [
        tag
        for tag, _count in tag_counts.most_common(HOME_POPULAR_TAG_LIMIT)
    ]


def _get_post_tags(post: dict[str, Any]) -> list[Any]:
    tags = post.get("tags")
    return tags if isinstance(tags, list) else []


def get_home_init(db: Session, *, locale: str | None = None) -> dict[str, Any]:
    posts_payload = get_posts(
        db,
        locale=locale,
        page=1,
        page_size=HOME_POST_QUERY_LIMIT,
    )
    raw_posts = posts_payload.get("posts")
    posts = [post for post in raw_posts if isinstance(post, dict)] if isinstance(raw_posts, list) else []

    one_month_ago = datetime.now(UTC) - timedelta(days=30)
    latest_posts = _sort_posts_by_time(posts, "created_at")
    recent_posts = [
        post
        for post in _sort_posts_by_time(posts, "updated_at")
        if (updated_at := _get_post_datetime(post, "updated_at")) is not None
        and updated_at >= one_month_ago
    ][:HOME_RECENT_POST_LIMIT]
    return {
        "posts": {
            "floating": _build_floating_posts(
                recent_posts=recent_posts,
                latest_posts=latest_posts,
            ),
            "popular_tags": _build_popular_tags(posts),
        }
    }
