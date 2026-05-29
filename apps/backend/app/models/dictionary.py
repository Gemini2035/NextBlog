from typing import Any

from sqlalchemy import BigInteger, String
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base
from app.models.mixins import TimestampMixin


class Dictionary(TimestampMixin, Base):
    __tablename__ = "dictionary"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)

    key: Mapped[str] = mapped_column(String(255), nullable=False, unique=True, index=True)
    values: Mapped[dict[str, Any]] = mapped_column(JSONB, nullable=False, default=dict)
