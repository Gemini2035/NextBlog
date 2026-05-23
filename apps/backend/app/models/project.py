from datetime import datetime
from typing import Any

from sqlalchemy import BigInteger, Boolean, DateTime, Float, Integer, String, Text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base
from app.models.mixins import TimestampMixin


class Project(TimestampMixin, Base):
    __tablename__ = "project"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True)

    name: Mapped[str] = mapped_column(String(255), nullable=False)
    full_name: Mapped[str] = mapped_column(String(512), nullable=False, unique=True, index=True)
    description: Mapped[str] = mapped_column(Text, nullable=False, default="")
    url: Mapped[str] = mapped_column(Text, nullable=False)
    homepage: Mapped[str | None] = mapped_column(Text, nullable=True)

    owner_login: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    owner_avatar_url: Mapped[str] = mapped_column(Text, nullable=False)
    owner_url: Mapped[str] = mapped_column(Text, nullable=False)

    stars: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    forks: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    watchers: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    open_issues: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    primary_language_name: Mapped[str | None] = mapped_column(String(100), nullable=True, index=True)
    primary_language_color: Mapped[str | None] = mapped_column(String(20), nullable=True)

    topics: Mapped[list[str]] = mapped_column(JSONB, nullable=False, default=list)
    languages: Mapped[dict[str, int]] = mapped_column(JSONB, nullable=False, default=dict)
    language_stats: Mapped[list[dict[str, Any]]] = mapped_column(JSONB, nullable=False, default=list)
    contributors: Mapped[list[dict[str, Any]]] = mapped_column(JSONB, nullable=False, default=list)

    is_fork: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False, index=True)
    is_archived: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False, index=True)
    is_pinned: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False, index=True)

    license: Mapped[str | None] = mapped_column(String(255), nullable=True)

    github_created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    github_updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, index=True)
    github_pushed_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)

    activity_score: Mapped[float | None] = mapped_column(Float, nullable=True)
    display_weight: Mapped[float | None] = mapped_column(Float, nullable=True)
    weight: Mapped[float | None] = mapped_column(Float, nullable=True, index=True)
