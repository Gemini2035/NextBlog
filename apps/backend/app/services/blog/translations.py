from sqlalchemy.orm import Session

from app.services.dictionaries import get_dictionary_by_key, upsert_dictionary


def normalize_translations(translations: dict[str, str]) -> dict[str, str]:
    return {key.strip(): value.strip() for key, value in translations.items() if key.strip()}


def ensure_blog_translation(
    db: Session,
    *,
    key: str,
    translations: dict[str, str] | None,
) -> str:
    normalized_key = key.strip()
    upsert_dictionary(db, normalized_key, normalize_translations(translations or {}))
    return normalized_key


def resolve_dictionary_value(
    db: Session,
    key: str | None,
    site_language: str | None,
    fallback_language: str | None = None,
) -> str | None:
    if not key:
        return None

    dictionary = get_dictionary_by_key(db, key)
    if dictionary is None:
        return None

    values = dictionary.values
    if not isinstance(values, dict):
        return None

    candidates = [
        site_language.strip() if site_language else None,
        fallback_language.strip() if fallback_language else None,
        "zh",
    ]
    for candidate in candidates:
        if not candidate:
            continue
        value = values.get(candidate)
        if isinstance(value, str) and value.strip():
            return value.strip()

    for value in values.values():
        if isinstance(value, str) and value.strip():
            return value.strip()

    return None
