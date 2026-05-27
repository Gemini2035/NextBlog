from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.integrations.llm import OpenAIClient
from app.models.blog import BlogPost
from app.schemas.blog import BlogPostWriteRequest
from app.services.blog.post.base.create_post import BlogPostWriteError
from app.services.blog.post.utils.embeddings import upsert_blog_post_embedding
from app.services.blog.post.utils.translations import ensure_blog_translation
from app.services.blog.tag.base.get_tags import get_blog_tags_by_ids


def update_blog_post(
    db: Session,
    post_id: int,
    payload: BlogPostWriteRequest,
) -> tuple[BlogPost, bool] | None:
    post = db.get(BlogPost, post_id)
    if post is None:
        return None

    data = payload.model_dump(exclude_unset=True)
    content = data.pop("content", None)
    tag_ids = data.pop("tag_ids", None)

    if content is not None:
        post.content = content.strip()

    if "title" in data:
        title_payload = data.pop("title")
        if title_payload is not None:
            post.title_key = ensure_blog_translation(
                db,
                key=title_payload["key"],
                translations=title_payload["value"],
            )

    if "description" in data:
        description_payload = data.pop("description")
        if description_payload is not None:
            post.description_key = ensure_blog_translation(
                db,
                key=description_payload["key"],
                translations=description_payload["value"],
            )

    for key, value in data.items():
        if isinstance(value, str):
            value = value.strip()
        if key == "disable" and isinstance(value, list):
            value = [language.strip() for language in value if isinstance(language, str) and language.strip()]
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
