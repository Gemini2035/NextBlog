from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models.locale import Locale
from app.models.static_content import StaticContent
from app.models.static_content_category import StaticContentCategory
from app.schemas.static_content import StaticContentUpdateRequest, StaticContentUpsertByKeyRequest
from app.services.static_content.base.create_static_content import (
    StaticContentAlreadyExistsError,
    StaticContentCategoryNotFoundError,
    StaticContentLocaleNotFoundError,
)


def update_static_content(
    db: Session,
    content_id: int,
    payload: StaticContentUpdateRequest,
) -> StaticContent | None:
    content = db.get(StaticContent, content_id)
    if content is None:
        return None

    data = payload.model_dump(exclude_unset=True)
    if "category_id" in data and db.get(StaticContentCategory, data["category_id"]) is None:
        raise StaticContentCategoryNotFoundError("Static content category not found")

    if "locale_id" in data:
        locale_id = data["locale_id"]
        if locale_id is not None and db.get(Locale, locale_id) is None:
            raise StaticContentLocaleNotFoundError("Locale not found")

    for key, value in data.items():
        if isinstance(value, str):
            value = value.strip()
        setattr(content, key, value)

    try:
        db.commit()
    except IntegrityError as error:
        db.rollback()
        raise StaticContentAlreadyExistsError("Static content already exists") from error

    db.refresh(content)
    return content


def upsert_static_content_by_key(
    db: Session,
    payload: StaticContentUpsertByKeyRequest,
) -> StaticContent:
    if db.get(StaticContentCategory, payload.category_id) is None:
        raise StaticContentCategoryNotFoundError("Static content category not found")

    if payload.locale_id is not None and db.get(Locale, payload.locale_id) is None:
        raise StaticContentLocaleNotFoundError("Locale not found")

    statement = select(StaticContent).where(
        StaticContent.category_id == payload.category_id,
        StaticContent.key == payload.key.strip(),
    )
    if payload.locale_id is None:
        statement = statement.where(StaticContent.locale_id.is_(None))
    else:
        statement = statement.where(StaticContent.locale_id == payload.locale_id)

    content = db.scalar(statement)

    data = payload.model_dump(exclude_unset=True)
    description = data.get("description")
    if isinstance(description, str):
        data["description"] = description.strip() or None

    if content is None:
        content = StaticContent(
            category_id=payload.category_id,
            key=payload.key.strip(),
            locale_id=payload.locale_id,
            content=payload.content,
            description=data.get("description"),
            is_enabled=data.get("is_enabled", True),
            sort_order=data.get("sort_order", 0),
        )
        db.add(content)
    else:
        for key, value in data.items():
            if key == "key":
                continue
            setattr(content, key, value)

    try:
        db.commit()
    except IntegrityError as error:
        db.rollback()
        raise StaticContentAlreadyExistsError("Static content already exists") from error

    db.refresh(content)
    return content
