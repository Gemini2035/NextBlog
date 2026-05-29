from typing import Any

from sqlalchemy import BigInteger, Boolean, ForeignKey, Index, Integer, String, Text, and_, cast
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, foreign, mapped_column, relationship

from app.database.base import Base
from app.models.embedding import Embedding
from app.models.locale import Locale
from app.models.mixins import TimestampMixin
from app.models.static_content_category import StaticContentCategory


STATIC_CONTENT_EMBEDDING_SOURCE_TYPE = "static_content"


class StaticContent(TimestampMixin, Base):
    __tablename__ = "static_content"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)

    category_id: Mapped[int] = mapped_column(
        BigInteger,
        ForeignKey("static_content_category.id", ondelete="RESTRICT"),
        nullable=False,
    )
    key: Mapped[str] = mapped_column(String(255), nullable=False)
    locale_id: Mapped[int | None] = mapped_column(
        Integer,
        ForeignKey("locale.id", ondelete="SET NULL"),
        nullable=True,
    )
    content: Mapped[dict[str, Any] | list[Any]] = mapped_column(JSONB, nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    is_enabled: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    category: Mapped[StaticContentCategory] = relationship("StaticContentCategory")
    locale: Mapped[Locale | None] = relationship("Locale")
    embeddings: Mapped[list[Embedding]] = relationship(
        "Embedding",
        primaryjoin=lambda: and_(
            Embedding.source_type == STATIC_CONTENT_EMBEDDING_SOURCE_TYPE,
            foreign(Embedding.source_id) == cast(StaticContent.id, String),
        ),
        viewonly=True,
    )

    __table_args__ = (
        Index("ix_static_content_category_id", "category_id"),
        Index("ix_static_content_key", "key"),
        Index("ix_static_content_locale_id", "locale_id"),
        Index("ix_static_content_is_enabled", "is_enabled"),
        Index("ix_static_content_sort_order", "sort_order"),
        Index(
            "uq_static_content_key_locale",
            "category_id",
            "key",
            "locale_id",
            unique=True,
            postgresql_where=locale_id.isnot(None),
        ),
        Index(
            "uq_static_content_key_global",
            "category_id",
            "key",
            unique=True,
            postgresql_where=locale_id.is_(None),
        ),
    )
