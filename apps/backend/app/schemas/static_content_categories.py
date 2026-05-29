from datetime import datetime

from pydantic import AliasChoices, BaseModel, ConfigDict, Field


class StaticContentCategoryCreateRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    parent_id: int | None = Field(
        default=None,
        validation_alias=AliasChoices("parent_id", "parentId", "parent"),
        serialization_alias="parentId",
    )
    key: str = Field(min_length=1, max_length=255)
    sort_order: int = Field(
        default=0,
        validation_alias=AliasChoices("sort_order", "sortOrder"),
        serialization_alias="sortOrder",
    )


class StaticContentCategoryUpsertManyRequest(BaseModel):
    categories: list[StaticContentCategoryCreateRequest] = Field(min_length=1)


class StaticContentCategoryPayload(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    id: int
    parent_id: int | None = Field(serialization_alias="parentId")
    key: str
    sort_order: int = Field(serialization_alias="sortOrder")
    created_at: datetime = Field(serialization_alias="createdAt")
    updated_at: datetime = Field(serialization_alias="updatedAt")


class StaticContentCategoriesPayload(BaseModel):
    categories: list[StaticContentCategoryPayload]
