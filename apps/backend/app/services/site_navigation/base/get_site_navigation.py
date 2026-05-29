from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.site_navigation import SiteNavigation
from app.services.site_navigation.utils.helpers import build_site_navigation_payloads


def get_site_navigations(db: Session) -> list[dict[str, object]]:
    navigations = list(
        db.scalars(
            select(SiteNavigation).order_by(
                SiteNavigation.parent_id.asc().nullsfirst(),
                SiteNavigation.sort_order.asc(),
                SiteNavigation.id.asc(),
            )
        ).all()
    )
    return build_site_navigation_payloads(db, navigations)
