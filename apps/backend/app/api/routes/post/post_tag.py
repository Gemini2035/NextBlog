from enum import Enum

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.dependencies import verify_admin_request
from app.database.session import get_db
from app.schemas import ApiResponse
from app.schemas.post_tags import (
    PostTagDuplicatePayload,
    PostTagDeletePayload,
    PostTagDeleteRequest,
    PostTagPayload,
    PostTagsPayload,
    PostTagUpdateRequest,
    PostTagUpsertManyRequest,
)
from app.services.post.tag import (
    PostTagAlreadyExistsError,
    PostTagDeleteFailedError,
    PostTagIdsNotFoundError,
    delete_post_tags,
    get_post_tags,
    update_post_tag,
    upsert_post_tags,
)

prefix = "/post-tag"
tags: list[str | Enum] = ["post-tag"]
router = APIRouter()


@router.get("", response_model=ApiResponse[PostTagsPayload])
def list_tags(db: Session = Depends(get_db)) -> ApiResponse[PostTagsPayload]:
    return ApiResponse[PostTagsPayload](
        data=PostTagsPayload.model_validate({"tags": get_post_tags(db)}),
    )


@router.post("", response_model=ApiResponse[PostTagsPayload])
def upsert_tags(
    payload: PostTagUpsertManyRequest,
    db: Session = Depends(get_db),
    _: None = Depends(verify_admin_request),
) -> ApiResponse[PostTagsPayload]:
    try:
        tags = upsert_post_tags(db, payload.tags)
    except PostTagAlreadyExistsError as error:
        raise HTTPException(
            status_code=409,
            detail=PostTagDuplicatePayload.model_validate(
                {"tags": error.duplicated_tags}
            ).model_dump(by_alias=True),
        ) from error

    return ApiResponse[PostTagsPayload](
        data=PostTagsPayload.model_validate({"tags": tags}),
    )


@router.put("/{tag_id}", response_model=ApiResponse[PostTagPayload])
def update_tag(
    tag_id: int,
    payload: PostTagUpdateRequest,
    db: Session = Depends(get_db),
    _: None = Depends(verify_admin_request),
) -> ApiResponse[PostTagPayload]:
    try:
        tag = update_post_tag(db, tag_id, payload)
    except PostTagAlreadyExistsError as error:
        raise HTTPException(status_code=409, detail="Post tag already exists") from error

    if tag is None:
        raise HTTPException(status_code=404, detail="Post tag not found")

    return ApiResponse[PostTagPayload](data=PostTagPayload.model_validate(tag))


@router.delete("", response_model=ApiResponse[PostTagDeletePayload])
def delete_tags(
    payload: PostTagDeleteRequest,
    db: Session = Depends(get_db),
    _: None = Depends(verify_admin_request),
) -> ApiResponse[PostTagDeletePayload]:
    try:
        deleted = delete_post_tags(db, payload.tag_ids)
    except PostTagIdsNotFoundError as error:
        raise HTTPException(
            status_code=404,
            detail={"message": "Post tag ids not found", "tag_ids": error.tag_ids},
        ) from error
    except PostTagDeleteFailedError as error:
        raise HTTPException(
            status_code=400,
            detail={"message": "Post tag delete failed", "tag_ids": error.tag_ids},
        ) from error

    return ApiResponse[PostTagDeletePayload](
        data=PostTagDeletePayload.model_validate(
            {
                "deleted": deleted,
                "tag_ids": payload.tag_ids,
            }
        ),
    )
