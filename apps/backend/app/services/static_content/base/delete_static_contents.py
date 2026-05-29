from sqlalchemy import delete, select
from sqlalchemy.engine import CursorResult
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.models.static_content import StaticContent


class StaticContentIdsNotFoundError(RuntimeError):
    def __init__(self, content_ids: list[int]) -> None:
        self.content_ids = content_ids
        super().__init__(f"Static content ids not found: {content_ids}")


class StaticContentDeleteFailedError(RuntimeError):
    def __init__(self, content_ids: list[int]) -> None:
        self.content_ids = content_ids
        super().__init__(f"Static content delete failed: {content_ids}")


def delete_static_contents(db: Session, content_ids: list[int]) -> int:
    unique_ids = sorted(set(content_ids))
    existing_ids = set(
        db.scalars(select(StaticContent.id).where(StaticContent.id.in_(unique_ids))).all()
    )
    missing_ids = [content_id for content_id in unique_ids if content_id not in existing_ids]
    if missing_ids:
        raise StaticContentIdsNotFoundError(missing_ids)

    try:
        result = db.execute(delete(StaticContent).where(StaticContent.id.in_(unique_ids)))
        rowcount = result.rowcount if isinstance(result, CursorResult) else 0
        if rowcount != len(unique_ids):
            db.rollback()
            raise StaticContentDeleteFailedError(content_ids)
        db.commit()
    except StaticContentDeleteFailedError:
        raise
    except SQLAlchemyError as error:
        db.rollback()
        raise StaticContentDeleteFailedError(content_ids) from error

    return rowcount or 0
