from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models.locale import Locale
from app.schemas.locales import LocaleUpdateRequest
from app.services.dictionaries import upsert_dictionary
from app.services.locales.create_locale import LocaleAlreadyExistsError


class LocaleTranslationKeyRequiredError(RuntimeError):
    pass


def update_locale(
    db: Session,
    locale_id: int,
    payload: LocaleUpdateRequest,
) -> Locale | None:
    locale = db.get(Locale, locale_id)
    if locale is None:
        return None

    data = payload.model_dump(exclude_unset=True)
    translations = data.pop("translations", None)
    trans_key = data.get("trans_key")
    if isinstance(trans_key, str):
        trans_key = trans_key.strip()
        data["trans_key"] = trans_key

    if translations is not None:
        dictionary_key = trans_key or locale.trans_key
        if not dictionary_key:
            raise LocaleTranslationKeyRequiredError("trans_key is required")
        upsert_dictionary(db, dictionary_key, translations)

    for key, value in data.items():
        if isinstance(value, str):
            value = value.strip()
        setattr(locale, key, value)

    try:
        db.commit()
    except IntegrityError as error:
        db.rollback()
        raise LocaleAlreadyExistsError("Locale already exists") from error

    db.refresh(locale)
    return locale
