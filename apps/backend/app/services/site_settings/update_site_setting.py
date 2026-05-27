from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models.site_setting import SiteSetting
from app.schemas.site_settings import SiteSettingUpdateRequest
from app.services.site_settings.create_site_setting import (
    SiteSettingAlreadyExistsError,
    SiteSettingParentNotFoundError,
)


class SiteSettingInvalidParentError(RuntimeError):
    pass


def update_site_setting(
    db: Session,
    setting_id: int,
    payload: SiteSettingUpdateRequest,
) -> SiteSetting | None:
    setting = db.get(SiteSetting, setting_id)
    if setting is None:
        return None

    data = payload.model_dump(exclude_unset=True)
    if "parent_id" in data:
        parent_id = data["parent_id"]
        if parent_id == setting.id:
            raise SiteSettingInvalidParentError("Site setting cannot be its own parent")
        if parent_id is not None and db.get(SiteSetting, parent_id) is None:
            raise SiteSettingParentNotFoundError("Parent site setting not found")

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
