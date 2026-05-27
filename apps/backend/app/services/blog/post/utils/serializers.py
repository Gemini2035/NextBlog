from sqlalchemy.orm import Session

from app.models.blog import BlogPost
from app.services.blog.post.utils.public_ids import encode_blog_post_id
from app.services.blog.post.utils.translations import resolve_dictionary_value


def get_blog_tag_dictionary_key(key: str) -> str:
    return key


def _resolve_dictionary_label(key: str) -> str:
    return get_blog_tag_dictionary_key(key)


def serialize_post_list_item(
    db: Session,
    post: BlogPost,
    site_language: str | None = None,
) -> dict[str, object]:
    return {
        "id": encode_blog_post_id(post.id),
        "url": f"/post/{encode_blog_post_id(post.id)}",
        "title": resolve_dictionary_value(db, post.title_key, site_language) or "",
        "description": resolve_dictionary_value(db, post.description_key, site_language),
        "is_featured": post.is_featured,
        "featured": post.is_featured,
        "disable": post.disable,
        "tags": [_resolve_dictionary_label(tag.key) for tag in post.tags],
        "created_at": post.created_at,
        "updated_at": post.updated_at,
    }


def serialize_post_detail(
    db: Session,
    post: BlogPost,
    site_language: str | None = None,
) -> dict[str, object]:
    return {
        **serialize_post_list_item(db, post, site_language),
        "content": post.content,
    }
