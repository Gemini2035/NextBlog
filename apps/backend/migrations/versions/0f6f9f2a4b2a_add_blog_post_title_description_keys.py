"""add blog post title and description keys

Revision ID: 0f6f9f2a4b2a
Revises: 5ac7b2f0d9e1
Create Date: 2026-05-26 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "0f6f9f2a4b2a"
down_revision: Union[str, Sequence[str], None] = "5ac7b2f0d9e1"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("blog_post", sa.Column("title_key", sa.String(length=255), nullable=True))
    op.add_column("blog_post", sa.Column("description_key", sa.String(length=255), nullable=True))

    op.execute(
        """
        UPDATE blog_post
        SET title_key = CONCAT('blog_post.', id, '.title'),
            description_key = CASE
                WHEN description IS NULL THEN NULL
                ELSE CONCAT('blog_post.', id, '.description')
            END
        """
    )
    op.execute(
        """
        INSERT INTO dictionary (key, values, created_at, updated_at)
        SELECT CONCAT('blog_post.', id, '.title'),
               jsonb_build_object('zh', title),
               NOW(),
               NOW()
        FROM blog_post
        ON CONFLICT (key) DO UPDATE
        SET values = EXCLUDED.values,
            updated_at = NOW()
        """
    )
    op.execute(
        """
        INSERT INTO dictionary (key, values, created_at, updated_at)
        SELECT CONCAT('blog_post.', id, '.description'),
               jsonb_build_object('zh', description),
               NOW(),
               NOW()
        FROM blog_post
        WHERE description IS NOT NULL
        ON CONFLICT (key) DO UPDATE
        SET values = EXCLUDED.values,
            updated_at = NOW()
        """
    )

    op.alter_column("blog_post", "title_key", nullable=False)
    op.create_index("ix_blog_post_title_key", "blog_post", ["title_key"], unique=True)
    op.create_index("ix_blog_post_description_key", "blog_post", ["description_key"], unique=True)
    op.drop_column("blog_post", "description")
    op.drop_column("blog_post", "title")


def downgrade() -> None:
    op.add_column("blog_post", sa.Column("title", sa.String(length=255), nullable=True))
    op.add_column("blog_post", sa.Column("description", sa.Text(), nullable=True))
    op.execute(
        """
        UPDATE blog_post
        SET title = COALESCE(title_dictionary.values->>'zh', title_key),
            description = description_dictionary.values->>'zh'
        FROM dictionary AS title_dictionary
        LEFT JOIN dictionary AS description_dictionary
          ON description_dictionary.key = blog_post.description_key
        WHERE title_dictionary.key = blog_post.title_key
        """
    )
    op.alter_column("blog_post", "title", nullable=False)
    op.drop_index("ix_blog_post_description_key", table_name="blog_post")
    op.drop_index("ix_blog_post_title_key", table_name="blog_post")
    op.drop_column("blog_post", "description_key")
    op.drop_column("blog_post", "title_key")
