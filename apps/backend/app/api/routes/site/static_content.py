import json
from enum import Enum

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.api.dependencies import verify_admin_request
from app.database.session import get_db
from app.schemas import ApiResponse
from app.schemas.static_content import (
    StaticContentCreateRequest,
    StaticContentDeletePayload,
    StaticContentDeleteRequest,
    StaticContentPayload,
    StaticContentsPayload,
    StaticContentUpdateRequest,
    StaticContentUpsertByKeyRequest,
)
from app.services.static_content import (
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

prefix = "/static-content"
tags: list[str | Enum] = ["static-content"]
router = APIRouter()


def parse_content_ids(content_ids: str) -> list[int]:
    try:
        parsed = json.loads(content_ids)
    except json.JSONDecodeError as error:
        raise HTTPException(status_code=422, detail="contentIds must be a JSON array") from error

    if (
        not isinstance(parsed, list)
        or not parsed
        or any(not isinstance(content_id, int) for content_id in parsed)
    ):
        raise HTTPException(status_code=422, detail="contentIds must be a non-empty integer array")

    return parsed


def parse_category_ids(category_ids: str) -> list[int]:
    try:
        parsed = json.loads(category_ids)
    except json.JSONDecodeError as error:
        raise HTTPException(status_code=422, detail="categoryIds must be a JSON array") from error

    if (
        not isinstance(parsed, list)
        or not parsed
        or any(not isinstance(category_id, int) for category_id in parsed)
    ):
        raise HTTPException(status_code=422, detail="categoryIds must be a non-empty integer array")

    return parsed


def parse_keys(keys: str) -> list[str]:
    parsed = [key.strip() for key in keys.split(",") if key.strip()]
    if not parsed:
        raise HTTPException(status_code=422, detail="keys must be a non-empty comma-separated string")
    return parsed


@router.get("", response_model=ApiResponse[StaticContentsPayload])
def list_static_contents(
    content_ids: str | None = Query(default=None, alias="contentIds"),
    category_ids: str | None = Query(default=None, alias="categoryIds"),
    category_keys: str | None = Query(default=None, alias="categoryKeys"),
    keys: str | None = Query(default=None),
    locale_id: int | None = Query(default=None, alias="localeId"),
    include_global_fallback: bool = Query(default=False, alias="includeGlobalFallback"),
    enabled_only: bool | None = Query(default=None, alias="enabledOnly"),
    db: Session = Depends(get_db),
) -> ApiResponse[StaticContentsPayload]:
    parsed_content_ids = parse_content_ids(content_ids) if content_ids else None
    parsed_category_ids = parse_category_ids(category_ids) if category_ids else None
    parsed_category_keys = parse_keys(category_keys) if category_keys else None
    parsed_keys = parse_keys(keys) if keys else None

    contents = get_static_contents(
        db,
        content_ids=parsed_content_ids,
        category_ids=parsed_category_ids,
        category_keys=parsed_category_keys,
        keys=parsed_keys,
        locale_id=locale_id,
        include_global_fallback=include_global_fallback,
        enabled_only=enabled_only,
    )
    return ApiResponse[StaticContentsPayload](
        data=StaticContentsPayload.model_validate({"contents": contents}),
    )


@router.post("", response_model=ApiResponse[StaticContentPayload])
def create_static_content_route(
    payload: StaticContentCreateRequest,
    db: Session = Depends(get_db),
    _: None = Depends(verify_admin_request),
) -> ApiResponse[StaticContentPayload]:
    try:
        content = create_static_content(db, payload)
    except StaticContentAlreadyExistsError as error:
        raise HTTPException(status_code=409, detail="Static content already exists") from error
    except StaticContentLocaleNotFoundError as error:
        raise HTTPException(status_code=404, detail="Locale not found") from error
    except StaticContentCategoryNotFoundError as error:
        raise HTTPException(status_code=404, detail="Static content category not found") from error

    return ApiResponse[StaticContentPayload](data=StaticContentPayload.model_validate(content))


@router.put("/by-key", response_model=ApiResponse[StaticContentPayload])
def upsert_static_content_by_key_route(
    payload: StaticContentUpsertByKeyRequest,
    db: Session = Depends(get_db),
    _: None = Depends(verify_admin_request),
) -> ApiResponse[StaticContentPayload]:
    try:
        content = upsert_static_content_by_key(db, payload)
    except StaticContentAlreadyExistsError as error:
        raise HTTPException(status_code=409, detail="Static content already exists") from error
    except StaticContentLocaleNotFoundError as error:
        raise HTTPException(status_code=404, detail="Locale not found") from error
    except StaticContentCategoryNotFoundError as error:
        raise HTTPException(status_code=404, detail="Static content category not found") from error

    return ApiResponse[StaticContentPayload](data=StaticContentPayload.model_validate(content))


@router.put("/{content_id}", response_model=ApiResponse[StaticContentPayload])
def update_static_content_route(
    content_id: int,
    payload: StaticContentUpdateRequest,
    db: Session = Depends(get_db),
    _: None = Depends(verify_admin_request),
) -> ApiResponse[StaticContentPayload]:
    try:
        content = update_static_content(db, content_id, payload)
    except StaticContentAlreadyExistsError as error:
        raise HTTPException(status_code=409, detail="Static content already exists") from error
    except StaticContentLocaleNotFoundError as error:
        raise HTTPException(status_code=404, detail="Locale not found") from error
    except StaticContentCategoryNotFoundError as error:
        raise HTTPException(status_code=404, detail="Static content category not found") from error

    if content is None:
        raise HTTPException(status_code=404, detail="Static content not found")

    return ApiResponse[StaticContentPayload](data=StaticContentPayload.model_validate(content))


@router.delete("", response_model=ApiResponse[StaticContentDeletePayload])
def delete_static_contents_route(
    payload: StaticContentDeleteRequest,
    db: Session = Depends(get_db),
    _: None = Depends(verify_admin_request),
) -> ApiResponse[StaticContentDeletePayload]:
    try:
        deleted = delete_static_contents(db, payload.content_ids)
    except StaticContentIdsNotFoundError as error:
        raise HTTPException(
            status_code=404,
            detail={"message": "Static content ids not found", "content_ids": error.content_ids},
        ) from error
    except StaticContentDeleteFailedError as error:
        raise HTTPException(
            status_code=400,
            detail={"message": "Static content delete failed", "content_ids": error.content_ids},
        ) from error

    return ApiResponse[StaticContentDeletePayload](
        data=StaticContentDeletePayload.model_validate(
            {
                "deleted": deleted,
                "content_ids": payload.content_ids,
            }
        ),
    )
