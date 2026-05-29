from enum import Enum

from fastapi import APIRouter, Depends, Header, Query
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas import ApiResponse
from app.schemas.search import SearchPayload
from app.services.search import search_site

prefix = "/search"
tags: list[str | Enum] = ["search"]
router = APIRouter()


@router.get("", response_model=ApiResponse[SearchPayload])
def search(
    query: str | None = Query(default=None),
    limit: int = Query(default=5, ge=1, le=10),
    x_locale: str | None = Header(default=None, alias="X-Locale"),
    db: Session = Depends(get_db),
) -> ApiResponse[SearchPayload]:
    return ApiResponse[SearchPayload](
        data=SearchPayload.model_validate(
            search_site(
                db,
                query=query,
                locale=x_locale,
                limit=limit,
            )
        )
    )
