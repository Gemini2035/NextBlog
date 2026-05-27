from sqlalchemy import BigInteger, ForeignKey, Index, Integer, String, Text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base
from app.models.mixins import TimestampMixin


class SiteNavigation(TimestampMixin, Base):
    __tablename__ = "site-navigation"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)

    parent_id: Mapped[int | None] = mapped_column(
        BigInteger,
        ForeignKey("site-navigation.id", ondelete="CASCADE"),
        nullable=True,
    )
    key: Mapped[str] = mapped_column(String(255), nullable=False, unique=True)
    label_key: Mapped[str] = mapped_column(String(255), nullable=False)
    description_key: Mapped[str | None] = mapped_column(String(255), nullable=True)
    href: Mapped[str] = mapped_column(Text, nullable=False)
    icon: Mapped[str | None] = mapped_column(String(100), nullable=True)
    target: Mapped[str | None] = mapped_column(String(50), nullable=True)
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    disable: Mapped[list[str] | None] = mapped_column(JSONB, nullable=True)

    parent: Mapped["SiteNavigation | None"] = relationship(
        "SiteNavigation",
        remote_side=[id],
        back_populates="children",
    )
    children: Mapped[list["SiteNavigation"]] = relationship(
        "SiteNavigation",
        back_populates="parent",
        cascade="all, delete-orphan",
    )

    __table_args__ = (
        Index("ix_site_navigation_parent_id", "parent_id"),
        Index("ix_site_navigation_key", "key"),
        Index("ix_site_navigation_label_key", "label_key"),
        Index("ix_site_navigation_sort_order", "sort_order"),
    )
