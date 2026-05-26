from sqlalchemy import delete, select
from sqlalchemy.engine import CursorResult
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from sqlalchemy.orm import Session

from app.models.blog import BlogTag
from app.models.dictionary import Dictionary
from app.schemas.blog_tags import BlogTagCreateRequest, BlogTagUpdateRequest


class BlogTagAlreadyExistsError(RuntimeError):
    def __init__(self, duplicated_tags: list[dict[str, object]]) -> None:
        self.duplicated_tags = duplicated_tags
        super().__init__("Blog tag already exists")


class BlogTagIdsNotFoundError(RuntimeError):
    def __init__(self, tag_ids: list[int]) -> None:
        self.tag_ids = tag_ids
        super().__init__(f"Blog tag ids not found: {tag_ids}")


class BlogTagDeleteFailedError(RuntimeError):
    def __init__(self, tag_ids: list[int]) -> None:
        self.tag_ids = tag_ids
        super().__init__(f"Blog tag delete failed: {tag_ids}")


def normalize_translations(translations: dict[str, str]) -> dict[str, str]:
    return {key.strip(): value.strip() for key, value in translations.items() if key.strip()}


def get_blog_tag_dictionary_key(key: str) -> str:
    return key.strip()


def get_blog_tag_dictionaries(db: Session, keys: list[str]) -> dict[str, Dictionary]:
    unique_keys = sorted({key.strip() for key in keys if key.strip()})
    if not unique_keys:
        return {}

    dictionaries = db.scalars(
        select(Dictionary).where(Dictionary.key.in_(unique_keys))
    ).all()
    return {dictionary.key: dictionary for dictionary in dictionaries}


def get_blog_tag_translations(db: Session, keys: list[str]) -> dict[str, dict[str, object]]:
    dictionaries_by_key = get_blog_tag_dictionaries(db, keys)
    return {
        key: dictionary.values
        for key, dictionary in dictionaries_by_key.items()
        if isinstance(dictionary.values, dict)
    }


def get_blog_tags(db: Session) -> list[dict[str, object]]:
    tags = list(db.scalars(select(BlogTag).order_by(BlogTag.id.asc())).all())
    translations_by_key = get_blog_tag_translations(db, [tag.key for tag in tags])

    return [
        {
            "id": tag.id,
            "key": tag.key,
            "translations": translations_by_key.get(tag.key, {}),
            "created_at": tag.created_at,
            "updated_at": tag.updated_at,
        }
        for tag in tags
    ]


def _build_blog_tag_payloads_for_keys(db: Session, keys: list[str]) -> list[dict[str, object]]:
    tags = list(db.scalars(select(BlogTag).where(BlogTag.key.in_(keys))).all())
    return _build_blog_tag_payloads(db, tags)


def _build_blog_tag_payloads(db: Session, tags: list[BlogTag]) -> list[dict[str, object]]:
    translations_by_key = get_blog_tag_translations(db, [tag.key for tag in tags])
    return [
        {
            "id": tag.id,
            "key": tag.key,
            "translations": translations_by_key.get(tag.key, {}),
            "created_at": tag.created_at,
            "updated_at": tag.updated_at,
        }
        for tag in tags
    ]


def _build_duplicated_request_payloads(keys: list[str]) -> list[dict[str, object]]:
    return [
        {
            "id": None,
            "key": key,
            "translations": {},
            "created_at": None,
            "updated_at": None,
        }
        for key in sorted(keys)
    ]


def upsert_blog_tags(db: Session, payloads: list[BlogTagCreateRequest]) -> list[dict[str, object]]:
    result_tags: list[BlogTag] = []
    normalized_payloads = [
        (get_blog_tag_dictionary_key(payload.key), normalize_translations(payload.translations))
        for payload in payloads
    ]
    seen_keys: set[str] = set()
    duplicated_request_keys: set[str] = set()
    for key, _translations in normalized_payloads:
        if key in seen_keys:
            duplicated_request_keys.add(key)
        seen_keys.add(key)

    if duplicated_request_keys:
        raise BlogTagAlreadyExistsError(
            _build_duplicated_request_payloads(list(duplicated_request_keys))
        )

    existing_tags = list(
        db.scalars(
            select(BlogTag).where(
                BlogTag.key.in_([key for key, _translations in normalized_payloads])
            )
        ).all()
    )
    if existing_tags:
        raise BlogTagAlreadyExistsError(_build_blog_tag_payloads(db, existing_tags))

    for normalized_key, translations in normalized_payloads:
        tag = BlogTag(key=normalized_key)
        db.add(tag)

        dictionary = db.scalar(select(Dictionary).where(Dictionary.key == normalized_key))
        if dictionary is None:
            dictionary = Dictionary(key=normalized_key, values={})
            db.add(dictionary)
        dictionary.values = translations
        result_tags.append(tag)

    try:
        db.commit()
    except IntegrityError as error:
        db.rollback()
        duplicated_tags = _build_blog_tag_payloads_for_keys(
            db,
            [key for key, _translations in normalized_payloads],
        )
        raise BlogTagAlreadyExistsError(duplicated_tags) from error

    tag_ids = [tag.id for tag in result_tags]
    return [tag for tag in get_blog_tags(db) if tag["id"] in tag_ids]


def update_blog_tag(
    db: Session,
    tag_id: int,
    payload: BlogTagUpdateRequest,
) -> dict[str, object] | None:
    tag = db.get(BlogTag, tag_id)
    if tag is None:
        return None

    data = payload.model_dump(exclude_unset=True)
    key = data.pop("key", None)
    translations = data.pop("translations", None)
    old_key = tag.key

    if key is not None:
        tag.key = get_blog_tag_dictionary_key(key)

    dictionary = db.scalar(select(Dictionary).where(Dictionary.key == old_key))
    if dictionary is None:
        dictionary = Dictionary(key=tag.key, values={})
        db.add(dictionary)
    else:
        dictionary.key = tag.key

    if translations is not None:
        dictionary.values = normalize_translations(translations)

    try:
        db.commit()
    except IntegrityError as error:
        db.rollback()
        duplicated_tags = _build_blog_tag_payloads_for_keys(db, [tag.key])
        raise BlogTagAlreadyExistsError(duplicated_tags) from error

    result = [item for item in get_blog_tags(db) if item["id"] == tag_id]
    return result[0] if result else None


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
