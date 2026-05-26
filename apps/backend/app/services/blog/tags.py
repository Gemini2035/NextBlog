from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.blog import BlogTag


class InvalidBlogTagIdsError(RuntimeError):
    def __init__(self, tag_ids: list[int]) -> None:
        self.tag_ids = tag_ids
        super().__init__(f"Invalid blog tag ids: {tag_ids}")


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
