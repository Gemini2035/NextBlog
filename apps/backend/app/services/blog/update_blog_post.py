from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.integrations.llm import OpenAIClient
from app.models.blog import BlogPost
from app.schemas.blog import BlogPostWriteRequest
from app.services.blog.create_blog_post import BlogPostWriteError
from app.services.blog.embeddings import upsert_blog_post_embedding
from app.services.blog.tags import get_blog_tags_by_ids


def update_blog_post(
    db: Session,
    post_id: int,
    payload: BlogPostWriteRequest,
) -> tuple[BlogPost, bool] | None:
    post = db.get(BlogPost, post_id)
    if post is None:
        return None

    data = payload.basic_info.model_dump(exclude_unset=True)
    tag_ids = data.pop("tag_ids", None)

    if payload.content is not None:
        post.content = payload.content.strip()

    for key, value in data.items():
        if isinstance(value, str):
            value = value.strip()
        setattr(post, key, value)

    if tag_ids is not None:
        post.tags = get_blog_tags_by_ids(db, tag_ids)

    llm_client = OpenAIClient()
    try:
        db.flush()
        embedding_updated = upsert_blog_post_embedding(db, post, llm_client)
        db.commit()
    except IntegrityError as error:
        db.rollback()
        raise BlogPostWriteError("Blog post write failed") from error
    finally:
        llm_client.close()

    db.refresh(post)
    return post, embedding_updated
