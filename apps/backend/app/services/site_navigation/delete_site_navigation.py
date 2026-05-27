from sqlalchemy import delete, select
from sqlalchemy.engine import CursorResult
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.models.dictionary import Dictionary
from app.models.site_navigation import SiteNavigation
from app.services.site_navigation.exceptions import (
    SiteNavigationDeleteFailedError,
    SiteNavigationIdsNotFoundError,
)


def collect_descendant_navigation_ids(
    navigations: list[SiteNavigation],
    root_ids: set[int],
) -> set[int]:
    children_by_parent: dict[int, list[int]] = {}
    for navigation in navigations:
        if navigation.parent_id is None:
            continue
        children_by_parent.setdefault(navigation.parent_id, []).append(navigation.id)

    collected_ids = set(root_ids)
    pending_ids = list(root_ids)
    while pending_ids:
        current_id = pending_ids.pop()
        for child_id in children_by_parent.get(current_id, []):
            if child_id in collected_ids:
                continue
            collected_ids.add(child_id)
            pending_ids.append(child_id)

    return collected_ids


def delete_site_navigations(db: Session, navigation_ids: list[int]) -> int:
    unique_navigation_ids = sorted(set(navigation_ids))
    existing_ids = set(
        db.scalars(
            select(SiteNavigation.id).where(SiteNavigation.id.in_(unique_navigation_ids))
        ).all()
    )
    missing_ids = [
        navigation_id
        for navigation_id in unique_navigation_ids
        if navigation_id not in existing_ids
    ]
    if missing_ids:
        raise SiteNavigationIdsNotFoundError(missing_ids)

    all_navigations = list(db.scalars(select(SiteNavigation)).all())
    deleting_ids = collect_descendant_navigation_ids(all_navigations, existing_ids)

    dictionary_keys = list(
        db.scalars(
            select(SiteNavigation.label_key).where(
                SiteNavigation.id.in_(deleting_ids)
            )
        ).all()
    )
    dictionary_keys.extend(
        key
        for key in db.scalars(
            select(SiteNavigation.description_key).where(
                SiteNavigation.id.in_(deleting_ids),
                SiteNavigation.description_key.isnot(None),
            )
        ).all()
        if key
    )

    try:
        db.execute(delete(Dictionary).where(Dictionary.key.in_(dictionary_keys)))
        result = db.execute(
            delete(SiteNavigation).where(SiteNavigation.id.in_(unique_navigation_ids))
        )
        result_rowcount = result.rowcount if isinstance(result, CursorResult) else 0
        if result_rowcount != len(unique_navigation_ids):
            db.rollback()
            raise SiteNavigationDeleteFailedError(navigation_ids)
        db.commit()
    except SiteNavigationDeleteFailedError:
        raise
    except SQLAlchemyError as error:
        db.rollback()
        raise SiteNavigationDeleteFailedError(navigation_ids) from error

    return result_rowcount or 0
