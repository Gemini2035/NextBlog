"""create site language and content tables

Revision ID: 9d4b2d1a8c0f
Revises: 7a217c818e6d
Create Date: 2026-05-24 22:05:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = "9d4b2d1a8c0f"
down_revision: Union[str, Sequence[str], None] = "7a217c818e6d"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table(
        "site_language",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("code", sa.String(length=16), nullable=False),
        sa.Column("name", sa.String(length=100), nullable=False),
        sa.Column("native_name", sa.String(length=100), nullable=False),
        sa.Column("is_default", sa.Boolean(), nullable=False),
        sa.Column("is_enabled", sa.Boolean(), nullable=False),
        sa.Column("sort_order", sa.Integer(), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_site_language_code"), "site_language", ["code"], unique=True)

    op.create_table(
        "site_content",
        sa.Column("id", sa.BigInteger(), autoincrement=True, nullable=False),
        sa.Column("key", sa.String(length=255), nullable=False),
        sa.Column("language_id", sa.Integer(), nullable=True),
        sa.Column("content", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("is_enabled", sa.Boolean(), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(["language_id"], ["site_language.id"], ondelete="SET NULL"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_site_content_key"), "site_content", ["key"], unique=False)
    op.create_index(
        op.f("ix_site_content_language_id"),
        "site_content",
        ["language_id"],
        unique=False,
    )
    op.create_index(
        "uq_site_content_key_language",
        "site_content",
        ["key", "language_id"],
        unique=True,
        postgresql_where=sa.text("language_id IS NOT NULL"),
    )
    op.create_index(
        "uq_site_content_key_global",
        "site_content",
        ["key"],
        unique=True,
        postgresql_where=sa.text("language_id IS NULL"),
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index("uq_site_content_key_global", table_name="site_content")
    op.drop_index("uq_site_content_key_language", table_name="site_content")
    op.drop_index(op.f("ix_site_content_language_id"), table_name="site_content")
    op.drop_index(op.f("ix_site_content_key"), table_name="site_content")
    op.drop_table("site_content")

    op.drop_index(op.f("ix_site_language_code"), table_name="site_language")
    op.drop_table("site_language")
