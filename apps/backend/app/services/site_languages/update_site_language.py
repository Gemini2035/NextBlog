from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models.site_language import SiteLanguage
from app.schemas.site_languages import SiteLanguageUpdateRequest
from app.services.site_languages.create_site_language import SiteLanguageAlreadyExistsError


def update_site_language(
    db: Session,
    language_id: int,
    payload: SiteLanguageUpdateRequest,
) -> SiteLanguage | None:
    language = db.get(SiteLanguage, language_id)
    if language is None:
        return None

    data = payload.model_dump(exclude_unset=True)
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
