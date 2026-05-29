from typing import Any

from pydantic import BaseModel


class AboutInitPayload(BaseModel):
    content: dict[str, Any]
