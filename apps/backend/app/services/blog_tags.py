from sqlalchemy import delete, select
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from sqlalchemy.orm import Session

from app.models.blog import BlogTag
from app.schemas.blog_tags import BlogTagCreateRequest, BlogTagUpdateRequest


class BlogTagAlreadyExistsError(RuntimeError):
    pass


class BlogTagIdsNotFoundError(RuntimeError):
    def __init__(self, tag_ids: list[int]) -> None:
        self.tag_ids = tag_ids
        super().__init__(f"Blog tag ids not found: {tag_ids}")


class BlogTagDeleteFailedError(RuntimeError):
    def __init__(self, tag_ids: list[int]) -> None:
        self.tag_ids = tag_ids
        super().__init__(f"Blog tag delete failed: {tag_ids}")


def _normalize_name(name: str) -> str:
    return name.strip()


def _normalize_display_name(display_name: str | None) -> str | None:
    normalized = display_name.strip() if display_name else ""
    return normalized or None


def get_blog_tags(db: Session) -> list[BlogTag]:
    return list(db.scalars(select(BlogTag).order_by(BlogTag.id.asc())).all())


def upsert_blog_tags(db: Session, payloads: list[BlogTagCreateRequest]) -> list[BlogTag]:
    normalized_payloads = [
        (
            _normalize_name(payload.name),
            _normalize_display_name(payload.display_name),
        )
        for payload in payloads
    ]
    names = [name for name, _ in normalized_payloads]
    existing_tags = list(db.scalars(select(BlogTag).where(BlogTag.name.in_(names))).all())
    tags_by_name = {tag.name: tag for tag in existing_tags}
    result_tags: list[BlogTag] = []

    for name, display_name in normalized_payloads:
        tag = tags_by_name.get(name)
        if tag is None:
            tag = BlogTag(name=name, display_name=display_name)
            db.add(tag)
            tags_by_name[name] = tag
        else:
            tag.display_name = display_name

        result_tags.append(tag)

    try:
        db.commit()
    except IntegrityError as error:
        db.rollback()
        raise BlogTagAlreadyExistsError("Blog tag already exists") from error

    for tag in result_tags:
        db.refresh(tag)

    return result_tags


def update_blog_tag(
    db: Session,
    tag_id: int,
    payload: BlogTagUpdateRequest,
) -> BlogTag | None:
    tag = db.get(BlogTag, tag_id)
    if tag is None:
        return None

    data = payload.model_dump(exclude_unset=True)
    if "name" in data:
        tag.name = _normalize_name(data["name"])
    if "display_name" in data:
        tag.display_name = _normalize_display_name(data["display_name"])

    try:
        db.commit()
    except IntegrityError as error:
        db.rollback()
        raise BlogTagAlreadyExistsError("Blog tag already exists") from error

    db.refresh(tag)
    return tag


def delete_blog_tags(db: Session, tag_ids: list[int]) -> int:
    unique_tag_ids = sorted(set(tag_ids))
    existing_ids = set(db.scalars(select(BlogTag.id).where(BlogTag.id.in_(unique_tag_ids))).all())
    missing_ids = [tag_id for tag_id in unique_tag_ids if tag_id not in existing_ids]
    if missing_ids:
        raise BlogTagIdsNotFoundError(missing_ids)

    try:
        result = db.execute(delete(BlogTag).where(BlogTag.id.in_(unique_tag_ids)))
        if result.rowcount != len(unique_tag_ids):
            db.rollback()
            raise BlogTagDeleteFailedError(tag_ids)
        db.commit()
    except BlogTagDeleteFailedError:
        raise
    except SQLAlchemyError as error:
        db.rollback()
        raise BlogTagDeleteFailedError(tag_ids) from error

    return result.rowcount or 0
