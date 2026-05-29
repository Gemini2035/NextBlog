from sqlalchemy import delete, select
from sqlalchemy.engine import CursorResult
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.models.post import POST_EMBEDDING_SOURCE_TYPE, Post
from app.models.embedding import Embedding
from app.services.post.utils.public_ids import decode_post_id


class InvalidPostIdsError(RuntimeError):
    def __init__(self, post_ids: list[str]) -> None:
        self.post_ids = post_ids
        super().__init__(f"Invalid post ids: {post_ids}")


class PostIdsNotFoundError(RuntimeError):
    def __init__(self, post_ids: list[str]) -> None:
        self.post_ids = post_ids
        super().__init__(f"Post ids not found: {post_ids}")


class PostDeleteFailedError(RuntimeError):
    def __init__(self, post_ids: list[str]) -> None:
        self.post_ids = post_ids
        super().__init__(f"Post delete failed: {post_ids}")


def _decode_unique_post_ids(post_ids: list[str]) -> tuple[list[int], dict[int, str]]:
    internal_ids: list[int] = []
    public_ids_by_internal_id: dict[int, str] = {}
    invalid_post_ids: list[str] = []

    for post_id in post_ids:
        try:
            internal_id = decode_post_id(post_id)
        except ValueError:
            invalid_post_ids.append(post_id)
            continue

        if internal_id not in public_ids_by_internal_id:
            internal_ids.append(internal_id)
            public_ids_by_internal_id[internal_id] = post_id

    if invalid_post_ids:
        raise InvalidPostIdsError(invalid_post_ids)

    return internal_ids, public_ids_by_internal_id


def delete_posts(db: Session, post_ids: list[str]) -> int:
    internal_ids, public_ids_by_internal_id = _decode_unique_post_ids(post_ids)
    if not internal_ids:
        return 0

    existing_ids = set(
        db.scalars(select(Post.id).where(Post.id.in_(internal_ids))).all()
    )
    missing_public_ids = [
        public_ids_by_internal_id[internal_id]
        for internal_id in internal_ids
        if internal_id not in existing_ids
    ]
    if missing_public_ids:
        raise PostIdsNotFoundError(missing_public_ids)

    try:
        db.execute(
            delete(Embedding).where(
                Embedding.source_type == POST_EMBEDDING_SOURCE_TYPE,
                Embedding.source_id.in_([str(internal_id) for internal_id in internal_ids]),
            )
        )
        result = db.execute(delete(Post).where(Post.id.in_(internal_ids)))
        result_rowcount = result.rowcount if isinstance(result, CursorResult) else 0
        if result_rowcount != len(internal_ids):
            db.rollback()
            raise PostDeleteFailedError(post_ids)

        db.commit()
    except PostDeleteFailedError:
        raise
    except SQLAlchemyError as error:
        db.rollback()
        raise PostDeleteFailedError(post_ids) from error

    return result_rowcount or 0
