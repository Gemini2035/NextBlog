from typing import Any

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.dictionary import Dictionary


def upsert_dictionary(db: Session, key: str, values: dict[str, Any]) -> Dictionary:
    normalized_key = key.strip()
    dictionary = db.scalar(select(Dictionary).where(Dictionary.key == normalized_key))

    if dictionary is None:
        dictionary = Dictionary(key=normalized_key)

    dictionary.values = values
    db.add(dictionary)
    return dictionary
