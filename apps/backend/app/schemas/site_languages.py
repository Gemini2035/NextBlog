from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class SiteLanguageCreateRequest(BaseModel):
    code: str = Field(min_length=1, max_length=16)
    name: str = Field(min_length=1, max_length=100)
    native_name: str = Field(min_length=1, max_length=100)
    is_default: bool = False
    is_enabled: bool = True
    sort_order: int = 0


class SiteLanguageUpdateRequest(BaseModel):
    code: str | None = Field(default=None, min_length=1, max_length=16)
    name: str | None = Field(default=None, min_length=1, max_length=100)
    native_name: str | None = Field(default=None, min_length=1, max_length=100)
    is_default: bool | None = None
    is_enabled: bool | None = None
    sort_order: int | None = None


class SiteLanguagePayload(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    code: str
    name: str
    native_name: str
    is_default: bool
    is_enabled: bool
    sort_order: int
    created_at: datetime
    updated_at: datetime
