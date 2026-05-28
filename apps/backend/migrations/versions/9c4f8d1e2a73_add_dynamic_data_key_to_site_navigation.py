"""add dynamic data key to site navigation

Revision ID: 9c4f8d1e2a73
Revises: 6622961ab794
Create Date: 2026-05-28 16:10:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "9c4f8d1e2a73"
down_revision: Union[str, Sequence[str], None] = "6622961ab794"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column(
        "site-navigation",
        sa.Column("dynamic_data_key", sa.String(length=100), nullable=True),
    )
    op.create_index(
        "ix_site_navigation_dynamic_data_key",
        "site-navigation",
        ["dynamic_data_key"],
        unique=False,
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index("ix_site_navigation_dynamic_data_key", table_name="site-navigation")
    op.drop_column("site-navigation", "dynamic_data_key")
