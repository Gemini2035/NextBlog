from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.integrations.llm import OpenAIClient
from app.models.blog import BlogPost
from app.schemas.blog import BlogPostCreateRequest
from app.services.blog.post.utils.embeddings import upsert_blog_post_embedding
from app.services.blog.post.utils.translations import ensure_blog_translation
from app.services.blog.tag.base.get_tags import get_blog_tags_by_ids


class BlogPostWriteError(RuntimeError):
    pass


def create_blog_post(db: Session, payload: BlogPostCreateRequest) -> tuple[BlogPost, bool]:
    title_key = ensure_blog_translation(
        db,
        key=payload.title.key,
        translations=payload.title.value,
    )
    description_key = ensure_blog_translation(
        db,
        key=payload.description.key,
        translations=payload.description.value,
    ) if payload.description else None

    post = BlogPost(
        title_key=title_key,
        description_key=description_key,
        content=payload.content.strip(),
        is_featured=payload.is_featured,
        disable=[language.strip() for language in payload.disable if language.strip()],
    )
    post.tags = get_blog_tags_by_ids(db, payload.tag_ids)
    db.add(post)

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
