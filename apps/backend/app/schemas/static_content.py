from datetime import datetime
from typing import Any

from pydantic import AliasChoices, BaseModel, ConfigDict, Field


class StaticContentCreateRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    category_id: int = Field(
        validation_alias=AliasChoices("category_id", "categoryId"),
        serialization_alias="categoryId",
    )
    key: str = Field(min_length=1, max_length=255)
    locale_id: int | None = Field(
        default=None,
        validation_alias=AliasChoices("locale_id", "localeId"),
        serialization_alias="localeId",
    )
    content: dict[str, Any] | list[Any]
    description: str | None = None
    is_enabled: bool = Field(
        default=True,
        validation_alias=AliasChoices("is_enabled", "isEnabled"),
        serialization_alias="isEnabled",
    )
    sort_order: int = Field(
        default=0,
        validation_alias=AliasChoices("sort_order", "sortOrder"),
        serialization_alias="sortOrder",
    )


class StaticContentUpdateRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    category_id: int | None = Field(
        default=None,
        validation_alias=AliasChoices("category_id", "categoryId"),
        serialization_alias="categoryId",
    )
    key: str | None = Field(default=None, min_length=1, max_length=255)
    locale_id: int | None = Field(
        default=None,
        validation_alias=AliasChoices("locale_id", "localeId"),
        serialization_alias="localeId",
    )
    content: dict[str, Any] | list[Any] | None = None
    description: str | None = None
    is_enabled: bool | None = Field(
        default=None,
        validation_alias=AliasChoices("is_enabled", "isEnabled"),
        serialization_alias="isEnabled",
    )
    sort_order: int | None = Field(
        default=None,
        validation_alias=AliasChoices("sort_order", "sortOrder"),
        serialization_alias="sortOrder",
    )


class StaticContentUpsertByKeyRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    category_id: int = Field(
        validation_alias=AliasChoices("category_id", "categoryId"),
        serialization_alias="categoryId",
    )
    key: str = Field(min_length=1, max_length=255)
    locale_id: int | None = Field(
        default=None,
        validation_alias=AliasChoices("locale_id", "localeId"),
        serialization_alias="localeId",
    )
    content: dict[str, Any] | list[Any]
    description: str | None = None
    is_enabled: bool | None = Field(
        default=None,
        validation_alias=AliasChoices("is_enabled", "isEnabled"),
        serialization_alias="isEnabled",
    )
    sort_order: int | None = Field(
        default=None,
        validation_alias=AliasChoices("sort_order", "sortOrder"),
        serialization_alias="sortOrder",
    )


class StaticContentDeleteRequest(BaseModel):
    content_ids: list[int] = Field(
        min_length=1,
        validation_alias=AliasChoices("content_ids", "contentIds"),
        serialization_alias="contentIds",
    )


class StaticContentPayload(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    id: int
    category_id: int = Field(serialization_alias="categoryId")
    key: str
    locale_id: int | None = Field(serialization_alias="localeId")
    content: dict[str, Any] | list[Any]
    description: str | None
    is_enabled: bool = Field(serialization_alias="isEnabled")
    sort_order: int = Field(serialization_alias="sortOrder")
    created_at: datetime = Field(serialization_alias="createdAt")
    updated_at: datetime = Field(serialization_alias="updatedAt")


class StaticContentsPayload(BaseModel):
    contents: list[StaticContentPayload]


class StaticContentDeletePayload(BaseModel):
    deleted: int
    content_ids: list[int] = Field(serialization_alias="contentIds")
