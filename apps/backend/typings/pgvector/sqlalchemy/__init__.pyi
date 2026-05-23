from typing import Any

from sqlalchemy.types import UserDefinedType


class Vector(UserDefinedType[Any]):
    def __init__(self, dim: int | None = ...) -> None: ...


VECTOR = Vector
