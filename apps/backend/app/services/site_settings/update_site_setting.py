from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models.site_config_category import SiteConfigCategory
from app.models.site_setting import SiteSetting
from app.schemas.site_settings import SiteSettingUpdateByKeyRequest, SiteSettingUpdateRequest
from app.services.site_settings.create_site_setting import (
    SiteSettingAlreadyExistsError,
    SiteSettingCategoryNotFoundError,
)


def update_site_setting(
    db: Session,
    setting_id: int,
    payload: SiteSettingUpdateRequest,
) -> SiteSetting | None:
    setting = db.get(SiteSetting, setting_id)
    if setting is None:
        return None

    data = payload.model_dump(exclude_unset=True)
    if "category_id" in data:
        category_id = data["category_id"]
        if category_id is None or db.get(SiteConfigCategory, category_id) is None:
            raise SiteSettingCategoryNotFoundError("Site config category not found")

    for key, value in data.items():
        if isinstance(value, str):
            value = value.strip()
        setattr(setting, key, value)

    try:
        db.commit()
    except IntegrityError as error:
        db.rollback()
        raise SiteSettingAlreadyExistsError("Site setting already exists") from error

    db.refresh(setting)
    return setting


def update_site_setting_by_key(
    db: Session,
    payload: SiteSettingUpdateByKeyRequest,
) -> SiteSetting | None:
    if db.get(SiteConfigCategory, payload.category_id) is None:
        raise SiteSettingCategoryNotFoundError("Site config category not found")

    setting = db.scalar(
        select(SiteSetting).where(
            SiteSetting.category_id == payload.category_id,
            SiteSetting.key == payload.key.strip(),
        )
    )
    if setting is None:
        return None

    data = payload.model_dump(exclude_unset=True)
    data.pop("category_id", None)
    data.pop("key", None)
    for key, value in data.items():
        if isinstance(value, str):
            value = value.strip()
        setattr(setting, key, value)

    try:
        db.commit()
    except IntegrityError as error:
        db.rollback()
        raise SiteSettingAlreadyExistsError("Site setting already exists") from error

    db.refresh(setting)
    return setting
