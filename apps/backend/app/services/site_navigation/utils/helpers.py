from typing import Any

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.dictionary import Dictionary
from app.models.site_navigation import SiteNavigation


def normalize_navigation_key(key: str) -> str:
    return key.strip()


def get_site_navigation_label_key(key: str) -> str:
    return f"site_navigation.{normalize_navigation_key(key)}.label"


def get_site_navigation_description_key(key: str) -> str:
    return f"site_navigation.{normalize_navigation_key(key)}.description"


def normalize_translations(translations: dict[str, str] | None) -> dict[str, str]:
    return {
        key.strip(): value.strip()
        for key, value in (translations or {}).items()
        if key.strip()
    }


def get_dictionary_values_by_keys(db: Session, keys: list[str]) -> dict[str, dict[str, str]]:
    if not keys:
        return {}

    dictionaries = db.scalars(select(Dictionary).where(Dictionary.key.in_(keys))).all()
    return {
        dictionary.key: dictionary.values
        for dictionary in dictionaries
        if isinstance(dictionary.values, dict)
    }


def upsert_dictionary_values(db: Session, key: str, values: dict[str, str]) -> None:
    dictionary = db.scalar(select(Dictionary).where(Dictionary.key == key))
    if dictionary is None:
        dictionary = Dictionary(key=key, values={})
        db.add(dictionary)
    dictionary.values = values


def build_site_navigation_payloads(
    db: Session,
    navigations: list[SiteNavigation],
) -> list[dict[str, Any]]:
    dictionary_keys = [
        dictionary_key
        for navigation in navigations
        for dictionary_key in [navigation.label_key, navigation.description_key]
        if dictionary_key
    ]
    values_by_key = get_dictionary_values_by_keys(db, dictionary_keys)

    return [
        {
            "id": navigation.id,
            "parent_id": navigation.parent_id,
            "key": navigation.key,
            "label_key": navigation.label_key,
            "description_key": navigation.description_key,
            "label": values_by_key.get(navigation.label_key, {}),
            "description": (
                values_by_key.get(navigation.description_key, {})
                if navigation.description_key
                else None
            ),
            "href": navigation.href,
            "icon": navigation.icon,
            "target": navigation.target,
            "dynamic_data_key": navigation.dynamic_data_key,
            "sort_order": navigation.sort_order,
            "disable": navigation.disable,
            "created_at": navigation.created_at,
            "updated_at": navigation.updated_at,
        }
        for navigation in navigations
    ]
