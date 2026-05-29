from enum import Enum

from fastapi import APIRouter, Depends, Header
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas import ApiResponse
from app.schemas.site_init import SiteInitPayload
from app.services.site_init import get_site_init

prefix = "/site-init"
tags: list[str | Enum] = ["site-init"]
router = APIRouter()


@router.get("", response_model=ApiResponse[SiteInitPayload])
def get_site_initialization_data(
    x_locale: str | None = Header(default=None, alias="X-Locale"),
    db: Session = Depends(get_db),
) -> ApiResponse[SiteInitPayload]:
    return ApiResponse[SiteInitPayload](
        data=SiteInitPayload.model_validate(get_site_init(db, locale=x_locale)),
    )
