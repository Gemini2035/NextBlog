from datetime import datetime

from pydantic import AliasChoices, BaseModel, Field


class BlogTagPayload(BaseModel):
    id: int
    name: str
    display_name: str | None = Field(default=None, serialization_alias="displayName")


class BlogLanguagePayload(BaseModel):
    id: int
    code: str
    name: str


class BlogPostListItem(BaseModel):
    id: str
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


class BlogPostWriteRequest(BaseModel):
    content: str | None = Field(default=None, min_length=1)
    basic_info: "BlogPostBasicInfoUpdate" = Field(
        default_factory=lambda: BlogPostBasicInfoUpdate(),
        validation_alias=AliasChoices("basic_info", "basicInfo"),
        serialization_alias="basicInfo",
    )
    options: "BlogPostWriteOptions | None" = None

    def to_create_request(self) -> "BlogPostCreateRequest":
        create_basic_info = BlogPostBasicInfoCreate.model_validate(
            self.basic_info.model_dump()
        )
        if self.content is None:
            raise ValueError("content is required")

        return BlogPostCreateRequest(
            content=self.content,
            basic_info=create_basic_info,
            options=self.options,
        )


class BlogPostCreateRequest(BaseModel):
    content: str = Field(min_length=1)
    basic_info: "BlogPostBasicInfoCreate" = Field(
        validation_alias=AliasChoices("basic_info", "basicInfo"),
        serialization_alias="basicInfo",
    )
    options: "BlogPostWriteOptions | None" = None


class BlogPostBasicInfoUpdate(BaseModel):
    language_id: int | None = None
    title: str | None = Field(default=None, min_length=1, max_length=255)
    description: str | None = None
    is_featured: bool | None = None
    tag_ids: list[int] | None = Field(
        default=None,
        validation_alias=AliasChoices("tag_ids", "tagIds"),
        serialization_alias="tagIds",
    )


class BlogPostBasicInfoCreate(BaseModel):
    language_id: int | None = None
    title: str = Field(min_length=1, max_length=255)
    description: str | None = None
    is_featured: bool = False
    tag_ids: list[int] = Field(
        default_factory=list,
        validation_alias=AliasChoices("tag_ids", "tagIds"),
        serialization_alias="tagIds",
    )


class BlogPostTranslationOption(BaseModel):
    language: str = Field(min_length=1)
    post_id: str | None = Field(
        default=None,
        validation_alias=AliasChoices("post_id", "postId"),
        serialization_alias="postId",
    )


class BlogPostWriteOptions(BaseModel):
    language: str | None = Field(default=None, min_length=1)
    translations: list[BlogPostTranslationOption] = Field(default_factory=list)


class BlogPostDeleteRequest(BaseModel):
    post_ids: list[str] = Field(
        min_length=1,
        validation_alias=AliasChoices("post_ids", "postIds"),
        serialization_alias="postIds",
    )


class BlogPostsPayload(BaseModel):
    posts: list[BlogPostListItem]
    total: int
    page: int
    page_size: int = Field(serialization_alias="pageSize")
    total_pages: int = Field(serialization_alias="totalPages")


class BlogPostDetailPayload(BaseModel):
    post: BlogPostDetail


class BlogPostWritePayload(BaseModel):
    post: BlogPostDetail
    translations: list[BlogPostTranslationOption] = Field(default_factory=list)
    embedding_updated: bool = Field(serialization_alias="embeddingUpdated")


class BlogPostDeletePayload(BaseModel):
    deleted: int
    post_ids: list[str] = Field(serialization_alias="postIds")
