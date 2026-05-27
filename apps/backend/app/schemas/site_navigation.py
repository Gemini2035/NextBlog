from datetime import datetime

from pydantic import AliasChoices, BaseModel, ConfigDict, Field


class SiteNavigationCreateRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    parent_id: int | None = Field(
        default=None,
        validation_alias=AliasChoices("parent_id", "parentId", "parent"),
        serialization_alias="parentId",
    )
    key: str = Field(min_length=1, max_length=255)
    label: dict[str, str] = Field(validation_alias=AliasChoices("label", "labelTranslations"))
    description: dict[str, str] | None = Field(
        default=None,
        validation_alias=AliasChoices("description", "descriptionTranslations"),
    )
    href: str = Field(min_length=1)
    icon: str | None = None
    target: str | None = Field(default=None, max_length=50)
    sort_order: int = Field(
        default=0,
        validation_alias=AliasChoices("sort_order", "sortOrder"),
        serialization_alias="sortOrder",
    )
    disable: list[str] | None = None


class SiteNavigationUpdateRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    parent_id: int | None = Field(
        default=None,
        validation_alias=AliasChoices("parent_id", "parentId", "parent"),
        serialization_alias="parentId",
    )
    key: str | None = Field(default=None, min_length=1, max_length=255)
    label: dict[str, str] | None = Field(
        default=None,
        validation_alias=AliasChoices("label", "labelTranslations"),
    )
    description: dict[str, str] | None = Field(
        default=None,
        validation_alias=AliasChoices("description", "descriptionTranslations"),
    )
    href: str | None = Field(default=None, min_length=1)
    icon: str | None = None
    target: str | None = Field(default=None, max_length=50)
    sort_order: int | None = Field(
        default=None,
        validation_alias=AliasChoices("sort_order", "sortOrder"),
        serialization_alias="sortOrder",
    )
    disable: list[str] | None = None


class SiteNavigationUpsertManyRequest(BaseModel):
    navigations: list[SiteNavigationCreateRequest] = Field(min_length=1)


class SiteNavigationDeleteRequest(BaseModel):
    navigation_ids: list[int] = Field(
        min_length=1,
        validation_alias=AliasChoices("navigation_ids", "navigationIds"),
        serialization_alias="navigationIds",
    )


class SiteNavigationPayload(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    id: int
    parent_id: int | None = Field(serialization_alias="parentId")
    key: str
    label_key: str = Field(serialization_alias="labelKey")
    description_key: str | None = Field(serialization_alias="descriptionKey")
    label: dict[str, str]
    description: dict[str, str] | None
    href: str
    icon: str | None
    target: str | None
    sort_order: int = Field(serialization_alias="sortOrder")
    disable: list[str] | None
    created_at: datetime = Field(serialization_alias="createdAt")
    updated_at: datetime = Field(serialization_alias="updatedAt")


class SiteNavigationsPayload(BaseModel):
    navigations: list[SiteNavigationPayload]


class SiteNavigationDeletePayload(BaseModel):
    deleted: int
    navigation_ids: list[int] = Field(serialization_alias="navigationIds")
