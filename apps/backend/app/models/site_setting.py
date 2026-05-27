from typing import Any

from sqlalchemy import BigInteger, Boolean, ForeignKey, Index, String, Text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base
from app.models.mixins import TimestampMixin


class SiteSetting(TimestampMixin, Base):
    __tablename__ = "site_setting"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)

    parent_id: Mapped[int | None] = mapped_column(
        BigInteger,
        ForeignKey("site_setting.id", ondelete="SET NULL"),
        nullable=True,
    )
    key: Mapped[str] = mapped_column(String(255), nullable=False, unique=True)
    value: Mapped[dict[str, Any] | list[Any] | str | int | float | bool | None] = mapped_column(
        JSONB,
        nullable=False,
    )
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    is_public: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    is_enabled: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)

    parent: Mapped["SiteSetting | None"] = relationship(
        "SiteSetting",
        remote_side=[id],
        back_populates="children",
    )
    children: Mapped[list["SiteSetting"]] = relationship(
        "SiteSetting",
        back_populates="parent",
    )

    __table_args__ = (
        Index("ix_site_setting_parent_id", "parent_id"),
        Index("ix_site_setting_key", "key"),
        Index("ix_site_setting_is_public", "is_public"),
        Index("ix_site_setting_is_enabled", "is_enabled"),
    )
