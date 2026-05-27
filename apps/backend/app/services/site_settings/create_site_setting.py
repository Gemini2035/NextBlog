from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models.site_config_category import SiteConfigCategory
from app.models.site_setting import SiteSetting
from app.schemas.site_settings import SiteSettingCreateRequest


class SiteSettingAlreadyExistsError(RuntimeError):
    pass


class SiteSettingCategoryNotFoundError(RuntimeError):
    pass


def create_site_setting(db: Session, payload: SiteSettingCreateRequest) -> SiteSetting:
    if db.get(SiteConfigCategory, payload.category_id) is None:
        raise SiteSettingCategoryNotFoundError("Site config category not found")

    setting = SiteSetting(
        category_id=payload.category_id,
        key=payload.key.strip(),
        value=payload.value,
        description=payload.description.strip() if payload.description else None,
        is_public=payload.is_public,
        is_enabled=payload.is_enabled,
    )
    db.add(setting)

    try:
        db.commit()
    except IntegrityError as error:
        db.rollback()
        raise SiteSettingAlreadyExistsError("Site setting already exists") from error

    db.refresh(setting)
    return setting
