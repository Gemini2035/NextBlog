from enum import Enum

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.dependencies import verify_admin_request
from app.database.session import get_db
from app.schemas import ApiResponse
from app.schemas.static_content_categories import (
    StaticContentCategoriesPayload,
    StaticContentCategoryUpsertManyRequest,
)
from app.services.static_content_categories import (
    StaticContentCategoryAlreadyExistsError,
    StaticContentCategoryParentNotFoundError,
    get_static_content_categories,
    upsert_static_content_categories,
)

prefix = "/static-content-category"
tags: list[str | Enum] = ["static-content-category"]
router = APIRouter()


@router.get("", response_model=ApiResponse[StaticContentCategoriesPayload])
def list_static_content_categories(
    db: Session = Depends(get_db),
) -> ApiResponse[StaticContentCategoriesPayload]:
    return ApiResponse[StaticContentCategoriesPayload](
        data=StaticContentCategoriesPayload.model_validate(
            {"categories": get_static_content_categories(db)}
        ),
    )


@router.post("", response_model=ApiResponse[StaticContentCategoriesPayload])
def create_static_content_categories(
    payload: StaticContentCategoryUpsertManyRequest,
    db: Session = Depends(get_db),
    _: None = Depends(verify_admin_request),
) -> ApiResponse[StaticContentCategoriesPayload]:
    try:
        categories = upsert_static_content_categories(db, payload.categories)
    except StaticContentCategoryAlreadyExistsError as error:
        raise HTTPException(
            status_code=409,
            detail="Static content category already exists",
        ) from error
    except StaticContentCategoryParentNotFoundError as error:
        raise HTTPException(
            status_code=404,
            detail="Parent static content category not found",
        ) from error

    return ApiResponse[StaticContentCategoriesPayload](
        data=StaticContentCategoriesPayload.model_validate({"categories": categories}),
    )
