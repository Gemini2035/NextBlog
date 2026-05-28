from random import sample

from sqlalchemy import Select, func, not_, or_, select
from sqlalchemy.orm import Session, aliased, selectinload

from app.models.dictionary import Dictionary
from app.models.post import Post, PostTag
from app.models.site_navigation import SiteNavigation
from app.services.post.base.get_posts import _apply_disable_filter
from app.services.post.utils.public_ids import encode_post_id
from app.services.post.utils.serializers import serialize_post_list_item
from app.services.post.utils.translations import resolve_dictionary_value


SEARCH_EXCLUDED_NAVIGATION_KEYS = {"search", "language"}


def _normalize_limit(limit: int) -> int:
    return min(max(limit, 1), 10)


def _is_navigation_disabled(navigation: SiteNavigation, locale: str | None) -> bool:
    disable = navigation.disable or []
    if "*" in disable:
        return True

    normalized_locale = locale.strip() if locale else ""
    return bool(normalized_locale and normalized_locale in disable)


def _post_to_search_item(db: Session, post: Post, locale: str | None) -> dict[str, object]:
    payload = serialize_post_list_item(db, post, locale)
    return {
        "id": f"post-{payload['id']}",
        "type": "post",
        "title": payload["title"],
        "description": payload.get("description"),
        "href": f"/posts/{payload['id']}",
    }


def _navigation_to_search_item(
    db: Session,
    navigation: SiteNavigation,
    locale: str | None,
) -> dict[str, object]:
    label = resolve_dictionary_value(db, navigation.label_key, locale) or navigation.key
    description = resolve_dictionary_value(db, navigation.description_key, locale)
    return {
        "id": f"link-{navigation.id}",
        "type": "link",
        "title": label,
        "description": description,
        "href": navigation.href,
    }


def _apply_post_search(statement: Select[tuple[Post]], query: str) -> Select[tuple[Post]]:
    pattern = f"%{query}%"
    title_dictionary = aliased(Dictionary)
    description_dictionary = aliased(Dictionary)
    return (
        statement.outerjoin(Post.tags)
        .outerjoin(Dictionary, Dictionary.id == PostTag.dictionary_id)
        .outerjoin(title_dictionary, title_dictionary.key == Post.title_key)
        .outerjoin(description_dictionary, description_dictionary.key == Post.description_key)
        .where(
            or_(
                Post.title_key.ilike(pattern),
                Post.description_key.ilike(pattern),
                Post.content.ilike(pattern),
                PostTag.key.ilike(pattern),
                Dictionary.key.ilike(pattern),
                Dictionary.values["zh"].astext.ilike(pattern),
                Dictionary.values["en"].astext.ilike(pattern),
                Dictionary.values["ja"].astext.ilike(pattern),
                title_dictionary.values["zh"].astext.ilike(pattern),
                title_dictionary.values["en"].astext.ilike(pattern),
                title_dictionary.values["ja"].astext.ilike(pattern),
                description_dictionary.values["zh"].astext.ilike(pattern),
                description_dictionary.values["en"].astext.ilike(pattern),
                description_dictionary.values["ja"].astext.ilike(pattern),
            )
        )
    )


def _apply_navigation_search(
    statement: Select[tuple[SiteNavigation]],
    query: str,
) -> Select[tuple[SiteNavigation]]:
    pattern = f"%{query}%"
    label_dictionary = aliased(Dictionary)
    description_dictionary = aliased(Dictionary)
    return (
        statement.outerjoin(label_dictionary, label_dictionary.key == SiteNavigation.label_key)
        .outerjoin(
            description_dictionary,
            description_dictionary.key == SiteNavigation.description_key,
        )
        .where(
            or_(
                SiteNavigation.key.ilike(pattern),
                SiteNavigation.href.ilike(pattern),
                SiteNavigation.dynamic_data_key.ilike(pattern),
                label_dictionary.values["zh"].astext.ilike(pattern),
                label_dictionary.values["en"].astext.ilike(pattern),
                label_dictionary.values["ja"].astext.ilike(pattern),
                description_dictionary.values["zh"].astext.ilike(pattern),
                description_dictionary.values["en"].astext.ilike(pattern),
                description_dictionary.values["ja"].astext.ilike(pattern),
            )
        )
    )


def get_search_recommendations(
    db: Session,
    *,
    locale: str | None = None,
    limit: int = 3,
) -> dict[str, object]:
    normalized_limit = min(_normalize_limit(limit), 3)
    post_candidates = db.scalars(
        _apply_disable_filter(select(Post), locale)
        .options(selectinload(Post.tags))
        .order_by(func.random())
        .limit(normalized_limit * 2)
    ).all()
    navigation_candidates = db.scalars(
        select(SiteNavigation)
        .where(
            not_(SiteNavigation.key.in_(SEARCH_EXCLUDED_NAVIGATION_KEYS)),
            or_(
                SiteNavigation.disable.is_(None),
                not_(SiteNavigation.disable.contains(["*"])),
            ),
        )
        .order_by(func.random())
        .limit(normalized_limit * 2)
    ).all()

    candidates = [
        _post_to_search_item(db, post, locale)
        for post in post_candidates
    ] + [
        _navigation_to_search_item(db, navigation, locale)
        for navigation in navigation_candidates
        if not _is_navigation_disabled(navigation, locale)
    ]

    items = sample(candidates, k=min(normalized_limit, len(candidates))) if candidates else []
    return {
        "mode": "recommend",
        "items": items,
        "groups": [],
    }


def search_site(
    db: Session,
    *,
    query: str | None = None,
    locale: str | None = None,
    limit: int = 5,
) -> dict[str, object]:
    normalized_query = query.strip() if query else ""
    if not normalized_query:
        return get_search_recommendations(db, locale=locale, limit=3)

    normalized_limit = _normalize_limit(limit)
    post_statement = _apply_disable_filter(select(Post), locale)
    post_statement = _apply_post_search(post_statement, normalized_query)
    posts = db.scalars(
        post_statement.options(selectinload(Post.tags))
        .distinct()
        .order_by(Post.is_featured.desc(), Post.updated_at.desc(), Post.id.desc())
        .limit(normalized_limit)
    ).all()

    navigation_statement = select(SiteNavigation).where(
        not_(SiteNavigation.key.in_(SEARCH_EXCLUDED_NAVIGATION_KEYS)),
        or_(
            SiteNavigation.disable.is_(None),
            not_(SiteNavigation.disable.contains(["*"])),
        ),
    )
    navigation_statement = _apply_navigation_search(navigation_statement, normalized_query)
    navigations = db.scalars(
        navigation_statement.distinct()
        .order_by(SiteNavigation.sort_order.asc(), SiteNavigation.id.asc())
        .limit(normalized_limit)
    ).all()

    post_items = [_post_to_search_item(db, post, locale) for post in posts]
    link_items = [
        _navigation_to_search_item(db, navigation, locale)
        for navigation in navigations
        if not _is_navigation_disabled(navigation, locale)
    ][:normalized_limit]

    groups: list[dict[str, object]] = []
    if post_items:
        groups.append({"type": "posts", "items": post_items})
    if link_items:
        groups.append({"type": "links", "items": link_items})

    return {
        "mode": "search",
        "items": [],
        "groups": groups,
    }
