from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.site_setting import SiteSetting


def get_site_settings(
    db: Session,
    *,
    setting_ids: list[int],
    public_only: bool | None = None,
    enabled_only: bool | None = None,
) -> list[SiteSetting]:
    statement = (
        select(SiteSetting)
        .where(SiteSetting.id.in_(setting_ids))
        .order_by(SiteSetting.key.asc())
    )
    if public_only:
        statement = statement.where(SiteSetting.is_public.is_(True))
    if enabled_only:
        statement = statement.where(SiteSetting.is_enabled.is_(True))

    return list(db.scalars(statement).all())


def get_public_site_settings(db: Session) -> list[SiteSetting]:
    return list(
        db.scalars(
            select(SiteSetting)
            .where(
                SiteSetting.is_public.is_(True),
                SiteSetting.is_enabled.is_(True),
            )
            .order_by(SiteSetting.key.asc())
        ).all()
    )
