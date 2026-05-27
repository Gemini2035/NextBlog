from datetime import datetime
from typing import Any

from pydantic import AliasChoices, BaseModel, ConfigDict, Field


class SiteSettingCreateRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    category_id: int = Field(
        validation_alias=AliasChoices("category_id", "categoryId"),
        serialization_alias="categoryId",
    )
    key: str = Field(min_length=1, max_length=255)
    value: dict[str, Any] | list[Any] | str | int | float | bool | None
    description: str | None = None
    is_public: bool = Field(
        default=True,
        validation_alias=AliasChoices("is_public", "isPublic"),
        serialization_alias="isPublic",
    )
    is_enabled: bool = Field(
        default=True,
        validation_alias=AliasChoices("is_enabled", "isEnabled"),
        serialization_alias="isEnabled",
    )


class SiteSettingUpdateRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    category_id: int | None = Field(
        default=None,
        validation_alias=AliasChoices("category_id", "categoryId"),
        serialization_alias="categoryId",
    )
    key: str | None = Field(default=None, min_length=1, max_length=255)
    value: dict[str, Any] | list[Any] | str | int | float | bool | None = None
    description: str | None = None
    is_public: bool | None = Field(
        default=None,
        validation_alias=AliasChoices("is_public", "isPublic"),
        serialization_alias="isPublic",
    )
    is_enabled: bool | None = Field(
        default=None,
        validation_alias=AliasChoices("is_enabled", "isEnabled"),
        serialization_alias="isEnabled",
    )


class SiteSettingUpdateByKeyRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    category_id: int = Field(
        validation_alias=AliasChoices("category_id", "categoryId"),
        serialization_alias="categoryId",
    )
    key: str = Field(min_length=1, max_length=255)
    value: dict[str, Any] | list[Any] | str | int | float | bool | None = None
    description: str | None = None
    is_public: bool | None = Field(
        default=None,
        validation_alias=AliasChoices("is_public", "isPublic"),
        serialization_alias="isPublic",
    )
    is_enabled: bool | None = Field(
        default=None,
        validation_alias=AliasChoices("is_enabled", "isEnabled"),
        serialization_alias="isEnabled",
    )


class SiteSettingDeleteRequest(BaseModel):
    setting_ids: list[int] = Field(
        min_length=1,
        validation_alias=AliasChoices("setting_ids", "settingIds"),
        serialization_alias="settingIds",
    )


class SiteSettingPayload(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    id: int
    category_id: int = Field(serialization_alias="categoryId")
    category_key: str | None = Field(serialization_alias="categoryKey")
    key: str
    value: dict[str, Any] | list[Any] | str | int | float | bool | None
    description: str | None
    is_public: bool = Field(serialization_alias="isPublic")
    is_enabled: bool = Field(serialization_alias="isEnabled")
    created_at: datetime = Field(serialization_alias="createdAt")
    updated_at: datetime = Field(serialization_alias="updatedAt")


class SiteSettingsPayload(BaseModel):
    settings: list[SiteSettingPayload]


class SiteSettingDeletePayload(BaseModel):
    deleted: int
    setting_ids: list[int] = Field(serialization_alias="settingIds")
