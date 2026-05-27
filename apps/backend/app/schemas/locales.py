from datetime import datetime
from typing import Any

from pydantic import AliasChoices, BaseModel, ConfigDict, Field


class _LocaleBaseSchema(BaseModel):
    model_config = ConfigDict(populate_by_name=True)


class LocaleCreateRequest(_LocaleBaseSchema):
    code: str = Field(min_length=1, max_length=16)
    name: str = Field(min_length=1, max_length=100)
    trans_key: str = Field(
        validation_alias=AliasChoices("trans_key", "transKey"),
        min_length=1,
        max_length=255,
    )
    translations: dict[str, str]
    is_default: bool = False
    is_enabled: bool = True
    sort_order: int = 0


class LocaleUpdateRequest(_LocaleBaseSchema):
    code: str | None = Field(default=None, min_length=1, max_length=16)
    name: str | None = Field(default=None, min_length=1, max_length=100)
    trans_key: str | None = Field(
        default=None,
        validation_alias=AliasChoices("trans_key", "transKey"),
        min_length=1,
        max_length=255,
    )
    translations: dict[str, str] | None = None
    is_default: bool | None = None
    is_enabled: bool | None = None
    sort_order: int | None = None


class LocalePayload(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    id: int
    code: str
    name: str
    trans_key: str | None = Field(serialization_alias="transKey")
    translations: dict[str, Any]
    is_default: bool
    is_enabled: bool
    sort_order: int
    created_at: datetime
    updated_at: datetime
