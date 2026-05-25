from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.models.blog import BlogPost
from app.services.blog.serializers import serialize_post_detail


def get_blog_post(db: Session, post_id: int) -> dict[str, object] | None:
    post = db.scalar(
        select(BlogPost)
        .where(BlogPost.id == post_id)
        .options(
            selectinload(BlogPost.language),
            selectinload(BlogPost.tags),
        )
    )

    if post is None:
        return None

    return serialize_post_detail(post)
