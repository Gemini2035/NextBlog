from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.dictionary import Dictionary


def get_dictionary_by_key(db: Session, key: str | None) -> Dictionary | None:
    if not key:
        return None

    return db.scalar(select(Dictionary).where(Dictionary.key == key))
