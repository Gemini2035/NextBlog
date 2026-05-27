from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models.locale import Locale
from app.schemas.locales import LocaleCreateRequest
from app.services.dictionaries import upsert_dictionary


class LocaleAlreadyExistsError(RuntimeError):
    pass


def create_locale(db: Session, payload: LocaleCreateRequest) -> Locale:
    trans_key = payload.trans_key.strip()
    upsert_dictionary(db, trans_key, payload.translations)

    locale = Locale(
        code=payload.code.strip(),
        name=payload.name.strip(),
        trans_key=trans_key,
        is_default=payload.is_default,
        is_enabled=payload.is_enabled,
        sort_order=payload.sort_order,
    )
    db.add(locale)

    try:
        db.commit()
    except IntegrityError as error:
        db.rollback()
        raise LocaleAlreadyExistsError("Locale already exists") from error

    db.refresh(locale)
    return locale
