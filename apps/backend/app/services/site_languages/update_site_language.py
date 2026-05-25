from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models.site_language import SiteLanguage
from app.schemas.site_languages import SiteLanguageUpdateRequest
from app.services.dictionaries import upsert_dictionary
from app.services.site_languages.create_site_language import SiteLanguageAlreadyExistsError


class SiteLanguageTranslationKeyRequiredError(RuntimeError):
    pass


def update_site_language(
    db: Session,
    language_id: int,
    payload: SiteLanguageUpdateRequest,
) -> SiteLanguage | None:
    language = db.get(SiteLanguage, language_id)
    if language is None:
        return None

    data = payload.model_dump(exclude_unset=True)
    translations = data.pop("translations", None)
    trans_key = data.get("trans_key")
    if isinstance(trans_key, str):
        trans_key = trans_key.strip()
        data["trans_key"] = trans_key

    if translations is not None:
        dictionary_key = trans_key or language.trans_key
        if not dictionary_key:
            raise SiteLanguageTranslationKeyRequiredError("trans_key is required")
        upsert_dictionary(db, dictionary_key, translations)

    for key, value in data.items():
        if isinstance(value, str):
            value = value.strip()
        setattr(language, key, value)

    try:
        db.commit()
    except IntegrityError as error:
        db.rollback()
        raise SiteLanguageAlreadyExistsError("Site language already exists") from error

    db.refresh(language)
    return language
