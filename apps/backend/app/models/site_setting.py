from typing import Any

from sqlalchemy import BigInteger, Boolean, ForeignKey, Index, String, Text, UniqueConstraint
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base
from app.models.site_config_category import SiteConfigCategory
from app.models.mixins import TimestampMixin


class SiteSetting(TimestampMixin, Base):
    __tablename__ = "site_setting"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)

    category_id: Mapped[int] = mapped_column(
        BigInteger,
        ForeignKey("site_config_category.id", ondelete="RESTRICT"),
        nullable=False,
    )
    key: Mapped[str] = mapped_column(String(255), nullable=False)
    value: Mapped[dict[str, Any] | list[Any] | str | int | float | bool | None] = mapped_column(
        JSONB,
        nullable=False,
    )
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    is_public: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    is_enabled: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)

    category: Mapped[SiteConfigCategory] = relationship("SiteConfigCategory")

    @property
    def category_key(self) -> str | None:
        return self.category.key if self.category else None

    __table_args__ = (
        UniqueConstraint("category_id", "key", name="uq_site_setting_category_key"),
        Index("ix_site_setting_category_id", "category_id"),
        Index("ix_site_setting_key", "key"),
        Index("ix_site_setting_is_public", "is_public"),
        Index("ix_site_setting_is_enabled", "is_enabled"),
    )
