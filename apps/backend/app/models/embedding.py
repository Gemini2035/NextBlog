from pgvector.sqlalchemy import Vector
from sqlalchemy import BigInteger, Index, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base
from app.models.mixins import TimestampMixin


class Embedding(TimestampMixin, Base):
    __tablename__ = "embedding"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)

    source_type: Mapped[str] = mapped_column(String(50), nullable=False)
    source_id: Mapped[str] = mapped_column(String(255), nullable=False)

    embedding: Mapped[list[float]] = mapped_column(Vector(1536), nullable=False)
    embedding_text: Mapped[str] = mapped_column(Text, nullable=False)
    embedding_model: Mapped[str] = mapped_column(String(100), nullable=False)

    __table_args__ = (
        UniqueConstraint("source_type", "source_id", "embedding_model"),
        Index("ix_embedding_source", "source_type", "source_id"),
    )
