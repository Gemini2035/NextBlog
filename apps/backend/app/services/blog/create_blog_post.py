from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.integrations.llm import OpenAIClient
from app.models.blog import BlogPost
from app.schemas.blog import BlogPostCreateRequest
from app.services.blog.embeddings import upsert_blog_post_embedding
from app.services.blog.tags import get_blog_tags_by_ids


class BlogPostWriteError(RuntimeError):
    pass


def create_blog_post(db: Session, payload: BlogPostCreateRequest) -> tuple[BlogPost, bool]:
    basic_info = payload.basic_info
    post = BlogPost(
        language_id=basic_info.language_id,
        title=basic_info.title.strip(),
        description=basic_info.description.strip() if basic_info.description else None,
        content=payload.content.strip(),
        is_featured=basic_info.is_featured,
    )
    post.tags = get_blog_tags_by_ids(db, basic_info.tag_ids)
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
