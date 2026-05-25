"""add trans key to site language

Revision ID: 3c1d4e5f6a7b
Revises: 2b0e3a4c5d6f
Create Date: 2026-05-25 16:45:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "3c1d4e5f6a7b"
down_revision: Union[str, Sequence[str], None] = "2b0e3a4c5d6f"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column("site_language", sa.Column("trans_key", sa.String(length=255), nullable=True))
    op.create_index(op.f("ix_site_language_trans_key"), "site_language", ["trans_key"], unique=False)


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index(op.f("ix_site_language_trans_key"), table_name="site_language")
    op.drop_column("site_language", "trans_key")
