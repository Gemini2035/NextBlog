from sqlalchemy import BigInteger, Boolean, ForeignKey, Index, String, Text, and_, cast
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, foreign, mapped_column, relationship

from app.database.base import Base
from app.models.embedding import Embedding
from app.models.mixins import TimestampMixin


BLOG_POST_EMBEDDING_SOURCE_TYPE = "blog_post"


class BlogPost(TimestampMixin, Base):
    __tablename__ = "blog_post"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)

    title_key: Mapped[str] = mapped_column(String(255), nullable=False, unique=True, index=True)
    description_key: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
        unique=True,
        index=True,
    )
    content: Mapped[str] = mapped_column(Text, nullable=False)

    is_featured: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    disable: Mapped[list[str]] = mapped_column(JSONB, nullable=False, default=list)

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
        Index("ix_blog_post_is_featured", "is_featured"),
    )


class BlogTag(TimestampMixin, Base):
    __tablename__ = "blog_tag"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    key: Mapped[str] = mapped_column(String(255), nullable=False, unique=True, index=True)
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
