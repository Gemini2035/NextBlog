from enum import Enum

from fastapi import APIRouter, Depends, Header, HTTPException, Query
from sqlalchemy.orm import Session

from app.api.dependencies import verify_admin_request
from app.database.session import get_db
from app.schemas import (
    ApiResponse,
    PostCreateRequest,
    PostDeletePayload,
    PostDeleteRequest,
    PostDetailPayload,
    PostsPayload,
    PostWritePayload,
    PostWriteRequest,
)
from app.services import post as post_service
from app.services.post.base.create_post import PostWriteError
from app.services.post.base.delete_posts import (
    PostDeleteFailedError,
    PostIdsNotFoundError,
    InvalidPostIdsError,
)
from app.services.post.utils.public_ids import decode_post_id
from app.services.post.utils.serializers import serialize_post_list_item
from app.services.post.tag.base.exceptions import InvalidPostTagIdsError

prefix = "/post"
tags: list[str | Enum] = ["post"]
router = APIRouter()


@router.get("", response_model=ApiResponse[PostsPayload])
def get_posts(
    keyword: str | None = Query(default=None),
    search: str | None = Query(default=None),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=10, alias="pageSize", ge=1, le=100),
    x_locale: str | None = Header(default=None, alias="X-Locale"),
    db: Session = Depends(get_db),
) -> ApiResponse[PostsPayload]:
    resolved_keyword = keyword if keyword is not None else search

    return ApiResponse[PostsPayload](
        data=PostsPayload.model_validate(
            post_service.get_posts(
                db,
                locale=x_locale,
                keyword=resolved_keyword,
                page=page,
                page_size=page_size,
            )
        )
    )


@router.get("/{post_id}", response_model=ApiResponse[PostDetailPayload])
def get_post_detail(
    post_id: str,
    x_locale: str | None = Header(default=None, alias="X-Locale"),
    db: Session = Depends(get_db),
) -> ApiResponse[PostDetailPayload]:
    try:
        internal_post_id = decode_post_id(post_id)
    except ValueError as error:
        raise HTTPException(status_code=404, detail="Post not found") from error

    post = post_service.get_post(db, internal_post_id, locale=x_locale)

    if post is None:
        raise HTTPException(status_code=404, detail="Post not found")

    return ApiResponse[PostDetailPayload](
        data=PostDetailPayload.model_validate({"post": post}),
    )


@router.post("", response_model=ApiResponse[PostWritePayload])
def create_post(
    payload: PostCreateRequest,
    x_locale: str | None = Header(default=None, alias="X-Locale"),
    db: Session = Depends(get_db),
    _: None = Depends(verify_admin_request),
) -> ApiResponse[PostWritePayload]:
    try:
        post, embedding_updated = post_service.create_post(db, payload)
    except InvalidPostTagIdsError as error:
        raise HTTPException(
            status_code=400,
            detail={"message": "Invalid post tag ids", "tag_ids": error.tag_ids},
        ) from error
    except PostWriteError as error:
        raise HTTPException(status_code=400, detail="Post write failed") from error

    return ApiResponse[PostWritePayload](
        data=PostWritePayload.model_validate(
            {
                "post": serialize_post_list_item(db, post, x_locale),
                "embedding_updated": embedding_updated,
            }
        ),
    )


@router.put("/{post_id}", response_model=ApiResponse[PostWritePayload])
def update_post(
    post_id: str,
    payload: PostWriteRequest,
    x_locale: str | None = Header(default=None, alias="X-Locale"),
    db: Session = Depends(get_db),
    _: None = Depends(verify_admin_request),
) -> ApiResponse[PostWritePayload]:
    try:
        internal_post_id = decode_post_id(post_id)
        result = post_service.update_post(db, internal_post_id, payload)
    except InvalidPostTagIdsError as error:
        raise HTTPException(
            status_code=400,
            detail={"message": "Invalid post tag ids", "tag_ids": error.tag_ids},
        ) from error
    except ValueError as error:
        raise HTTPException(status_code=404, detail="Post not found") from error
    except PostWriteError as error:
        raise HTTPException(status_code=400, detail="Post write failed") from error

    if result is None:
        raise HTTPException(status_code=404, detail="Post not found")

    post, embedding_updated = result
    return ApiResponse[PostWritePayload](
        data=PostWritePayload.model_validate(
            {
                "post": serialize_post_list_item(db, post, x_locale),
                "embedding_updated": embedding_updated,
            }
        ),
    )


@router.delete("", response_model=ApiResponse[PostDeletePayload])
def delete_posts(
    payload: PostDeleteRequest,
    db: Session = Depends(get_db),
    _: None = Depends(verify_admin_request),
) -> ApiResponse[PostDeletePayload]:
    try:
        deleted = post_service.delete_posts(db, payload.post_ids)
    except InvalidPostIdsError as error:
        raise HTTPException(
            status_code=400,
            detail={"message": "Invalid post ids", "post_ids": error.post_ids},
        ) from error
    except PostIdsNotFoundError as error:
        raise HTTPException(
            status_code=404,
            detail={"message": "Post ids not found", "post_ids": error.post_ids},
        ) from error
    except PostDeleteFailedError as error:
        raise HTTPException(
            status_code=400,
            detail={"message": "Post delete failed", "post_ids": error.post_ids},
        ) from error
    except PostWriteError as error:
        raise HTTPException(status_code=400, detail="Post delete failed") from error

    return ApiResponse[PostDeletePayload](
        data=PostDeletePayload.model_validate(
            {
                "deleted": deleted,
                "post_ids": payload.post_ids,
            }
        ),
    )
