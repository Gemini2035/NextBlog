from typing import Any

from sqlalchemy.orm import Session

from app.services.locales import get_locales
from app.services.static_content import get_static_contents


def _get_locale_id(db: Session, locale: str | None) -> int | None:
    normalized_locale = locale.strip() if locale else ""
    if not normalized_locale:
        return None

    locales = get_locales(db, codes=[normalized_locale])
    return locales[0].id if locales else None


def get_about_init(db: Session, *, locale: str | None = None) -> dict[str, Any]:
    locale_id = _get_locale_id(db, locale)
    contents = get_static_contents(
        db,
        locale_id=locale_id,
        include_global_fallback=locale_id is not None,
        enabled_only=True,
    )

    content_by_key: dict[str, Any] = {}
    for content in contents:
        if content.locale_id is None or content.locale_id == locale_id:
            content_by_key[content.key] = content.content

    return {"content": content_by_key}
