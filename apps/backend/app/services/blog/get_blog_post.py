from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.models.blog import BlogPost
from app.services.blog.serializers import serialize_post_detail


def is_post_disabled(post: BlogPost, site_language: str | None) -> bool:
    disable = post.disable or []
    if "*" in disable:
        return True

    normalized_site_language = site_language.strip() if site_language else ""
    return bool(normalized_site_language and normalized_site_language in disable)


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
