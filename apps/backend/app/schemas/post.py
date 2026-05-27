from datetime import datetime

from pydantic import AliasChoices, BaseModel, ConfigDict, Field


class _PostBaseSchema(BaseModel):
    model_config = ConfigDict(populate_by_name=True)


class PostTagPayload(_PostBaseSchema):
    id: int
    dictionary_key: str = Field(serialization_alias="dictionaryKey")


class PostListItem(_PostBaseSchema):
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


class PostDetail(PostListItem):
    content: str


class PostDictionaryField(_PostBaseSchema):
    key: str = Field(min_length=1, max_length=255)
    value: dict[str, str] = Field(
        min_length=1,
        validation_alias=AliasChoices("value", "values"),
    )


class PostWriteRequest(_PostBaseSchema):
    content: str | None = Field(default=None, min_length=1)
    title: PostDictionaryField | None = None
    description: PostDictionaryField | None = None
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


class PostCreateRequest(_PostBaseSchema):
    content: str = Field(min_length=1)
    title: PostDictionaryField
    description: PostDictionaryField | None = None
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


class PostDeleteRequest(_PostBaseSchema):
    post_ids: list[str] = Field(
        min_length=1,
        validation_alias=AliasChoices("post_ids", "postIds"),
        serialization_alias="postIds",
    )


class PostsPayload(_PostBaseSchema):
    posts: list[PostListItem]
    total: int
    page: int
    page_size: int = Field(serialization_alias="pageSize")
    total_pages: int = Field(serialization_alias="totalPages")


class PostDetailPayload(_PostBaseSchema):
    post: PostDetail


class PostWritePayload(_PostBaseSchema):
    post: PostListItem
    embedding_updated: bool = Field(serialization_alias="embeddingUpdated")


class PostDeletePayload(_PostBaseSchema):
    deleted: int
    post_ids: list[str] = Field(serialization_alias="postIds")
