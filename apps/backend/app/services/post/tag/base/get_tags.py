from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.post import PostTag
from app.services.post.tag.base.exceptions import InvalidPostTagIdsError
from app.services.post.tag.utils.helpers import build_post_tag_payloads


def get_post_tags(db: Session) -> list[dict[str, object]]:
    tags = list(db.scalars(select(PostTag).order_by(PostTag.id.asc())).all())
    return build_post_tag_payloads(db, tags)


def get_post_tags_by_ids(db: Session, tag_ids: list[int]) -> list[PostTag]:
    unique_tag_ids = sorted(set(tag_ids))
    if not unique_tag_ids:
        return []

    tags = list(db.scalars(select(PostTag).where(PostTag.id.in_(unique_tag_ids))).all())
    found_ids = {tag.id for tag in tags}
    missing_ids = [tag_id for tag_id in unique_tag_ids if tag_id not in found_ids]
    if missing_ids:
        raise InvalidPostTagIdsError(missing_ids)

    tags_by_id = {tag.id: tag for tag in tags}
    return [tags_by_id[tag_id] for tag_id in unique_tag_ids]
