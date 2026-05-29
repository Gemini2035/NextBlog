from datetime import datetime
from typing import Any, Callable

from sqlalchemy.orm import Session

from app.services.dictionaries import get_dictionary_by_key
from app.services.locales import get_locales
from app.services.post import get_posts
from app.services.site_navigation import get_site_navigations
from app.services.site_settings import get_public_site_settings

DEFAULT_POSTS_PER_PAGE = 6
MAX_NAVIGATION_POST_ITEMS = 10


def _is_disabled(disable: list[str] | None, locale: str | None) -> bool:
    disabled_locales = disable or []
    if "*" in disabled_locales:
        return True

    normalized_locale = locale.strip() if locale else ""
    return bool(normalized_locale and normalized_locale in disabled_locales)


def _resolve_translation(
    translations: dict[str, str] | None,
    locale: str | None,
    fallback: str,
) -> str:
    if not translations:
        return fallback

    normalized_locale = locale.strip() if locale else ""
    for key in [normalized_locale, "en", "zh", "ja"]:
        if key and translations.get(key):
            return translations[key]

    return next(iter(translations.values()), fallback)


def _build_site_config(settings: list[Any]) -> dict[str, Any]:
    site_config: dict[str, Any] = {}

    for setting in settings:
        if setting.key == "site_config" and isinstance(setting.value, dict):
            site_config.update(setting.value)
            continue

        site_config[setting.key] = setting.value

    return site_config


def _build_site_languages(db: Session) -> list[dict[str, Any]]:
    site_languages: list[dict[str, Any]] = []

    for locale in get_locales(db):
        dictionary = get_dictionary_by_key(db, locale.trans_key)
        site_languages.append(
            {
                "id": locale.id,
                "code": locale.code,
                "name": locale.name,
                "trans_key": locale.trans_key,
                "translations": dictionary.values if dictionary else {},
                "is_default": locale.is_default,
                "is_enabled": locale.is_enabled,
                "sort_order": locale.sort_order,
                "created_at": locale.created_at,
                "updated_at": locale.updated_at,
            }
        )

    return site_languages


def _get_posts_per_page(site_config: dict[str, Any]) -> int:
    value = (
        site_config.get("postsPerPage")
        or site_config.get("posts_per_page")
        or site_config.get("app.postsPerPage")
    )

    if isinstance(value, int):
        return max(value, 1)
    if isinstance(value, str) and value.isdigit():
        return max(int(value), 1)

    return DEFAULT_POSTS_PER_PAGE


def _build_navigation_tree(
    navigations: list[dict[str, Any]],
    locale: str | None,
) -> list[dict[str, Any]]:
    nodes: dict[int, dict[str, Any]] = {}

    for navigation in navigations:
        if _is_disabled(navigation.get("disable"), locale):
            continue

        navigation_id = int(navigation["id"])
        key = str(navigation["key"])
        nodes[navigation_id] = {
            "id": navigation_id,
            "parent_id": navigation.get("parent_id"),
            "key": key,
            "label": _resolve_translation(navigation.get("label"), locale, key),
            "description": (
                _resolve_translation(navigation.get("description"), locale, "")
                if navigation.get("description")
                else None
            ),
            "href": navigation["href"],
            "icon": navigation.get("icon"),
            "target": navigation.get("target"),
            "dynamic_data_key": navigation.get("dynamic_data_key"),
            "sort_order": navigation["sort_order"],
            "items": [],
        }

    roots: list[dict[str, Any]] = []
    for node in sorted(
        nodes.values(),
        key=lambda item: (item["parent_id"] is not None, item["sort_order"], item["id"]),
    ):
        parent_id = node["parent_id"]
        if parent_id is not None and parent_id in nodes:
            nodes[parent_id]["items"].append(node)
        else:
            roots.append(node)

    def sort_children(item: dict[str, Any]) -> None:
        item["items"].sort(key=lambda child: (child["sort_order"], child["id"]))
        for child in item["items"]:
            sort_children(child)

    roots.sort(key=lambda item: (item["sort_order"], item["id"]))
    for root in roots:
        sort_children(root)

    return roots


def _build_post_navigation_item(
    post: dict[str, Any],
    *,
    parent_id: int,
    sort_order: int,
) -> dict[str, Any]:
    post_id = str(post["id"])
    return {
        "id": -(parent_id * 1000 + sort_order + 1),
        "parent_id": parent_id,
        "key": f"post.{post_id}",
        "label": post.get("title") or post_id,
        "description": post.get("description"),
        "href": f"/posts/{post_id}",
        "icon": None,
        "target": None,
        "dynamic_data_key": None,
        "sort_order": sort_order,
        "items": [],
    }


def _get_post_sort_timestamp(post: dict[str, Any]) -> float:
    value = _get_post_datetime(post, "updated_at") or _get_post_datetime(post, "created_at")

    if value is None:
        return 0

    return float(value.timestamp())


def _get_post_datetime(post: dict[str, Any], field: str) -> datetime | None:
    value = post.get(field)
    return value if isinstance(value, datetime) else None


def _attach_post_navigation_items(
    navigation: list[dict[str, Any]],
    posts: dict[str, Any],
) -> None:
    post_items = [
        post
        for post in posts.get("posts", [])
        if isinstance(post, dict)
    ]

    dynamic_post_filters: dict[str, Callable[[], list[dict[str, Any]]]] = {
        "posts.featured": lambda: [
            post
            for post in post_items
            if post.get("featured") is True or post.get("is_featured") is True
        ][:MAX_NAVIGATION_POST_ITEMS],
        "posts.recent": lambda: sorted(
            post_items,
            key=_get_post_sort_timestamp,
            reverse=True,
        )[:MAX_NAVIGATION_POST_ITEMS],
    }

    def visit(nodes: list[dict[str, Any]]) -> None:
        for node in nodes:
            dynamic_data_key = node.get("dynamic_data_key")
            get_dynamic_posts = (
                dynamic_post_filters.get(dynamic_data_key)
                if isinstance(dynamic_data_key, str)
                else None
            )
            if get_dynamic_posts is not None:
                node["items"] = [
                    _build_post_navigation_item(post, parent_id=node["id"], sort_order=index)
                    for index, post in enumerate(get_dynamic_posts())
                ]
            else:
                visit(node["items"])

    visit(navigation)


def get_site_init(db: Session, *, locale: str | None = None) -> dict[str, Any]:
    settings = get_public_site_settings(db)
    site_config = _build_site_config(settings)
    posts = get_posts(
        db,
        locale=locale,
        page=1,
        page_size=_get_posts_per_page(site_config),
    )

    navigation = _build_navigation_tree(get_site_navigations(db), locale)
    _attach_post_navigation_items(navigation, posts)

    return {
        "site_config": site_config,
        "site_languages": _build_site_languages(db),
        "navigation": navigation,
    }
