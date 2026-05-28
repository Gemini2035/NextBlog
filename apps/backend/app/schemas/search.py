from typing import Literal

from pydantic import BaseModel


class SearchItemPayload(BaseModel):
    id: str
    type: Literal["post", "link"]
    title: str
    description: str | None = None
    href: str


class SearchGroupPayload(BaseModel):
    type: Literal["posts", "links"]
    items: list[SearchItemPayload]


class SearchPayload(BaseModel):
    mode: Literal["recommend", "search"]
    items: list[SearchItemPayload]
    groups: list[SearchGroupPayload]
