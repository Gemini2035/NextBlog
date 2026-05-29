from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.integrations.llm import OpenAIClient
from app.models.post import Post
from app.schemas.post import PostCreateRequest
from app.services.post.utils.embeddings import upsert_post_embedding
from app.services.post.utils.translations import ensure_post_translation
from app.services.post.tag.base.get_tags import get_post_tags_by_ids


class PostWriteError(RuntimeError):
    pass


def create_post(db: Session, payload: PostCreateRequest) -> tuple[Post, bool]:
    title_key = ensure_post_translation(
        db,
        key=payload.title.key,
        translations=payload.title.value,
    )
    description_key = ensure_post_translation(
        db,
        key=payload.description.key,
        translations=payload.description.value,
    ) if payload.description else None

    post = Post(
        title_key=title_key,
        description_key=description_key,
        content=payload.content.strip(),
        is_featured=payload.is_featured,
        disable=[locale.strip() for locale in payload.disable if locale.strip()],
    )
    post.tags = get_post_tags_by_ids(db, payload.tag_ids)
    db.add(post)

    llm_client = OpenAIClient()
    try:
        db.flush()
        embedding_updated = upsert_post_embedding(db, post, llm_client)
        db.commit()
    except IntegrityError as error:
        db.rollback()
        raise PostWriteError("Post write failed") from error
    finally:
        llm_client.close()

    db.refresh(post)
    return post, embedding_updated
