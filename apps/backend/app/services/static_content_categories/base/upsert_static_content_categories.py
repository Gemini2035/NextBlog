from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models.static_content_category import StaticContentCategory
from app.schemas.static_content_categories import StaticContentCategoryCreateRequest
from app.services.static_content_categories.base.exceptions import (
    StaticContentCategoryAlreadyExistsError,
    StaticContentCategoryParentNotFoundError,
)


def upsert_static_content_categories(
    db: Session,
    payloads: list[StaticContentCategoryCreateRequest],
) -> list[StaticContentCategory]:
    normalized_keys = [payload.key.strip() for payload in payloads]
    if len(set(normalized_keys)) != len(normalized_keys):
        raise StaticContentCategoryAlreadyExistsError("Duplicated static content category keys")

    existing_category = db.scalar(
        select(StaticContentCategory).where(StaticContentCategory.key.in_(normalized_keys)).limit(1)
    )
    if existing_category is not None:
        raise StaticContentCategoryAlreadyExistsError("Static content category already exists")

    parent_ids = {payload.parent_id for payload in payloads if payload.parent_id is not None}
    if parent_ids:
        existing_parent_ids = set(
            db.scalars(
                select(StaticContentCategory.id).where(StaticContentCategory.id.in_(parent_ids))
            ).all()
        )
        if existing_parent_ids != parent_ids:
            raise StaticContentCategoryParentNotFoundError(
                "Parent static content category not found"
            )

    categories: list[StaticContentCategory] = []
    for payload, normalized_key in zip(payloads, normalized_keys, strict=True):
        category = StaticContentCategory(
            parent_id=payload.parent_id,
            key=normalized_key,
            sort_order=payload.sort_order,
        )
        db.add(category)
        categories.append(category)

    try:
        db.commit()
    except IntegrityError as error:
        db.rollback()
        raise StaticContentCategoryAlreadyExistsError(
            "Static content category already exists"
        ) from error

    for category in categories:
        db.refresh(category)

    return categories
