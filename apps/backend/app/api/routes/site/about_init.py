from enum import Enum

from fastapi import APIRouter, Depends, Header
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.about_init import AboutInitPayload
from app.schemas.common import ApiResponse
from app.services.about_init import get_about_init

prefix = "/site/about-init"
tags: list[str | Enum] = ["about-init"]
router = APIRouter()


@router.get("", response_model=ApiResponse[AboutInitPayload])
def get_about_initialization_data(
    x_locale: str | None = Header(default=None, alias="X-Locale"),
    db: Session = Depends(get_db),
) -> ApiResponse[AboutInitPayload]:
    return ApiResponse[AboutInitPayload](
        data=AboutInitPayload.model_validate(get_about_init(db, locale=x_locale)),
    )
