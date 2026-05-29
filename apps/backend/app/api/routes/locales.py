from enum import Enum

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.dependencies import verify_admin_request
from app.database.session import get_db
from app.schemas import (
    ApiResponse,
    LocaleCreateRequest,
    LocalePayload,
    LocalesPayload,
    LocaleUpdateRequest,
)
from app.services.dictionaries import get_dictionary_by_key
from app.services.locales import create_locale as create_locale_service
from app.services.locales import get_locales as get_locales_service
from app.services.locales import update_locale as update_locale_service
from app.services.locales.create_locale import LocaleAlreadyExistsError
from app.services.locales.update_locale import LocaleTranslationKeyRequiredError

prefix = "/locales"
tags: list[str | Enum] = ["locales"]
router = APIRouter()


def build_locale_payload(locale: object, db: Session) -> LocalePayload:
    dictionary = get_dictionary_by_key(db, getattr(locale, "trans_key", None))
    data = {
        "id": getattr(locale, "id"),
        "code": getattr(locale, "code"),
        "name": getattr(locale, "name"),
        "trans_key": getattr(locale, "trans_key"),
        "translations": dictionary.values if dictionary else {},
        "is_default": getattr(locale, "is_default"),
        "is_enabled": getattr(locale, "is_enabled"),
        "sort_order": getattr(locale, "sort_order"),
        "created_at": getattr(locale, "created_at"),
        "updated_at": getattr(locale, "updated_at"),
    }
    return LocalePayload.model_validate(data)


@router.get("", response_model=ApiResponse[LocalesPayload])
def list_locales_route(
    db: Session = Depends(get_db),
) -> ApiResponse[LocalesPayload]:
    locales = [build_locale_payload(locale, db) for locale in get_locales_service(db)]
    return ApiResponse[LocalesPayload](
        data=LocalesPayload.model_validate({"locales": locales}),
    )


@router.post("", response_model=ApiResponse[LocalePayload])
def create_locale_route(
    payload: LocaleCreateRequest,
    db: Session = Depends(get_db),
    _: None = Depends(verify_admin_request),
) -> ApiResponse[LocalePayload]:
    try:
        locale = create_locale_service(db, payload)
    except LocaleAlreadyExistsError as error:
        raise HTTPException(status_code=409, detail="Locale already exists") from error

    return ApiResponse[LocalePayload](
        data=build_locale_payload(locale, db),
    )


@router.put("/{locale_id}", response_model=ApiResponse[LocalePayload])
def update_locale_route(
    locale_id: int,
    payload: LocaleUpdateRequest,
    db: Session = Depends(get_db),
    _: None = Depends(verify_admin_request),
) -> ApiResponse[LocalePayload]:
    try:
        locale = update_locale_service(db, locale_id, payload)
    except LocaleAlreadyExistsError as error:
        raise HTTPException(status_code=409, detail="Locale already exists") from error
    except LocaleTranslationKeyRequiredError as error:
        raise HTTPException(status_code=400, detail="transKey is required") from error

    if locale is None:
        raise HTTPException(status_code=404, detail="Locale not found")

    return ApiResponse[LocalePayload](
        data=build_locale_payload(locale, db),
    )
