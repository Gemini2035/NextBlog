"""add dictionary foreign key to post tag

Revision ID: b7a2c9e4f5d6
Revises: f028adffed56
Create Date: 2026-05-28 16:40:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "b7a2c9e4f5d6"
down_revision: Union[str, Sequence[str], None] = "f028adffed56"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column("post_tag", sa.Column("dictionary_id", sa.BigInteger(), nullable=True))
    op.execute(
        """
        INSERT INTO dictionary (key, values, created_at, updated_at)
        SELECT post_tag.key, '{}'::jsonb, now(), now()
        FROM post_tag
        LEFT JOIN dictionary ON dictionary.key = post_tag.key
        WHERE dictionary.id IS NULL
        """
    )
    op.execute(
        """
        UPDATE post_tag
        SET dictionary_id = dictionary.id
        FROM dictionary
        WHERE dictionary.key = post_tag.key
        """
    )
    op.alter_column("post_tag", "dictionary_id", nullable=False)
    op.create_index(
        "ix_post_tag_dictionary_id",
        "post_tag",
        ["dictionary_id"],
        unique=False,
    )
    op.create_foreign_key(
        "fk_post_tag_dictionary_id_dictionary",
        "post_tag",
        "dictionary",
        ["dictionary_id"],
        ["id"],
        ondelete="RESTRICT",
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_constraint("fk_post_tag_dictionary_id_dictionary", "post_tag", type_="foreignkey")
    op.drop_index("ix_post_tag_dictionary_id", table_name="post_tag")
    op.drop_column("post_tag", "dictionary_id")
