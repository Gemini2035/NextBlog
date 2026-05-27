from math import ceil

from sqlalchemy import Select, func, not_, or_, select
from sqlalchemy.orm import Session, aliased, selectinload

from app.models.blog import BlogPost, BlogTag
from app.models.dictionary import Dictionary
from app.services.blog.post.utils.serializers import (
    serialize_post_detail,
    serialize_post_list_item,
)


def is_post_disabled(post: BlogPost, site_language: str | None) -> bool:
    disable = post.disable or []
    if "*" in disable:
        return True

    normalized_site_language = site_language.strip() if site_language else ""
    return bool(normalized_site_language and normalized_site_language in disable)


def _apply_search_filter(statement: Select[tuple[BlogPost]], keyword: str | None) -> Select[tuple[BlogPost]]:
    normalized_keyword = keyword.strip() if keyword else ""
    if not normalized_keyword:
        return statement

    pattern = f"%{normalized_keyword}%"
    title_dictionary = aliased(Dictionary)
    description_dictionary = aliased(Dictionary)
    return (
        statement.outerjoin(BlogPost.tags)
        .outerjoin(Dictionary, Dictionary.key == BlogTag.key)
        .outerjoin(title_dictionary, title_dictionary.key == BlogPost.title_key)
        .outerjoin(description_dictionary, description_dictionary.key == BlogPost.description_key)
        .where(
            or_(
                BlogPost.title_key.ilike(pattern),
                BlogPost.description_key.ilike(pattern),
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
    statement: Select[tuple[BlogPost]],
    site_language: str | None,
) -> Select[tuple[BlogPost]]:
    normalized_site_language = site_language.strip() if site_language else ""
    if not normalized_site_language:
        return statement.where(not_(BlogPost.disable.contains(["*"])))

    return statement.where(
        not_(
            or_(
                BlogPost.disable.contains(["*"]),
                BlogPost.disable.contains([normalized_site_language]),
            )
        )
    )


def get_blog_post(
    db: Session,
    post_id: int,
    *,
    site_language: str | None = None,
) -> dict[str, object] | None:
    post = db.scalar(
        select(BlogPost)
        .where(BlogPost.id == post_id)
        .options(
            selectinload(BlogPost.tags),
        )
    )

    if post is None:
        return None
    if is_post_disabled(post, site_language):
        return None

    return serialize_post_detail(db, post, site_language)


def get_blog_posts(
    db: Session,
    *,
    site_language: str | None = None,
    keyword: str | None = None,
    page: int = 1,
    page_size: int = 10,
) -> dict[str, object]:
    normalized_page = max(page, 1)
    normalized_page_size = min(max(page_size, 1), 100)

    base_statement = select(BlogPost)
    base_statement = _apply_disable_filter(base_statement, site_language)
    base_statement = _apply_search_filter(base_statement, keyword)

    total = db.scalar(select(func.count()).select_from(base_statement.distinct().subquery())) or 0
    posts = db.scalars(
        base_statement.options(
            selectinload(BlogPost.tags),
        )
        .distinct()
        .order_by(BlogPost.is_featured.desc(), BlogPost.updated_at.desc(), BlogPost.id.desc())
        .offset((normalized_page - 1) * normalized_page_size)
        .limit(normalized_page_size)
    ).all()

    return {
        "posts": [serialize_post_list_item(db, post, site_language) for post in posts],
        "total": total,
        "page": normalized_page,
        "page_size": normalized_page_size,
        "total_pages": ceil(total / normalized_page_size) if total else 0,
    }
