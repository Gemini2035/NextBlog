from .base import (
    StaticContentAlreadyExistsError,
    StaticContentCategoryNotFoundError,
    StaticContentDeleteFailedError,
    StaticContentIdsNotFoundError,
    StaticContentLocaleNotFoundError,
    create_static_content,
    delete_static_contents,
    get_static_contents,
    update_static_content,
    upsert_static_content_by_key,
)

__all__ = [
    "StaticContentAlreadyExistsError",
    "StaticContentCategoryNotFoundError",
    "StaticContentDeleteFailedError",
    "StaticContentIdsNotFoundError",
    "StaticContentLocaleNotFoundError",
    "create_static_content",
    "delete_static_contents",
    "get_static_contents",
    "update_static_content",
    "upsert_static_content_by_key",
]
