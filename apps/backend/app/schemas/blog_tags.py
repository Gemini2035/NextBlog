from datetime import datetime

from pydantic import AliasChoices, BaseModel, ConfigDict, Field


class BlogTagCreateRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    key: str = Field(min_length=1, max_length=255)
    translations: dict[str, str] = Field(validation_alias=AliasChoices("translations", "content"))


class BlogTagUpdateRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    key: str | None = Field(default=None, min_length=1, max_length=255)
    translations: dict[str, str] | None = Field(
        default=None,
        validation_alias=AliasChoices("translations", "content"),
    )


class BlogTagUpsertManyRequest(BaseModel):
    tags: list[BlogTagCreateRequest] = Field(min_length=1)


class BlogTagDeleteRequest(BaseModel):
    tag_ids: list[int] = Field(
        min_length=1,
        validation_alias=AliasChoices("tag_ids", "tagIds"),
        serialization_alias="tagIds",
    )


class BlogTagPayload(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    id: int
    key: str
    translations: dict[str, str]
    created_at: datetime
    updated_at: datetime


class BlogTagsPayload(BaseModel):
    tags: list[BlogTagPayload]


class BlogTagDuplicateItem(BaseModel):
    id: int | None = None
    key: str
    translations: dict[str, str]
    created_at: datetime | None = Field(default=None, serialization_alias="createdAt")
    updated_at: datetime | None = Field(default=None, serialization_alias="updatedAt")


class BlogTagDuplicatePayload(BaseModel):
    duplicated: bool = True
    tags: list[BlogTagDuplicateItem]


class BlogTagDeletePayload(BaseModel):
    deleted: int
    tag_ids: list[int] = Field(serialization_alias="tagIds")
