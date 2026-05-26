from enum import Enum

from fastapi import APIRouter, Depends, Header, HTTPException, Query
from sqlalchemy.orm import Session

from app.api.dependencies import verify_admin_request
from app.database.session import get_db
from app.schemas import (
    ApiResponse,
    BlogPostBasicInfoUpdate,
    BlogPostCreateRequest,
    BlogPostDeletePayload,
    BlogPostDeleteRequest,
    BlogPostDetailPayload,
    BlogPostsPayload,
    BlogPostWritePayload,
    BlogPostWriteRequest,
)
from app.services import blog
from app.services.blog.create_blog_post import BlogPostWriteError
from app.services.blog.delete_blog_posts import (
    BlogPostDeleteFailedError,
    BlogPostIdsNotFoundError,
    InvalidBlogPostIdsError,
)
from app.services.blog.public_ids import decode_blog_post_id
from app.services.blog.serializers import serialize_post_detail
from app.services.blog.tags import InvalidBlogTagIdsError
from app.services.blog.write_translations import (
    InvalidBlogPostLanguageError,
    InvalidTranslationPostIdError,
    MissingTranslationContentError,
)

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
    post_id: str,
    db: Session = Depends(get_db),
) -> ApiResponse[BlogPostDetailPayload]:
    try:
        internal_post_id = decode_blog_post_id(post_id)
    except ValueError as error:
        raise HTTPException(status_code=404, detail="Post not found") from error

    post = blog.get_blog_post(db, internal_post_id)

    if post is None:
        raise HTTPException(status_code=404, detail="Post not found")

    return ApiResponse[BlogPostDetailPayload](
        data=BlogPostDetailPayload.model_validate({"post": post}),
    )


@router.post("", response_model=ApiResponse[BlogPostWritePayload])
def create_post(
    payload: BlogPostCreateRequest,
    db: Session = Depends(get_db),
    _: None = Depends(verify_admin_request),
) -> ApiResponse[BlogPostWritePayload]:
    try:
        write_payload = BlogPostWriteRequest(
            content=payload.content,
            basic_info=BlogPostBasicInfoUpdate.model_validate(
                payload.basic_info.model_dump()
            ),
            options=payload.options,
        )
        blog.apply_options_language(db, write_payload)
        payload = write_payload.to_create_request()
        post, embedding_updated = blog.create_blog_post(db, payload)
        translations, translations_embedding_updated = blog.write_blog_post_translations(
            db,
            write_payload,
        )
    except InvalidBlogTagIdsError as error:
        raise HTTPException(
            status_code=400,
            detail={"message": "Invalid blog tag ids", "tag_ids": error.tag_ids},
        ) from error
    except InvalidBlogPostLanguageError as error:
        raise HTTPException(
            status_code=400,
            detail={"message": "Invalid blog post language", "language": error.language},
        ) from error
    except InvalidTranslationPostIdError as error:
        raise HTTPException(
            status_code=400,
            detail={"message": "Invalid translation post id", "post_id": error.post_id},
        ) from error
    except MissingTranslationContentError as error:
        raise HTTPException(status_code=400, detail="Content is required") from error
    except BlogPostWriteError as error:
        raise HTTPException(status_code=400, detail="Blog post write failed") from error

    return ApiResponse[BlogPostWritePayload](
        data=BlogPostWritePayload.model_validate(
            {
                "post": serialize_post_detail(post),
                "translations": translations,
                "embedding_updated": embedding_updated or translations_embedding_updated,
            }
        ),
    )


@router.put("/{post_id}", response_model=ApiResponse[BlogPostWritePayload])
def update_post(
    post_id: str,
    payload: BlogPostWriteRequest,
    db: Session = Depends(get_db),
    _: None = Depends(verify_admin_request),
) -> ApiResponse[BlogPostWritePayload]:
    try:
        internal_post_id = decode_blog_post_id(post_id)
        blog.apply_options_language(db, payload)
        result = blog.update_blog_post(db, internal_post_id, payload)
        translations, translations_embedding_updated = blog.write_blog_post_translations(
            db,
            payload,
        )
    except InvalidBlogTagIdsError as error:
        raise HTTPException(
            status_code=400,
            detail={"message": "Invalid blog tag ids", "tag_ids": error.tag_ids},
        ) from error
    except InvalidBlogPostLanguageError as error:
        raise HTTPException(
            status_code=400,
            detail={"message": "Invalid blog post language", "language": error.language},
        ) from error
    except InvalidTranslationPostIdError as error:
        raise HTTPException(
            status_code=400,
            detail={"message": "Invalid translation post id", "post_id": error.post_id},
        ) from error
    except MissingTranslationContentError as error:
        raise HTTPException(status_code=400, detail="Content is required") from error
    except ValueError as error:
        raise HTTPException(status_code=404, detail="Post not found") from error
    except BlogPostWriteError as error:
        raise HTTPException(status_code=400, detail="Blog post write failed") from error

    if result is None:
        raise HTTPException(status_code=404, detail="Post not found")

    post, embedding_updated = result
    return ApiResponse[BlogPostWritePayload](
        data=BlogPostWritePayload.model_validate(
            {
                "post": serialize_post_detail(post),
                "translations": translations,
                "embedding_updated": embedding_updated or translations_embedding_updated,
            }
        ),
    )


@router.delete("", response_model=ApiResponse[BlogPostDeletePayload])
def delete_posts(
    payload: BlogPostDeleteRequest,
    db: Session = Depends(get_db),
    _: None = Depends(verify_admin_request),
) -> ApiResponse[BlogPostDeletePayload]:
    try:
        deleted = blog.delete_blog_posts(db, payload.post_ids)
    except InvalidBlogPostIdsError as error:
        raise HTTPException(
            status_code=400,
            detail={"message": "Invalid blog post ids", "post_ids": error.post_ids},
        ) from error
    except BlogPostIdsNotFoundError as error:
        raise HTTPException(
            status_code=404,
            detail={"message": "Blog post ids not found", "post_ids": error.post_ids},
        ) from error
    except BlogPostDeleteFailedError as error:
        raise HTTPException(
            status_code=400,
            detail={"message": "Blog post delete failed", "post_ids": error.post_ids},
        ) from error
    except BlogPostWriteError as error:
        raise HTTPException(status_code=400, detail="Blog post delete failed") from error

    return ApiResponse[BlogPostDeletePayload](
        data=BlogPostDeletePayload.model_validate(
            {
                "deleted": deleted,
                "post_ids": payload.post_ids,
            }
        ),
    )
