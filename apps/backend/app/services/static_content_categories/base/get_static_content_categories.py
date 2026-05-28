from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.static_content_category import StaticContentCategory


def get_static_content_categories(db: Session) -> list[StaticContentCategory]:
    statement = select(StaticContentCategory).order_by(
        StaticContentCategory.sort_order.asc(),
        StaticContentCategory.id.asc(),
    )
    return list(db.scalars(statement).all())
