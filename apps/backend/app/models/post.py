from sqlalchemy import BigInteger, Boolean, ForeignKey, Index, String, Text, and_, cast
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, foreign, mapped_column, relationship

from app.database.base import Base
from app.models.dictionary import Dictionary
from app.models.embedding import Embedding
from app.models.mixins import TimestampMixin


POST_EMBEDDING_SOURCE_TYPE = "post"


class Post(TimestampMixin, Base):
    __tablename__ = "post"

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

    tags: Mapped[list["PostTag"]] = relationship(
        "PostTag",
        secondary="post_post_tag",
        back_populates="posts",
        lazy="selectin",
    )
    embeddings: Mapped[list[Embedding]] = relationship(
        "Embedding",
        primaryjoin=lambda: and_(
            Embedding.source_type == POST_EMBEDDING_SOURCE_TYPE,
            foreign(Embedding.source_id) == cast(Post.id, String),
        ),
        viewonly=True,
    )

    __table_args__ = (
        Index("ix_post_is_featured", "is_featured"),
    )


class PostTag(TimestampMixin, Base):
    __tablename__ = "post_tag"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    key: Mapped[str] = mapped_column(String(255), nullable=False, unique=True, index=True)
    dictionary_id: Mapped[int] = mapped_column(
        BigInteger,
        ForeignKey("dictionary.id", ondelete="RESTRICT"),
        nullable=False,
    )
    dictionary: Mapped[Dictionary] = relationship("Dictionary", lazy="joined")
    posts: Mapped[list[Post]] = relationship(
        "Post",
        secondary="post_post_tag",
        back_populates="tags",
    )

    __table_args__ = (
        Index("ix_post_tag_dictionary_id", "dictionary_id"),
    )


class PostPostTag(Base):
    __tablename__ = "post_post_tag"

    post_id: Mapped[int] = mapped_column(
        BigInteger,
        ForeignKey("post.id", ondelete="CASCADE"),
        primary_key=True,
    )
    tag_id: Mapped[int] = mapped_column(
        BigInteger,
        ForeignKey("post_tag.id", ondelete="CASCADE"),
        primary_key=True,
    )
