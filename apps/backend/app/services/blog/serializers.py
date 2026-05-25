from app.models.blog import BlogPost, BlogTag
from app.models.site_language import SiteLanguage


def serialize_language(language: SiteLanguage | None) -> dict[str, object] | None:
    if language is None:
        return None

    return {
        "id": language.id,
        "code": language.code,
        "name": language.name,
    }


def serialize_tag(tag: BlogTag) -> dict[str, object]:
    return {
        "id": tag.id,
        "name": tag.name,
        "display_name": tag.display_name,
    }


def serialize_post_list_item(post: BlogPost) -> dict[str, object]:
    locale = post.language.code if post.language else None

    return {
        "id": post.id,
        "url": f"/posts/{post.id}",
        "title": post.title,
        "description": post.description,
        "is_featured": post.is_featured,
        "featured": post.is_featured,
        "locale": locale,
        "language": serialize_language(post.language),
        "tags": [tag.display_name or tag.name for tag in post.tags],
        "created_at": post.created_at,
        "updated_at": post.updated_at,
    }


def serialize_post_detail(post: BlogPost) -> dict[str, object]:
    return {
        **serialize_post_list_item(post),
        "content": post.content,
    }
