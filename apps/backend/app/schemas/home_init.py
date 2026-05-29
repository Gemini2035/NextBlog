from pydantic import BaseModel, ConfigDict, Field

from app.schemas.post import PostListItem


class HomePostsPayload(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    floating: list[PostListItem]
    popular_tags: list[str] = Field(serialization_alias="popularTags")


class HomeInitPayload(BaseModel):
    posts: HomePostsPayload
