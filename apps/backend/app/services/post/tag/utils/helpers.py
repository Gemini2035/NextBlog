from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.post import PostTag
from app.models.dictionary import Dictionary


def normalize_translations(translations: dict[str, str]) -> dict[str, str]:
    return {key.strip(): value.strip() for key, value in translations.items() if key.strip()}


def get_post_tag_dictionary_key(key: str) -> str:
    return key.strip()


def get_post_tag_dictionaries(db: Session, keys: list[str]) -> dict[str, Dictionary]:
    unique_keys = sorted({key.strip() for key in keys if key.strip()})
    if not unique_keys:
        return {}

    dictionaries = db.scalars(
        select(Dictionary).where(Dictionary.key.in_(unique_keys))
    ).all()
    return {dictionary.key: dictionary for dictionary in dictionaries}


def get_post_tag_translations(db: Session, keys: list[str]) -> dict[str, dict[str, object]]:
    dictionaries_by_key = get_post_tag_dictionaries(db, keys)
    return {
        key: dictionary.values
        for key, dictionary in dictionaries_by_key.items()
        if isinstance(dictionary.values, dict)
    }


def build_post_tag_payloads(db: Session, tags: list[PostTag]) -> list[dict[str, object]]:
    return [
        {
            "id": tag.id,
            "key": tag.key,
            "dictionary_id": tag.dictionary_id,
            "translations": (
                tag.dictionary.values
                if tag.dictionary and isinstance(tag.dictionary.values, dict)
                else {}
            ),
            "created_at": tag.created_at,
            "updated_at": tag.updated_at,
        }
        for tag in tags
    ]


def build_post_tag_payloads_for_keys(db: Session, keys: list[str]) -> list[dict[str, object]]:
    tags = list(db.scalars(select(PostTag).where(PostTag.key.in_(keys))).all())
    return build_post_tag_payloads(db, tags)


def build_duplicated_request_payloads(keys: list[str]) -> list[dict[str, object]]:
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
