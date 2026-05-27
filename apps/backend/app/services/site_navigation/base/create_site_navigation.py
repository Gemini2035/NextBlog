from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models.site_navigation import SiteNavigation
from app.schemas.site_navigation import SiteNavigationCreateRequest
from app.services.site_navigation.base.exceptions import (
    SiteNavigationAlreadyExistsError,
    SiteNavigationParentNotFoundError,
)
from app.services.site_navigation.base.get_site_navigation import get_site_navigations
from app.services.site_navigation.utils.helpers import (
    get_site_navigation_description_key,
    get_site_navigation_label_key,
    normalize_navigation_key,
    normalize_translations,
    upsert_dictionary_values,
)


def upsert_site_navigations(
    db: Session,
    payloads: list[SiteNavigationCreateRequest],
) -> list[dict[str, object]]:
    normalized_keys = [normalize_navigation_key(payload.key) for payload in payloads]
    if len(set(normalized_keys)) != len(normalized_keys):
        raise SiteNavigationAlreadyExistsError("Duplicated site navigation keys")

    existing_navigation = db.scalar(
        select(SiteNavigation).where(SiteNavigation.key.in_(normalized_keys)).limit(1)
    )
    if existing_navigation is not None:
        raise SiteNavigationAlreadyExistsError("Site navigation already exists")

    parent_ids = {
        payload.parent_id
        for payload in payloads
        if payload.parent_id is not None
    }
    if parent_ids:
        existing_parent_ids = set(
            db.scalars(select(SiteNavigation.id).where(SiteNavigation.id.in_(parent_ids))).all()
        )
        if existing_parent_ids != parent_ids:
            raise SiteNavigationParentNotFoundError("Parent site navigation not found")

    result_navigations: list[SiteNavigation] = []
    for payload, normalized_key in zip(payloads, normalized_keys, strict=True):
        label_key = get_site_navigation_label_key(normalized_key)
        description_key = (
            get_site_navigation_description_key(normalized_key)
            if payload.description is not None
            else None
        )
        navigation = SiteNavigation(
            parent_id=payload.parent_id,
            key=normalized_key,
            label_key=label_key,
            description_key=description_key,
            href=payload.href.strip(),
            icon=payload.icon.strip() if payload.icon else None,
            target=payload.target.strip() if payload.target else None,
            sort_order=payload.sort_order,
            disable=payload.disable,
        )
        db.add(navigation)
        upsert_dictionary_values(db, label_key, normalize_translations(payload.label))
        if description_key is not None:
            upsert_dictionary_values(
                db,
                description_key,
                normalize_translations(payload.description),
            )
        result_navigations.append(navigation)

    try:
        db.commit()
    except IntegrityError as error:
        db.rollback()
        raise SiteNavigationAlreadyExistsError("Site navigation already exists") from error

    navigation_ids = {navigation.id for navigation in result_navigations}
    return [
        navigation
        for navigation in get_site_navigations(db)
        if navigation["id"] in navigation_ids
    ]
