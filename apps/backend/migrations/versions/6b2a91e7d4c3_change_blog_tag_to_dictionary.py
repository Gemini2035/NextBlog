"""change blog tag to dictionary

Revision ID: 6b2a91e7d4c3
Revises: 4d5e6f7a8b9c
Create Date: 2026-05-26 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "6b2a91e7d4c3"
down_revision: Union[str, Sequence[str], None] = "4d5e6f7a8b9c"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("blog_tag", sa.Column("key", sa.String(length=255), nullable=True))

    connection = op.get_bind()
    tags = connection.execute(sa.text("SELECT id, name, display_name FROM blog_tag")).mappings().all()
    for tag in tags:
        key = tag["name"] or f"blog_tag.{tag['id']}"
        label = tag["display_name"] or key
        connection.execute(
            sa.text("UPDATE blog_tag SET key = :key, updated_at = now() WHERE id = :id"),
            {"id": tag["id"], "key": key},
        )
        connection.execute(
            sa.text(
                """
                INSERT INTO dictionary (key, values, created_at, updated_at)
                VALUES (:key, jsonb_build_object('zh', :label, 'en', :label, 'ja', :label), now(), now())
                ON CONFLICT (key)
                DO UPDATE SET values = EXCLUDED.values, updated_at = now()
                """
            ),
            {"key": key, "label": label},
        )

    op.drop_index(op.f("ix_blog_tag_name"), table_name="blog_tag")
    op.drop_column("blog_tag", "display_name")
    op.drop_column("blog_tag", "name")
    op.alter_column("blog_tag", "key", existing_type=sa.String(length=255), nullable=False)
    op.create_index(op.f("ix_blog_tag_key"), "blog_tag", ["key"], unique=True)


def downgrade() -> None:
    op.add_column("blog_tag", sa.Column("name", sa.String(length=100), nullable=True))
    op.add_column("blog_tag", sa.Column("display_name", sa.String(length=100), nullable=True))

    connection = op.get_bind()
    tags = connection.execute(sa.text("SELECT id, key FROM blog_tag")).mappings().all()
    for tag in tags:
        key = tag["key"]
        label = connection.execute(
            sa.text(
                """
                SELECT COALESCE(values ->> 'zh', values ->> 'en', values ->> 'ja', :fallback)
                FROM dictionary
                WHERE key = :key
                """
            ),
            {"key": key, "fallback": key},
        ).scalar_one_or_none() or key
        connection.execute(
            sa.text("UPDATE blog_tag SET name = :name, display_name = :display_name WHERE id = :id"),
            {"id": tag["id"], "name": key, "display_name": label},
        )

    op.alter_column("blog_tag", "name", existing_type=sa.String(length=100), nullable=False)
    op.create_index(op.f("ix_blog_tag_name"), "blog_tag", ["name"], unique=True)
    op.drop_index(op.f("ix_blog_tag_key"), table_name="blog_tag")
    op.drop_column("blog_tag", "key")
