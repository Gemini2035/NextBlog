from enum import Enum

from fastapi import APIRouter, Depends, Header, HTTPException, Query
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas import ApiResponse, BlogPostDetailPayload, BlogPostsPayload
from app.services import blog

prefix = "/posts"
tags: list[str | Enum] = ["posts"]
router = APIRouter()


def resolve_locale(site_language: str | None) -> str | None:
    normalized_site_language = site_language.strip() if site_language else ""
    return normalized_site_language or None


@router.get("", response_model=ApiResponse[BlogPostsPayload])
def get_posts(
    keyword: str | None = Query(default=None),
    search: str | None = Query(default=None),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=10, alias="pageSize", ge=1, le=100),
    x_site_language: str | None = Header(default=None, alias="X-Site-Language"),
    db: Session = Depends(get_db),
) -> ApiResponse[BlogPostsPayload]:
    resolved_locale = resolve_locale(x_site_language)
    resolved_keyword = keyword if keyword is not None else search

    return ApiResponse[BlogPostsPayload](
        data=BlogPostsPayload.model_validate(
            blog.get_blog_posts(
                db,
                locale=resolved_locale,
                keyword=resolved_keyword,
                page=page,
                page_size=page_size,
            )
        )
    )


@router.get("/{post_id}", response_model=ApiResponse[BlogPostDetailPayload])
def get_post_detail(
    post_id: int,
    db: Session = Depends(get_db),
) -> ApiResponse[BlogPostDetailPayload]:
    post = blog.get_blog_post(db, post_id)

    if post is None:
        raise HTTPException(status_code=404, detail="Post not found")

    return ApiResponse[BlogPostDetailPayload](
        data=BlogPostDetailPayload.model_validate({"post": post}),
    )
