"""remove blog post language

Revision ID: 1f0b8d2e9a6c
Revises: 332a141a01fe
Create Date: 2026-05-26 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "1f0b8d2e9a6c"
down_revision: Union[str, Sequence[str], None] = "332a141a01fe"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.drop_index("ix_blog_post_language_id", table_name="blog_post")
    op.drop_column("blog_post", "language_id")


def downgrade() -> None:
    op.add_column("blog_post", sa.Column("language_id", sa.Integer(), nullable=True))
    op.create_foreign_key(
        "blog_post_language_id_fkey",
        "blog_post",
        "site_language",
        ["language_id"],
        ["id"],
        ondelete="SET NULL",
    )
    op.create_index("ix_blog_post_language_id", "blog_post", ["language_id"], unique=False)
