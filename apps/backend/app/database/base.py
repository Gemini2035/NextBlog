from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass


from app.models.embedding import Embedding  # type: ignore # noqa: E402,F401
from app.models.project import Project  # type: ignore # noqa: E402,F401
