from datetime import datetime

from pydantic import BaseModel, Field


class BlogTagPayload(BaseModel):
    id: int
    name: str
    display_name: str | None = Field(default=None, serialization_alias="displayName")


class BlogLanguagePayload(BaseModel):
    id: int
    code: str
    name: str


class BlogPostListItem(BaseModel):
    id: int
    url: str
    title: str
    description: str | None = None
    is_featured: bool = Field(serialization_alias="isFeatured")
    featured: bool
    locale: str | None = None
    language: BlogLanguagePayload | None = None
    tags: list[str]
    created_at: datetime = Field(serialization_alias="createdAt")
    updated_at: datetime = Field(serialization_alias="updatedAt")


class BlogPostDetail(BlogPostListItem):
    content: str


class BlogPostsPayload(BaseModel):
    posts: list[BlogPostListItem]
    total: int
    page: int
    page_size: int = Field(serialization_alias="pageSize")
    total_pages: int = Field(serialization_alias="totalPages")


class BlogPostDetailPayload(BaseModel):
    post: BlogPostDetail
