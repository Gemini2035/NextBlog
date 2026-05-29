from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.integrations.llm import OpenAIClient
from app.models.post import Post
from app.schemas.post import PostWriteRequest
from app.services.post.base.create_post import PostWriteError
from app.services.post.utils.embeddings import upsert_post_embedding
from app.services.post.utils.translations import ensure_post_translation
from app.services.post.tag.base.get_tags import get_post_tags_by_ids


def update_post(
    db: Session,
    post_id: int,
    payload: PostWriteRequest,
) -> tuple[Post, bool] | None:
    post = db.get(Post, post_id)
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
            post.title_key = ensure_post_translation(
                db,
                key=title_payload["key"],
                translations=title_payload["value"],
            )

    if "description" in data:
        description_payload = data.pop("description")
        if description_payload is not None:
            post.description_key = ensure_post_translation(
                db,
                key=description_payload["key"],
                translations=description_payload["value"],
            )

    for key, value in data.items():
        if isinstance(value, str):
            value = value.strip()
        if key == "disable" and isinstance(value, list):
            value = [locale.strip() for locale in value if isinstance(locale, str) and locale.strip()]
        setattr(post, key, value)

    if tag_ids is not None:
        post.tags = get_post_tags_by_ids(db, tag_ids)

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
