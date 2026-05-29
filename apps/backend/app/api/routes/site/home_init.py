from enum import Enum

from fastapi import APIRouter, Depends, Header
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.common import ApiResponse
from app.schemas.home_init import HomeInitPayload
from app.services.home_init import get_home_init

prefix = "/site/home-init"
tags: list[str | Enum] = ["home-init"]
router = APIRouter()


@router.get("", response_model=ApiResponse[HomeInitPayload])
def get_home_initialization_data(
    x_locale: str | None = Header(default=None, alias="X-Locale"),
    db: Session = Depends(get_db),
) -> ApiResponse[HomeInitPayload]:
    return ApiResponse[HomeInitPayload](
        data=HomeInitPayload.model_validate(get_home_init(db, locale=x_locale)),
    )
