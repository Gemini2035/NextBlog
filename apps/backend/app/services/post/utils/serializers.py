from sqlalchemy.orm import Session

from app.models.post import Post
from app.services.post.utils.public_ids import encode_post_id
from app.services.post.utils.translations import resolve_dictionary_value


def get_post_tag_dictionary_key(key: str) -> str:
    return key


def _resolve_tag_label(db: Session, tag: object, locale: str | None) -> str:
    dictionary = getattr(tag, "dictionary", None)
    dictionary_key = getattr(dictionary, "key", None) or getattr(tag, "key", "")
    value = resolve_dictionary_value(db, dictionary_key, locale)
    return value or get_post_tag_dictionary_key(getattr(tag, "key", ""))


def serialize_post_list_item(
    db: Session,
    post: Post,
    locale: str | None = None,
) -> dict[str, object]:
    return {
        "id": encode_post_id(post.id),
        "url": f"/post/{encode_post_id(post.id)}",
        "title": resolve_dictionary_value(db, post.title_key, locale) or "",
        "description": resolve_dictionary_value(db, post.description_key, locale),
        "is_featured": post.is_featured,
        "featured": post.is_featured,
        "disable": post.disable,
        "tags": [_resolve_tag_label(db, tag, locale) for tag in post.tags],
        "created_at": post.created_at,
        "updated_at": post.updated_at,
    }


def serialize_post_detail(
    db: Session,
    post: Post,
    locale: str | None = None,
) -> dict[str, object]:
    return {
        **serialize_post_list_item(db, post, locale),
        "content": post.content,
    }
