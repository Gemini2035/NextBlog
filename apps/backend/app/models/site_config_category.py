from sqlalchemy import BigInteger, ForeignKey, Index, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base
from app.models.mixins import TimestampMixin


class SiteConfigCategory(TimestampMixin, Base):
    __tablename__ = "site_config_category"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    parent_id: Mapped[int | None] = mapped_column(
        BigInteger,
        ForeignKey("site_config_category.id", ondelete="SET NULL"),
        nullable=True,
    )
    key: Mapped[str] = mapped_column(String(255), nullable=False, unique=True)
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    parent: Mapped["SiteConfigCategory | None"] = relationship(
        "SiteConfigCategory",
        remote_side=[id],
        back_populates="children",
    )
    children: Mapped[list["SiteConfigCategory"]] = relationship(
        "SiteConfigCategory",
        back_populates="parent",
    )

    __table_args__ = (
        Index("ix_site_config_category_parent_id", "parent_id"),
        Index("ix_site_config_category_key", "key"),
        Index("ix_site_config_category_sort_order", "sort_order"),
    )
