from enum import Enum

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.dependencies import verify_admin_request
from app.database.session import get_db
from app.schemas import ApiResponse
from app.schemas.site_navigation import (
    SiteNavigationDeletePayload,
    SiteNavigationDeleteRequest,
    SiteNavigationPayload,
    SiteNavigationsPayload,
    SiteNavigationUpdateRequest,
    SiteNavigationUpsertManyRequest,
)
from app.services.site_navigation import (
    SiteNavigationAlreadyExistsError,
    SiteNavigationDeleteFailedError,
    SiteNavigationIdsNotFoundError,
    SiteNavigationInvalidParentError,
    SiteNavigationParentNotFoundError,
    delete_site_navigations,
    get_site_navigations,
    update_site_navigation,
    upsert_site_navigations,
)

prefix = "/site-navigation"
tags: list[str | Enum] = ["site-navigation"]
router = APIRouter()


@router.get("", response_model=ApiResponse[SiteNavigationsPayload])
def list_site_navigations(db: Session = Depends(get_db)) -> ApiResponse[SiteNavigationsPayload]:
    return ApiResponse[SiteNavigationsPayload](
        data=SiteNavigationsPayload.model_validate(
            {"navigations": get_site_navigations(db)}
        ),
    )


@router.post("", response_model=ApiResponse[SiteNavigationsPayload])
def upsert_site_navigation_items(
    payload: SiteNavigationUpsertManyRequest,
    db: Session = Depends(get_db),
    _: None = Depends(verify_admin_request),
) -> ApiResponse[SiteNavigationsPayload]:
    try:
        navigations = upsert_site_navigations(db, payload.navigations)
    except SiteNavigationAlreadyExistsError as error:
        raise HTTPException(status_code=409, detail="Site navigation already exists") from error
    except SiteNavigationParentNotFoundError as error:
        raise HTTPException(status_code=404, detail="Parent site navigation not found") from error

    return ApiResponse[SiteNavigationsPayload](
        data=SiteNavigationsPayload.model_validate({"navigations": navigations}),
    )


@router.put("/{navigation_id}", response_model=ApiResponse[SiteNavigationPayload])
def update_site_navigation_item(
    navigation_id: int,
    payload: SiteNavigationUpdateRequest,
    db: Session = Depends(get_db),
    _: None = Depends(verify_admin_request),
) -> ApiResponse[SiteNavigationPayload]:
    try:
        navigation = update_site_navigation(db, navigation_id, payload)
    except SiteNavigationAlreadyExistsError as error:
        raise HTTPException(status_code=409, detail="Site navigation already exists") from error
    except SiteNavigationParentNotFoundError as error:
        raise HTTPException(status_code=404, detail="Parent site navigation not found") from error
    except SiteNavigationInvalidParentError as error:
        raise HTTPException(status_code=400, detail="Invalid parent site navigation") from error

    if navigation is None:
        raise HTTPException(status_code=404, detail="Site navigation not found")

    return ApiResponse[SiteNavigationPayload](
        data=SiteNavigationPayload.model_validate(navigation)
    )


@router.delete("", response_model=ApiResponse[SiteNavigationDeletePayload])
def delete_site_navigation_items(
    payload: SiteNavigationDeleteRequest,
    db: Session = Depends(get_db),
    _: None = Depends(verify_admin_request),
) -> ApiResponse[SiteNavigationDeletePayload]:
    try:
        deleted = delete_site_navigations(db, payload.navigation_ids)
    except SiteNavigationIdsNotFoundError as error:
        raise HTTPException(
            status_code=404,
            detail={
                "message": "Site navigation ids not found",
                "navigation_ids": error.navigation_ids,
            },
        ) from error
    except SiteNavigationDeleteFailedError as error:
        raise HTTPException(
            status_code=400,
            detail={
                "message": "Site navigation delete failed",
                "navigation_ids": error.navigation_ids,
            },
        ) from error

    return ApiResponse[SiteNavigationDeletePayload](
        data=SiteNavigationDeletePayload.model_validate(
            {
                "deleted": deleted,
                "navigation_ids": payload.navigation_ids,
            }
        ),
    )
