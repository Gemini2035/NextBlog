from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models.locale import Locale
from app.models.static_content import StaticContent
from app.models.static_content_category import StaticContentCategory
from app.schemas.static_content import StaticContentCreateRequest


class StaticContentAlreadyExistsError(RuntimeError):
    pass


class StaticContentLocaleNotFoundError(RuntimeError):
    pass


class StaticContentCategoryNotFoundError(RuntimeError):
    pass


def create_static_content(
    db: Session,
    payload: StaticContentCreateRequest,
) -> StaticContent:
    if db.get(StaticContentCategory, payload.category_id) is None:
        raise StaticContentCategoryNotFoundError("Static content category not found")

    if payload.locale_id is not None and db.get(Locale, payload.locale_id) is None:
        raise StaticContentLocaleNotFoundError("Locale not found")

    content = StaticContent(
        category_id=payload.category_id,
        key=payload.key.strip(),
        locale_id=payload.locale_id,
        content=payload.content,
        description=payload.description.strip() if payload.description else None,
        is_enabled=payload.is_enabled,
        sort_order=payload.sort_order,
    )
    db.add(content)

    try:
        db.commit()
    except IntegrityError as error:
        db.rollback()
        raise StaticContentAlreadyExistsError("Static content already exists") from error

    db.refresh(content)
    return content
