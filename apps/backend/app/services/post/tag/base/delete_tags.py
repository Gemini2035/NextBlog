from sqlalchemy import delete, select
from sqlalchemy.engine import CursorResult
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.models.post import PostTag
from app.models.dictionary import Dictionary
from app.services.post.tag.base.exceptions import (
    PostTagDeleteFailedError,
    PostTagIdsNotFoundError,
)


def delete_post_tags(db: Session, tag_ids: list[int]) -> int:
    unique_tag_ids = sorted(set(tag_ids))
    existing_ids = set(db.scalars(select(PostTag.id).where(PostTag.id.in_(unique_tag_ids))).all())
    missing_ids = [tag_id for tag_id in unique_tag_ids if tag_id not in existing_ids]
    if missing_ids:
        raise PostTagIdsNotFoundError(missing_ids)

    dictionary_ids = list(
        db.scalars(select(PostTag.dictionary_id).where(PostTag.id.in_(unique_tag_ids))).all()
    )

    try:
        result = db.execute(delete(PostTag).where(PostTag.id.in_(unique_tag_ids)))
        result_rowcount = result.rowcount if isinstance(result, CursorResult) else 0
        if result_rowcount != len(unique_tag_ids):
            db.rollback()
            raise PostTagDeleteFailedError(tag_ids)
        db.execute(delete(Dictionary).where(Dictionary.id.in_(dictionary_ids)))
        db.commit()
    except PostTagDeleteFailedError:
        raise
    except SQLAlchemyError as error:
        db.rollback()
        raise PostTagDeleteFailedError(tag_ids) from error

    return result_rowcount or 0
