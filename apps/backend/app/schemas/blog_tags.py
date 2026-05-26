from datetime import datetime

from pydantic import AliasChoices, BaseModel, ConfigDict, Field


class BlogTagCreateRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    name: str = Field(min_length=1, max_length=100)
    display_name: str | None = Field(
        default=None,
        validation_alias=AliasChoices("display_name", "displayName"),
        serialization_alias="displayName",
        max_length=100,
    )


class BlogTagUpdateRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    name: str | None = Field(default=None, min_length=1, max_length=100)
    display_name: str | None = Field(
        default=None,
        validation_alias=AliasChoices("display_name", "displayName"),
        serialization_alias="displayName",
        max_length=100,
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
    name: str
    display_name: str | None = Field(serialization_alias="displayName")
    created_at: datetime
    updated_at: datetime


class BlogTagsPayload(BaseModel):
    tags: list[BlogTagPayload]


class BlogTagDeletePayload(BaseModel):
    deleted: int
    tag_ids: list[int] = Field(serialization_alias="tagIds")
