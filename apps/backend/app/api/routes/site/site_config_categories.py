from enum import Enum

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.dependencies import verify_admin_request
from app.database.session import get_db
from app.schemas import ApiResponse
from app.schemas.site_config_categories import (
    SiteConfigCategoriesPayload,
    SiteConfigCategoryUpsertManyRequest,
)
from app.services.site_config_categories import (
    SiteConfigCategoryAlreadyExistsError,
    SiteConfigCategoryParentNotFoundError,
    get_site_config_categories,
    upsert_site_config_categories,
)

prefix = "/site-config-category"
tags: list[str | Enum] = ["site-config-category"]
router = APIRouter()


@router.get("", response_model=ApiResponse[SiteConfigCategoriesPayload])
def list_site_config_categories(
    db: Session = Depends(get_db),
) -> ApiResponse[SiteConfigCategoriesPayload]:
    return ApiResponse[SiteConfigCategoriesPayload](
        data=SiteConfigCategoriesPayload.model_validate(
            {"categories": get_site_config_categories(db)}
        ),
    )


@router.post("", response_model=ApiResponse[SiteConfigCategoriesPayload])
def create_site_config_categories(
    payload: SiteConfigCategoryUpsertManyRequest,
    db: Session = Depends(get_db),
    _: None = Depends(verify_admin_request),
) -> ApiResponse[SiteConfigCategoriesPayload]:
    try:
        categories = upsert_site_config_categories(db, payload.categories)
    except SiteConfigCategoryAlreadyExistsError as error:
        raise HTTPException(
            status_code=409,
            detail="Site config category already exists",
        ) from error
    except SiteConfigCategoryParentNotFoundError as error:
        raise HTTPException(
            status_code=404,
            detail="Parent site config category not found",
        ) from error

    return ApiResponse[SiteConfigCategoriesPayload](
        data=SiteConfigCategoriesPayload.model_validate({"categories": categories}),
    )
