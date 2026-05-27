from sqlalchemy import delete, select
from sqlalchemy.engine import CursorResult
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.models.blog import BlogTag
from app.models.dictionary import Dictionary
from app.services.blog.tag.base.exceptions import (
    BlogTagDeleteFailedError,
    BlogTagIdsNotFoundError,
)


def delete_blog_tags(db: Session, tag_ids: list[int]) -> int:
    unique_tag_ids = sorted(set(tag_ids))
    existing_ids = set(db.scalars(select(BlogTag.id).where(BlogTag.id.in_(unique_tag_ids))).all())
    missing_ids = [tag_id for tag_id in unique_tag_ids if tag_id not in existing_ids]
    if missing_ids:
        raise BlogTagIdsNotFoundError(missing_ids)

    keys = list(db.scalars(select(BlogTag.key).where(BlogTag.id.in_(unique_tag_ids))).all())

    try:
        db.execute(delete(Dictionary).where(Dictionary.key.in_(keys)))
        result = db.execute(delete(BlogTag).where(BlogTag.id.in_(unique_tag_ids)))
        result_rowcount = result.rowcount if isinstance(result, CursorResult) else 0
        if result_rowcount != len(unique_tag_ids):
            db.rollback()
            raise BlogTagDeleteFailedError(tag_ids)
        db.commit()
    except BlogTagDeleteFailedError:
        raise
    except SQLAlchemyError as error:
        db.rollback()
        raise BlogTagDeleteFailedError(tag_ids) from error

    return result_rowcount or 0
