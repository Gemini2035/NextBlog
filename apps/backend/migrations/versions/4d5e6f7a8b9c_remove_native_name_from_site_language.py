"""remove native name from site language

Revision ID: 4d5e6f7a8b9c
Revises: 3c1d4e5f6a7b
Create Date: 2026-05-25 17:15:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "4d5e6f7a8b9c"
down_revision: Union[str, Sequence[str], None] = "3c1d4e5f6a7b"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.execute("UPDATE site_language SET name = native_name WHERE native_name IS NOT NULL")
    op.drop_column("site_language", "native_name")


def downgrade() -> None:
    """Downgrade schema."""
    op.add_column(
        "site_language",
        sa.Column("native_name", sa.String(length=100), nullable=True),
    )
    op.execute("UPDATE site_language SET native_name = name")
    op.alter_column("site_language", "native_name", nullable=False)
