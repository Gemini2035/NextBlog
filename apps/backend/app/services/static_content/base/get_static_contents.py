from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.static_content import StaticContent
from app.models.static_content_category import StaticContentCategory


def get_static_contents(
    db: Session,
    *,
    content_ids: list[int] | None = None,
    category_ids: list[int] | None = None,
    category_keys: list[str] | None = None,
    keys: list[str] | None = None,
    locale_id: int | None = None,
    include_global_fallback: bool = False,
    enabled_only: bool | None = None,
) -> list[StaticContent]:
    statement = select(StaticContent)

    if content_ids:
        statement = statement.where(StaticContent.id.in_(content_ids))

    if category_ids:
        statement = statement.where(StaticContent.category_id.in_(category_ids))

    if category_keys:
        statement = statement.join(StaticContentCategory).where(
            StaticContentCategory.key.in_(category_keys)
        )

    if keys:
        statement = statement.where(StaticContent.key.in_(keys))

    if locale_id is not None:
        if include_global_fallback:
            statement = statement.where(
                (StaticContent.locale_id == locale_id) | (StaticContent.locale_id.is_(None))
            )
        else:
            statement = statement.where(StaticContent.locale_id == locale_id)

    if enabled_only:
        statement = statement.where(StaticContent.is_enabled.is_(True))

    statement = statement.order_by(
        StaticContent.category_id.asc(),
        StaticContent.key.asc(),
        StaticContent.sort_order.asc(),
        StaticContent.id.asc(),
    )
    return list(db.scalars(statement).all())
