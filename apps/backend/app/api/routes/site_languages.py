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
from app.services.dictionaries import get_dictionary_by_key
from app.services.site_languages import create_site_language, update_site_language
from app.services.site_languages.create_site_language import SiteLanguageAlreadyExistsError
from app.services.site_languages.update_site_language import SiteLanguageTranslationKeyRequiredError

prefix = "/site-languages"
tags: list[str | Enum] = ["site-languages"]
router = APIRouter()


def build_site_language_payload(language: object, db: Session) -> SiteLanguagePayload:
    dictionary = get_dictionary_by_key(db, getattr(language, "trans_key", None))
    data = {
        "id": getattr(language, "id"),
        "code": getattr(language, "code"),
        "name": getattr(language, "name"),
        "trans_key": getattr(language, "trans_key"),
        "translations": dictionary.values if dictionary else {},
        "is_default": getattr(language, "is_default"),
        "is_enabled": getattr(language, "is_enabled"),
        "sort_order": getattr(language, "sort_order"),
        "created_at": getattr(language, "created_at"),
        "updated_at": getattr(language, "updated_at"),
    }
    return SiteLanguagePayload.model_validate(data)


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
        data=build_site_language_payload(language, db),
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
    except SiteLanguageTranslationKeyRequiredError as error:
        raise HTTPException(status_code=400, detail="transKey is required") from error

    if language is None:
        raise HTTPException(status_code=404, detail="Site language not found")

    return ApiResponse[SiteLanguagePayload](
        data=build_site_language_payload(language, db),
    )
