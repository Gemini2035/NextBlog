from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.site_config_category import SiteConfigCategory


def get_site_config_categories(db: Session) -> list[SiteConfigCategory]:
    return list(
        db.scalars(
            select(SiteConfigCategory).order_by(
                SiteConfigCategory.parent_id.asc().nullsfirst(),
                SiteConfigCategory.sort_order.asc(),
                SiteConfigCategory.id.asc(),
            )
        ).all()
    )
