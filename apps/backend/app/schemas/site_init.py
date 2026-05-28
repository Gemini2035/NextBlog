from typing import Any

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.locales import LocalePayload


class SiteInitNavigationItem(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    id: int
    parent_id: int | None = Field(serialization_alias="parentId")
    key: str
    label: str
    description: str | None = None
    href: str
    icon: str | None = None
    target: str | None = None
    dynamic_data_key: str | None = Field(default=None, serialization_alias="dynamicDataKey")
    sort_order: int = Field(serialization_alias="sortOrder")
    items: list["SiteInitNavigationItem"] = Field(default_factory=list)


class SiteInitPayload(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    site_config: dict[str, Any] = Field(serialization_alias="siteConfig")
    site_languages: list[LocalePayload] = Field(serialization_alias="siteLanguages")
    navigation: list[SiteInitNavigationItem]
