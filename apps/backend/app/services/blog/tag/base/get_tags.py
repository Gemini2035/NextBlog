from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.blog import BlogTag
from app.services.blog.tag.base.exceptions import InvalidBlogTagIdsError
from app.services.blog.tag.utils.helpers import build_blog_tag_payloads


def get_blog_tags(db: Session) -> list[dict[str, object]]:
    tags = list(db.scalars(select(BlogTag).order_by(BlogTag.id.asc())).all())
    return build_blog_tag_payloads(db, tags)


def get_blog_tags_by_ids(db: Session, tag_ids: list[int]) -> list[BlogTag]:
    unique_tag_ids = sorted(set(tag_ids))
    if not unique_tag_ids:
        return []

    tags = list(db.scalars(select(BlogTag).where(BlogTag.id.in_(unique_tag_ids))).all())
    found_ids = {tag.id for tag in tags}
    missing_ids = [tag_id for tag_id in unique_tag_ids if tag_id not in found_ids]
    if missing_ids:
        raise InvalidBlogTagIdsError(missing_ids)

    tags_by_id = {tag.id: tag for tag in tags}
    return [tags_by_id[tag_id] for tag_id in unique_tag_ids]
