from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models.site_language import SiteLanguage
from app.schemas.site_languages import SiteLanguageCreateRequest


class SiteLanguageAlreadyExistsError(RuntimeError):
    pass


def create_site_language(db: Session, payload: SiteLanguageCreateRequest) -> SiteLanguage:
    language = SiteLanguage(
        code=payload.code.strip(),
        name=payload.name.strip(),
        native_name=payload.native_name.strip(),
        is_default=payload.is_default,
        is_enabled=payload.is_enabled,
        sort_order=payload.sort_order,
    )
    db.add(language)

    try:
        db.commit()
    except IntegrityError as error:
        db.rollback()
        raise SiteLanguageAlreadyExistsError("Site language already exists") from error

    db.refresh(language)
    return language
