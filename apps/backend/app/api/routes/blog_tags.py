from enum import Enum

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.dependencies import verify_admin_request
from app.database.session import get_db
from app.schemas import ApiResponse
from app.schemas.blog_tags import (
    BlogTagDeletePayload,
    BlogTagDeleteRequest,
    BlogTagPayload,
    BlogTagsPayload,
    BlogTagUpdateRequest,
    BlogTagUpsertManyRequest,
)
from app.services.blog_tags import (
    BlogTagAlreadyExistsError,
    BlogTagDeleteFailedError,
    BlogTagIdsNotFoundError,
    delete_blog_tags,
    get_blog_tags,
    update_blog_tag,
    upsert_blog_tags,
)

prefix = "/blog-tags"
tags: list[str | Enum] = ["blog-tags"]
router = APIRouter()


@router.get("", response_model=ApiResponse[BlogTagsPayload])
def list_tags(db: Session = Depends(get_db)) -> ApiResponse[BlogTagsPayload]:
    return ApiResponse[BlogTagsPayload](
        data=BlogTagsPayload.model_validate({"tags": get_blog_tags(db)}),
    )


@router.post("", response_model=ApiResponse[BlogTagsPayload])
def upsert_tags(
    payload: BlogTagUpsertManyRequest,
    db: Session = Depends(get_db),
    _: None = Depends(verify_admin_request),
) -> ApiResponse[BlogTagsPayload]:
    try:
        tags = upsert_blog_tags(db, payload.tags)
    except BlogTagAlreadyExistsError as error:
        raise HTTPException(status_code=409, detail="Blog tag already exists") from error

    return ApiResponse[BlogTagsPayload](
        data=BlogTagsPayload.model_validate({"tags": tags}),
    )


@router.put("/{tag_id}", response_model=ApiResponse[BlogTagPayload])
def update_tag(
    tag_id: int,
    payload: BlogTagUpdateRequest,
    db: Session = Depends(get_db),
    _: None = Depends(verify_admin_request),
) -> ApiResponse[BlogTagPayload]:
    try:
        tag = update_blog_tag(db, tag_id, payload)
    except BlogTagAlreadyExistsError as error:
        raise HTTPException(status_code=409, detail="Blog tag already exists") from error

    if tag is None:
        raise HTTPException(status_code=404, detail="Blog tag not found")

    return ApiResponse[BlogTagPayload](data=BlogTagPayload.model_validate(tag))


@router.delete("", response_model=ApiResponse[BlogTagDeletePayload])
def delete_tags(
    payload: BlogTagDeleteRequest,
    db: Session = Depends(get_db),
    _: None = Depends(verify_admin_request),
) -> ApiResponse[BlogTagDeletePayload]:
    try:
        deleted = delete_blog_tags(db, payload.tag_ids)
    except BlogTagIdsNotFoundError as error:
        raise HTTPException(
            status_code=404,
            detail={"message": "Blog tag ids not found", "tag_ids": error.tag_ids},
        ) from error
    except BlogTagDeleteFailedError as error:
        raise HTTPException(
            status_code=400,
            detail={"message": "Blog tag delete failed", "tag_ids": error.tag_ids},
        ) from error

    return ApiResponse[BlogTagDeletePayload](
        data=BlogTagDeletePayload.model_validate(
            {
                "deleted": deleted,
                "tag_ids": payload.tag_ids,
            }
        ),
    )
