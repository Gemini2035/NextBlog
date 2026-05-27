from typing import Any

from sqlalchemy import BigInteger, Boolean, ForeignKey, Index, Integer, String, Text, and_, cast
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, foreign, mapped_column, relationship

from app.database.base import Base
from app.models.embedding import Embedding
from app.models.mixins import TimestampMixin
from app.models.locale import Locale


class SiteContent(TimestampMixin, Base):
    __tablename__ = "site_content"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)

    key: Mapped[str] = mapped_column(String(255), nullable=False)
    locale_id: Mapped[int | None] = mapped_column(
        Integer,
        ForeignKey("locale.id", ondelete="SET NULL"),
        nullable=True,
    )
    content: Mapped[dict[str, Any] | list[Any]] = mapped_column(JSONB, nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    is_enabled: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)

    locale: Mapped[Locale | None] = relationship("Locale")
    embeddings: Mapped[list[Embedding]] = relationship(
        "Embedding",
        primaryjoin=lambda: and_(
            Embedding.source_type == "site_content",
            foreign(Embedding.source_id) == cast(SiteContent.id, String),
        ),
        viewonly=True,
    )

    __table_args__ = (
        Index("ix_site_content_key", "key"),
        Index("ix_site_content_locale_id", "locale_id"),
        Index(
            "uq_site_content_key_locale",
            "key",
            "locale_id",
            unique=True,
            postgresql_where=locale_id.isnot(None),
        ),
        Index(
            "uq_site_content_key_global",
            "key",
            unique=True,
            postgresql_where=locale_id.is_(None),
        ),
    )
