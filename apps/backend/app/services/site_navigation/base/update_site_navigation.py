from sqlalchemy.exc import IntegrityError
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.dictionary import Dictionary
from app.models.site_navigation import SiteNavigation
from app.schemas.site_navigation import SiteNavigationUpdateRequest
from app.services.site_navigation.base.exceptions import (
    SiteNavigationAlreadyExistsError,
    SiteNavigationInvalidParentError,
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


def update_site_navigation(
    db: Session,
    navigation_id: int,
    payload: SiteNavigationUpdateRequest,
) -> dict[str, object] | None:
    navigation = db.get(SiteNavigation, navigation_id)
    if navigation is None:
        return None

    data = payload.model_dump(exclude_unset=True)
    parent_id = data.pop("parent_id", None)
    if "parent_id" in payload.model_fields_set:
        if parent_id == navigation.id:
            raise SiteNavigationInvalidParentError("Site navigation cannot be its own parent")
        if parent_id is not None and db.get(SiteNavigation, parent_id) is None:
            raise SiteNavigationParentNotFoundError("Parent site navigation not found")
        navigation.parent_id = parent_id

    key = data.pop("key", None)
    if key is not None:
        old_label_key = navigation.label_key
        old_description_key = navigation.description_key
        normalized_key = normalize_navigation_key(key)
        navigation.key = normalized_key
        navigation.label_key = get_site_navigation_label_key(normalized_key)
        if navigation.description_key is not None:
            navigation.description_key = get_site_navigation_description_key(normalized_key)

        label_dictionary = db.scalar(select(Dictionary).where(Dictionary.key == old_label_key))
        if label_dictionary is not None:
            label_dictionary.key = navigation.label_key

        if old_description_key and navigation.description_key:
            description_dictionary = db.scalar(
                select(Dictionary).where(Dictionary.key == old_description_key)
            )
            if description_dictionary is not None:
                description_dictionary.key = navigation.description_key

    label = data.pop("label", None)
    if label is not None:
        upsert_dictionary_values(
            db,
            navigation.label_key,
            normalize_translations(label),
        )

    description = data.pop("description", None)
    if description is not None:
        navigation.description_key = get_site_navigation_description_key(navigation.key)
        upsert_dictionary_values(
            db,
            navigation.description_key,
            normalize_translations(description),
        )

    for field, value in data.items():
        if isinstance(value, str):
            value = value.strip()
        setattr(navigation, field, value)

    try:
        db.commit()
    except IntegrityError as error:
        db.rollback()
        raise SiteNavigationAlreadyExistsError("Site navigation already exists") from error

    result = [
        item
        for item in get_site_navigations(db)
        if item["id"] == navigation_id
    ]
    return result[0] if result else None
