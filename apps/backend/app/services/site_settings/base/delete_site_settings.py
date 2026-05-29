from sqlalchemy import delete, select
from sqlalchemy.engine import CursorResult
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.models.site_setting import SiteSetting


class SiteSettingIdsNotFoundError(RuntimeError):
    def __init__(self, setting_ids: list[int]) -> None:
        self.setting_ids = setting_ids
        super().__init__(f"Site setting ids not found: {setting_ids}")


class SiteSettingDeleteFailedError(RuntimeError):
    def __init__(self, setting_ids: list[int]) -> None:
        self.setting_ids = setting_ids
        super().__init__(f"Site setting delete failed: {setting_ids}")


def delete_site_settings(db: Session, setting_ids: list[int]) -> int:
    unique_setting_ids = sorted(set(setting_ids))
    existing_ids = set(
        db.scalars(select(SiteSetting.id).where(SiteSetting.id.in_(unique_setting_ids))).all()
    )
    missing_ids = [setting_id for setting_id in unique_setting_ids if setting_id not in existing_ids]
    if missing_ids:
        raise SiteSettingIdsNotFoundError(missing_ids)

    try:
        result = db.execute(delete(SiteSetting).where(SiteSetting.id.in_(unique_setting_ids)))
        result_rowcount = result.rowcount if isinstance(result, CursorResult) else 0
        if result_rowcount != len(unique_setting_ids):
            db.rollback()
            raise SiteSettingDeleteFailedError(setting_ids)
        db.commit()
    except SiteSettingDeleteFailedError:
        raise
    except SQLAlchemyError as error:
        db.rollback()
        raise SiteSettingDeleteFailedError(setting_ids) from error

    return result_rowcount or 0
