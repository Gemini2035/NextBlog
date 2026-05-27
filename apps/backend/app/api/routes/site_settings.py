import json
from enum import Enum

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.api.dependencies import verify_admin_request
from app.database.session import get_db
from app.schemas import ApiResponse
from app.schemas.site_settings import (
    SiteSettingCreateRequest,
    SiteSettingDeletePayload,
    SiteSettingDeleteRequest,
    SiteSettingPayload,
    SiteSettingsPayload,
    SiteSettingUpdateRequest,
)
from app.services.site_settings import (
    SiteSettingAlreadyExistsError,
    SiteSettingDeleteFailedError,
    SiteSettingIdsNotFoundError,
    SiteSettingInvalidParentError,
    SiteSettingParentNotFoundError,
    create_site_setting,
    delete_site_settings,
    get_site_settings,
    update_site_setting,
)

prefix = "/site-setting"
tags: list[str | Enum] = ["site-setting"]
router = APIRouter()


def parse_setting_ids(setting_ids: str) -> list[int]:
    try:
        parsed = json.loads(setting_ids)
    except json.JSONDecodeError as error:
        raise HTTPException(status_code=422, detail="settingIds must be a JSON array") from error

    if (
        not isinstance(parsed, list)
        or not parsed
        or any(not isinstance(setting_id, int) for setting_id in parsed)
    ):
        raise HTTPException(status_code=422, detail="settingIds must be a non-empty integer array")

    return parsed


@router.get("", response_model=ApiResponse[SiteSettingsPayload])
def list_settings(
    setting_ids: str = Query(min_length=1, alias="settingIds"),
    public_only: bool | None = Query(default=None, alias="publicOnly"),
    enabled_only: bool | None = Query(default=None, alias="enabledOnly"),
    db: Session = Depends(get_db),
) -> ApiResponse[SiteSettingsPayload]:
    parsed_setting_ids = parse_setting_ids(setting_ids)
    settings = get_site_settings(
        db,
        setting_ids=parsed_setting_ids,
        public_only=public_only,
        enabled_only=enabled_only,
    )
    return ApiResponse[SiteSettingsPayload](
        data=SiteSettingsPayload.model_validate({"settings": settings}),
    )


@router.post("", response_model=ApiResponse[SiteSettingPayload])
def create_setting(
    payload: SiteSettingCreateRequest,
    db: Session = Depends(get_db),
    _: None = Depends(verify_admin_request),
) -> ApiResponse[SiteSettingPayload]:
    try:
        setting = create_site_setting(db, payload)
    except SiteSettingAlreadyExistsError as error:
        raise HTTPException(status_code=409, detail="Site setting already exists") from error
    except SiteSettingParentNotFoundError as error:
        raise HTTPException(status_code=404, detail="Parent site setting not found") from error

    return ApiResponse[SiteSettingPayload](data=SiteSettingPayload.model_validate(setting))


@router.put("/{setting_id}", response_model=ApiResponse[SiteSettingPayload])
def update_setting(
    setting_id: int,
    payload: SiteSettingUpdateRequest,
    db: Session = Depends(get_db),
    _: None = Depends(verify_admin_request),
) -> ApiResponse[SiteSettingPayload]:
    try:
        setting = update_site_setting(db, setting_id, payload)
    except SiteSettingAlreadyExistsError as error:
        raise HTTPException(status_code=409, detail="Site setting already exists") from error
    except SiteSettingParentNotFoundError as error:
        raise HTTPException(status_code=404, detail="Parent site setting not found") from error
    except SiteSettingInvalidParentError as error:
        raise HTTPException(status_code=400, detail="Invalid parent site setting") from error

    if setting is None:
        raise HTTPException(status_code=404, detail="Site setting not found")

    return ApiResponse[SiteSettingPayload](data=SiteSettingPayload.model_validate(setting))


@router.delete("", response_model=ApiResponse[SiteSettingDeletePayload])
def delete_settings(
    payload: SiteSettingDeleteRequest,
    db: Session = Depends(get_db),
    _: None = Depends(verify_admin_request),
) -> ApiResponse[SiteSettingDeletePayload]:
    try:
        deleted = delete_site_settings(db, payload.setting_ids)
    except SiteSettingIdsNotFoundError as error:
        raise HTTPException(
            status_code=404,
            detail={"message": "Site setting ids not found", "setting_ids": error.setting_ids},
        ) from error
    except SiteSettingDeleteFailedError as error:
        raise HTTPException(
            status_code=400,
            detail={"message": "Site setting delete failed", "setting_ids": error.setting_ids},
        ) from error

    return ApiResponse[SiteSettingDeletePayload](
        data=SiteSettingDeletePayload.model_validate(
            {
                "deleted": deleted,
                "setting_ids": payload.setting_ids,
            }
        ),
    )
