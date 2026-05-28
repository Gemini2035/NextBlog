from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.locale import Locale


def get_locales(db: Session, *, codes: list[str] | None = None) -> list[Locale]:
    statement = select(Locale)

    if codes:
        statement = statement.where(Locale.code.in_(codes))

    statement = statement.order_by(Locale.sort_order.asc(), Locale.id.asc())
    return list(db.scalars(statement).all())
