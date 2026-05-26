"""add blog post disable

Revision ID: 5ac7b2f0d9e1
Revises: 1f0b8d2e9a6c
Create Date: 2026-05-26 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = "5ac7b2f0d9e1"
down_revision: Union[str, Sequence[str], None] = "1f0b8d2e9a6c"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "blog_post",
        sa.Column(
            "disable",
            postgresql.JSONB(astext_type=sa.Text()),
            nullable=False,
            server_default=sa.text("'[]'::jsonb"),
        ),
    )
    op.alter_column("blog_post", "disable", server_default=None)


def downgrade() -> None:
    op.drop_column("blog_post", "disable")
