from enum import Enum

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.dependencies import verify_admin_request
from app.database.session import get_db
from app.schemas import (
    ApiResponse,
    SiteLanguageCreateRequest,
    SiteLanguagePayload,
    SiteLanguageUpdateRequest,
)
from app.services.site_languages import create_site_language, update_site_language
from app.services.site_languages.create_site_language import SiteLanguageAlreadyExistsError

prefix = "/site-languages"
tags: list[str | Enum] = ["site-languages"]
router = APIRouter()


@router.post("", response_model=ApiResponse[SiteLanguagePayload])
def create_language(
    payload: SiteLanguageCreateRequest,
    db: Session = Depends(get_db),
    _: None = Depends(verify_admin_request),
) -> ApiResponse[SiteLanguagePayload]:
    try:
        language = create_site_language(db, payload)
    except SiteLanguageAlreadyExistsError as error:
        raise HTTPException(status_code=409, detail="Site language already exists") from error

    return ApiResponse[SiteLanguagePayload](
        data=SiteLanguagePayload.model_validate(language),
    )


@router.put("/{language_id}", response_model=ApiResponse[SiteLanguagePayload])
def update_language(
    language_id: int,
    payload: SiteLanguageUpdateRequest,
    db: Session = Depends(get_db),
    _: None = Depends(verify_admin_request),
) -> ApiResponse[SiteLanguagePayload]:
    try:
        language = update_site_language(db, language_id, payload)
    except SiteLanguageAlreadyExistsError as error:
        raise HTTPException(status_code=409, detail="Site language already exists") from error

    if language is None:
        raise HTTPException(status_code=404, detail="Site language not found")

    return ApiResponse[SiteLanguagePayload](
        data=SiteLanguagePayload.model_validate(language),
    )
