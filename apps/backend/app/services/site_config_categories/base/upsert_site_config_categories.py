from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models.site_config_category import SiteConfigCategory
from app.schemas.site_config_categories import SiteConfigCategoryCreateRequest
from app.services.site_config_categories.base.exceptions import (
    SiteConfigCategoryAlreadyExistsError,
    SiteConfigCategoryParentNotFoundError,
)


def upsert_site_config_categories(
    db: Session,
    payloads: list[SiteConfigCategoryCreateRequest],
) -> list[SiteConfigCategory]:
    normalized_keys = [payload.key.strip() for payload in payloads]
    if len(set(normalized_keys)) != len(normalized_keys):
        raise SiteConfigCategoryAlreadyExistsError("Duplicated site config category keys")

    existing_category = db.scalar(
        select(SiteConfigCategory).where(SiteConfigCategory.key.in_(normalized_keys)).limit(1)
    )
    if existing_category is not None:
        raise SiteConfigCategoryAlreadyExistsError("Site config category already exists")

    parent_ids = {payload.parent_id for payload in payloads if payload.parent_id is not None}
    if parent_ids:
        existing_parent_ids = set(
            db.scalars(
                select(SiteConfigCategory.id).where(SiteConfigCategory.id.in_(parent_ids))
            ).all()
        )
        if existing_parent_ids != parent_ids:
            raise SiteConfigCategoryParentNotFoundError("Parent site config category not found")

    categories: list[SiteConfigCategory] = []
    for payload, normalized_key in zip(payloads, normalized_keys, strict=True):
        category = SiteConfigCategory(
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
        raise SiteConfigCategoryAlreadyExistsError(
            "Site config category already exists"
        ) from error

    for category in categories:
        db.refresh(category)

    return categories
