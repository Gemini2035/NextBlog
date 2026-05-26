from datetime import datetime

from pydantic import AliasChoices, BaseModel, ConfigDict, Field


class _BlogBaseSchema(BaseModel):
    model_config = ConfigDict(populate_by_name=True)


class BlogTagPayload(_BlogBaseSchema):
    id: int
    dictionary_key: str = Field(serialization_alias="dictionaryKey")


class BlogPostListItem(_BlogBaseSchema):
    id: str
    url: str
    title: str
    description: str | None = None
    is_featured: bool = Field(serialization_alias="isFeatured")
    featured: bool
    disable: list[str]
    tags: list[str]
    created_at: datetime = Field(serialization_alias="createdAt")
    updated_at: datetime = Field(serialization_alias="updatedAt")


class BlogPostDetail(BlogPostListItem):
    content: str


class BlogPostDictionaryField(_BlogBaseSchema):
    key: str = Field(min_length=1, max_length=255)
    value: dict[str, str] = Field(
        min_length=1,
        validation_alias=AliasChoices("value", "values"),
    )


class BlogPostWriteRequest(_BlogBaseSchema):
    content: str | None = Field(default=None, min_length=1)
    title: BlogPostDictionaryField | None = None
    description: BlogPostDictionaryField | None = None
    is_featured: bool | None = Field(
        default=None,
        validation_alias=AliasChoices("is_featured", "isFeatured"),
        serialization_alias="isFeatured",
    )
    disable: list[str] | None = None
    tag_ids: list[int] | None = Field(
        default=None,
        validation_alias=AliasChoices("tag_ids", "tagIds"),
        serialization_alias="tagIds",
    )


class BlogPostCreateRequest(_BlogBaseSchema):
    content: str = Field(min_length=1)
    title: BlogPostDictionaryField
    description: BlogPostDictionaryField | None = None
    is_featured: bool = Field(
        default=False,
        validation_alias=AliasChoices("is_featured", "isFeatured"),
        serialization_alias="isFeatured",
    )
    disable: list[str] = Field(default_factory=list)
    tag_ids: list[int] = Field(
        default_factory=list,
        validation_alias=AliasChoices("tag_ids", "tagIds"),
        serialization_alias="tagIds",
    )


class BlogPostDeleteRequest(_BlogBaseSchema):
    post_ids: list[str] = Field(
        min_length=1,
        validation_alias=AliasChoices("post_ids", "postIds"),
        serialization_alias="postIds",
    )


class BlogPostsPayload(_BlogBaseSchema):
    posts: list[BlogPostListItem]
    total: int
    page: int
    page_size: int = Field(serialization_alias="pageSize")
    total_pages: int = Field(serialization_alias="totalPages")


class BlogPostDetailPayload(_BlogBaseSchema):
    post: BlogPostDetail


class BlogPostWritePayload(_BlogBaseSchema):
    post: BlogPostListItem
    embedding_updated: bool = Field(serialization_alias="embeddingUpdated")


class BlogPostDeletePayload(_BlogBaseSchema):
    deleted: int
    post_ids: list[str] = Field(serialization_alias="postIds")
