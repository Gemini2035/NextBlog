from math import ceil

from sqlalchemy import Select, func, not_, or_, select
from sqlalchemy.orm import Session, aliased, selectinload

from app.models.post import Post, PostTag
from app.models.dictionary import Dictionary
from app.services.post.utils.serializers import (
    serialize_post_detail,
    serialize_post_list_item,
)


def is_post_disabled(post: Post, locale: str | None) -> bool:
    disable = post.disable or []
    if "*" in disable:
        return True

    normalized_locale = locale.strip() if locale else ""
    return bool(normalized_locale and normalized_locale in disable)


def _apply_search_filter(statement: Select[tuple[Post]], keyword: str | None) -> Select[tuple[Post]]:
    normalized_keyword = keyword.strip() if keyword else ""
    if not normalized_keyword:
        return statement

    pattern = f"%{normalized_keyword}%"
    title_dictionary = aliased(Dictionary)
    description_dictionary = aliased(Dictionary)
    return (
        statement.outerjoin(Post.tags)
        .outerjoin(Dictionary, Dictionary.key == PostTag.key)
        .outerjoin(title_dictionary, title_dictionary.key == Post.title_key)
        .outerjoin(description_dictionary, description_dictionary.key == Post.description_key)
        .where(
            or_(
                Post.title_key.ilike(pattern),
                Post.description_key.ilike(pattern),
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


def _apply_disable_filter(
    statement: Select[tuple[Post]],
    locale: str | None,
) -> Select[tuple[Post]]:
    normalized_locale = locale.strip() if locale else ""
    if not normalized_locale:
        return statement.where(not_(Post.disable.contains(["*"])))

    return statement.where(
        not_(
            or_(
                Post.disable.contains(["*"]),
                Post.disable.contains([normalized_locale]),
            )
        )
    )


def get_post(
    db: Session,
    post_id: int,
    *,
    locale: str | None = None,
) -> dict[str, object] | None:
    post = db.scalar(
        select(Post)
        .where(Post.id == post_id)
        .options(
            selectinload(Post.tags),
        )
    )

    if post is None:
        return None
    if is_post_disabled(post, locale):
        return None

    return serialize_post_detail(db, post, locale)


def get_posts(
    db: Session,
    *,
    locale: str | None = None,
    keyword: str | None = None,
    page: int = 1,
    page_size: int = 10,
) -> dict[str, object]:
    normalized_page = max(page, 1)
    normalized_page_size = min(max(page_size, 1), 100)

    base_statement = select(Post)
    base_statement = _apply_disable_filter(base_statement, locale)
    base_statement = _apply_search_filter(base_statement, keyword)

    total = db.scalar(select(func.count()).select_from(base_statement.distinct().subquery())) or 0
    posts = db.scalars(
        base_statement.options(
            selectinload(Post.tags),
        )
        .distinct()
        .order_by(Post.is_featured.desc(), Post.updated_at.desc(), Post.id.desc())
        .offset((normalized_page - 1) * normalized_page_size)
        .limit(normalized_page_size)
    ).all()

    return {
        "posts": [serialize_post_list_item(db, post, locale) for post in posts],
        "total": total,
        "page": normalized_page,
        "page_size": normalized_page_size,
        "total_pages": ceil(total / normalized_page_size) if total else 0,
    }
