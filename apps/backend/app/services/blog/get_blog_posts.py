from math import ceil

from sqlalchemy import Select, func, or_, select
from sqlalchemy.orm import Session, selectinload

from app.models.blog import BlogPost, BlogTag
from app.models.site_language import SiteLanguage
from app.services.blog.serializers import serialize_post_list_item


def _apply_language_filter(statement: Select[tuple[BlogPost]], locale: str | None) -> Select[tuple[BlogPost]]:
    if not locale:
        return statement

    return statement.join(BlogPost.language).where(SiteLanguage.code == locale)


def _apply_search_filter(statement: Select[tuple[BlogPost]], keyword: str | None) -> Select[tuple[BlogPost]]:
    normalized_keyword = keyword.strip() if keyword else ""
    if not normalized_keyword:
        return statement

    pattern = f"%{normalized_keyword}%"
    return statement.outerjoin(BlogPost.tags).where(
        or_(
            BlogPost.title.ilike(pattern),
            BlogPost.description.ilike(pattern),
            BlogPost.content.ilike(pattern),
            BlogTag.name.ilike(pattern),
            BlogTag.display_name.ilike(pattern),
        )
    )


def get_blog_posts(
    db: Session,
    *,
    locale: str | None = None,
    keyword: str | None = None,
    page: int = 1,
    page_size: int = 10,
) -> dict[str, object]:
    normalized_page = max(page, 1)
    normalized_page_size = min(max(page_size, 1), 100)

    base_statement = select(BlogPost)
    base_statement = _apply_language_filter(base_statement, locale)
    base_statement = _apply_search_filter(base_statement, keyword)

    total = db.scalar(select(func.count()).select_from(base_statement.distinct().subquery())) or 0
    posts = db.scalars(
        base_statement.options(
            selectinload(BlogPost.language),
            selectinload(BlogPost.tags),
        )
        .distinct()
        .order_by(BlogPost.is_featured.desc(), BlogPost.updated_at.desc(), BlogPost.id.desc())
        .offset((normalized_page - 1) * normalized_page_size)
        .limit(normalized_page_size)
    ).all()

    return {
        "posts": [serialize_post_list_item(post) for post in posts],
        "total": total,
        "page": normalized_page,
        "page_size": normalized_page_size,
        "total_pages": ceil(total / normalized_page_size) if total else 0,
    }
