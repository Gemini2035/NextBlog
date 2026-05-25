from sqlalchemy import BigInteger, Boolean, ForeignKey, Index, String, Text, and_, cast
from sqlalchemy.orm import Mapped, foreign, mapped_column, relationship

from app.database.base import Base
from app.models.embedding import Embedding
from app.models.mixins import TimestampMixin
from app.models.site_language import SiteLanguage


BLOG_POST_EMBEDDING_SOURCE_TYPE = "blog_post"


class BlogPost(TimestampMixin, Base):
    __tablename__ = "blog_post"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)

    language_id: Mapped[int | None] = mapped_column(
        ForeignKey("site_language.id", ondelete="SET NULL"),
        nullable=True,
    )

    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    content: Mapped[str] = mapped_column(Text, nullable=False)

    is_featured: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    language: Mapped[SiteLanguage | None] = relationship("SiteLanguage")
    tags: Mapped[list["BlogTag"]] = relationship(
        "BlogTag",
        secondary="blog_post_tag",
        back_populates="posts",
    )
    embeddings: Mapped[list[Embedding]] = relationship(
        "Embedding",
        primaryjoin=lambda: and_(
            Embedding.source_type == BLOG_POST_EMBEDDING_SOURCE_TYPE,
            foreign(Embedding.source_id) == cast(BlogPost.id, String),
        ),
        viewonly=True,
    )

    __table_args__ = (
        Index("ix_blog_post_language_id", "language_id"),
        Index("ix_blog_post_is_featured", "is_featured"),
    )


class BlogTag(TimestampMixin, Base):
    __tablename__ = "blog_tag"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)

    name: Mapped[str] = mapped_column(String(100), nullable=False, unique=True, index=True)
    display_name: Mapped[str | None] = mapped_column(String(100), nullable=True)

    posts: Mapped[list[BlogPost]] = relationship(
        "BlogPost",
        secondary="blog_post_tag",
        back_populates="tags",
    )


class BlogPostTag(Base):
    __tablename__ = "blog_post_tag"

    post_id: Mapped[int] = mapped_column(
        BigInteger,
        ForeignKey("blog_post.id", ondelete="CASCADE"),
        primary_key=True,
    )
    tag_id: Mapped[int] = mapped_column(
        BigInteger,
        ForeignKey("blog_tag.id", ondelete="CASCADE"),
        primary_key=True,
    )
