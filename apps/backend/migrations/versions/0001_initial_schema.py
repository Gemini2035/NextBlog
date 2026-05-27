"""initial schema

Revision ID: 0001_initial_schema
Revises:
Create Date: 2026-05-27 00:00:00.000000
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op
from pgvector.sqlalchemy import Vector
from sqlalchemy.dialects import postgresql


revision: str = "0001_initial_schema"
down_revision: str | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def _timestamps() -> list[sa.Column]:
    return [
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
    ]


def upgrade() -> None:
    op.execute("CREATE EXTENSION IF NOT EXISTS vector")

    op.create_table(
        "dictionary",
        sa.Column("id", sa.BigInteger(), autoincrement=True, nullable=False),
        sa.Column("key", sa.String(length=255), nullable=False),
        sa.Column("values", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        *_timestamps(),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_dictionary_key"), "dictionary", ["key"], unique=True)

    op.create_table(
        "embedding",
        sa.Column("id", sa.BigInteger(), autoincrement=True, nullable=False),
        sa.Column("source_type", sa.String(length=50), nullable=False),
        sa.Column("source_id", sa.String(length=255), nullable=False),
        sa.Column("embedding", Vector(1536), nullable=False),
        sa.Column("embedding_text", sa.Text(), nullable=False),
        sa.Column("embedding_model", sa.String(length=100), nullable=False),
        *_timestamps(),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("source_type", "source_id", "embedding_model"),
    )
    op.create_index("ix_embedding_source", "embedding", ["source_type", "source_id"], unique=False)

    op.create_table(
        "locale",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("code", sa.String(length=16), nullable=False),
        sa.Column("name", sa.String(length=100), nullable=False),
        sa.Column("trans_key", sa.String(length=255), nullable=True),
        sa.Column("is_default", sa.Boolean(), nullable=False),
        sa.Column("is_enabled", sa.Boolean(), nullable=False),
        sa.Column("sort_order", sa.Integer(), nullable=False),
        *_timestamps(),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_locale_code"), "locale", ["code"], unique=True)
    op.create_index(op.f("ix_locale_trans_key"), "locale", ["trans_key"], unique=False)

    op.create_table(
        "site-navigation",
        sa.Column("id", sa.BigInteger(), autoincrement=True, nullable=False),
        sa.Column("parent_id", sa.BigInteger(), nullable=True),
        sa.Column("key", sa.String(length=255), nullable=False),
        sa.Column("label_key", sa.String(length=255), nullable=False),
        sa.Column("description_key", sa.String(length=255), nullable=True),
        sa.Column("href", sa.Text(), nullable=False),
        sa.Column("icon", sa.String(length=100), nullable=True),
        sa.Column("target", sa.String(length=50), nullable=True),
        sa.Column("sort_order", sa.Integer(), nullable=False),
        sa.Column("disable", postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        *_timestamps(),
        sa.ForeignKeyConstraint(["parent_id"], ["site-navigation.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_site_navigation_parent_id", "site-navigation", ["parent_id"], unique=False)
    op.create_index("ix_site_navigation_key", "site-navigation", ["key"], unique=True)
    op.create_index("ix_site_navigation_label_key", "site-navigation", ["label_key"], unique=False)
    op.create_index("ix_site_navigation_sort_order", "site-navigation", ["sort_order"], unique=False)

    op.create_table(
        "post",
        sa.Column("id", sa.BigInteger(), autoincrement=True, nullable=False),
        sa.Column("title_key", sa.String(length=255), nullable=False),
        sa.Column("description_key", sa.String(length=255), nullable=True),
        sa.Column("content", sa.Text(), nullable=False),
        sa.Column("is_featured", sa.Boolean(), nullable=False),
        sa.Column("disable", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        *_timestamps(),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_post_is_featured", "post", ["is_featured"], unique=False)
    op.create_index(op.f("ix_post_title_key"), "post", ["title_key"], unique=True)
    op.create_index(op.f("ix_post_description_key"), "post", ["description_key"], unique=True)

    op.create_table(
        "post_tag",
        sa.Column("id", sa.BigInteger(), autoincrement=True, nullable=False),
        sa.Column("key", sa.String(length=255), nullable=False),
        *_timestamps(),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_post_tag_key"), "post_tag", ["key"], unique=True)

    op.create_table(
        "project",
        sa.Column("id", sa.BigInteger(), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("full_name", sa.String(length=512), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("url", sa.Text(), nullable=False),
        sa.Column("homepage", sa.Text(), nullable=True),
        sa.Column("owner_login", sa.String(length=255), nullable=False),
        sa.Column("owner_avatar_url", sa.Text(), nullable=False),
        sa.Column("owner_url", sa.Text(), nullable=False),
        sa.Column("stars", sa.Integer(), nullable=False),
        sa.Column("forks", sa.Integer(), nullable=False),
        sa.Column("watchers", sa.Integer(), nullable=False),
        sa.Column("open_issues", sa.Integer(), nullable=False),
        sa.Column("primary_language_name", sa.String(length=100), nullable=True),
        sa.Column("primary_language_color", sa.String(length=20), nullable=True),
        sa.Column("topics", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column("languages", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column("language_stats", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column("contributors", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column("is_fork", sa.Boolean(), nullable=False),
        sa.Column("is_archived", sa.Boolean(), nullable=False),
        sa.Column("is_pinned", sa.Boolean(), nullable=False),
        sa.Column("license", sa.String(length=255), nullable=True),
        sa.Column("github_created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("github_updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("github_pushed_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("activity_score", sa.Float(), nullable=True),
        sa.Column("display_weight", sa.Float(), nullable=True),
        sa.Column("weight", sa.Float(), nullable=True),
        *_timestamps(),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_project_full_name"), "project", ["full_name"], unique=True)
    op.create_index(op.f("ix_project_owner_login"), "project", ["owner_login"], unique=False)
    op.create_index(op.f("ix_project_primary_language_name"), "project", ["primary_language_name"], unique=False)
    op.create_index(op.f("ix_project_is_fork"), "project", ["is_fork"], unique=False)
    op.create_index(op.f("ix_project_is_archived"), "project", ["is_archived"], unique=False)
    op.create_index(op.f("ix_project_is_pinned"), "project", ["is_pinned"], unique=False)
    op.create_index(op.f("ix_project_github_updated_at"), "project", ["github_updated_at"], unique=False)
    op.create_index(op.f("ix_project_weight"), "project", ["weight"], unique=False)

    op.create_table(
        "post_post_tag",
        sa.Column("post_id", sa.BigInteger(), nullable=False),
        sa.Column("tag_id", sa.BigInteger(), nullable=False),
        sa.ForeignKeyConstraint(["post_id"], ["post.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["tag_id"], ["post_tag.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("post_id", "tag_id"),
    )

    op.create_table(
        "site_setting",
        sa.Column("id", sa.BigInteger(), autoincrement=True, nullable=False),
        sa.Column("parent_id", sa.BigInteger(), nullable=True),
        sa.Column("key", sa.String(length=255), nullable=False),
        sa.Column("value", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("is_public", sa.Boolean(), nullable=False),
        sa.Column("is_enabled", sa.Boolean(), nullable=False),
        *_timestamps(),
        sa.ForeignKeyConstraint(["parent_id"], ["site_setting.id"], ondelete="SET NULL"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("key"),
    )
    op.create_index("ix_site_setting_parent_id", "site_setting", ["parent_id"], unique=False)
    op.create_index("ix_site_setting_key", "site_setting", ["key"], unique=False)
    op.create_index("ix_site_setting_is_public", "site_setting", ["is_public"], unique=False)
    op.create_index("ix_site_setting_is_enabled", "site_setting", ["is_enabled"], unique=False)

    op.create_table(
        "static_content",
        sa.Column("id", sa.BigInteger(), autoincrement=True, nullable=False),
        sa.Column("key", sa.String(length=255), nullable=False),
        sa.Column("locale_id", sa.Integer(), nullable=True),
        sa.Column("content", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("is_enabled", sa.Boolean(), nullable=False),
        sa.Column("sort_order", sa.Integer(), nullable=False),
        *_timestamps(),
        sa.ForeignKeyConstraint(["locale_id"], ["locale.id"], ondelete="SET NULL"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_static_content_key", "static_content", ["key"], unique=False)
    op.create_index("ix_static_content_locale_id", "static_content", ["locale_id"], unique=False)
    op.create_index("ix_static_content_is_enabled", "static_content", ["is_enabled"], unique=False)
    op.create_index("ix_static_content_sort_order", "static_content", ["sort_order"], unique=False)
    op.create_index(
        "uq_static_content_key_locale",
        "static_content",
        ["key", "locale_id"],
        unique=True,
        postgresql_where=sa.text("locale_id IS NOT NULL"),
    )
    op.create_index(
        "uq_static_content_key_global",
        "static_content",
        ["key"],
        unique=True,
        postgresql_where=sa.text("locale_id IS NULL"),
    )


def downgrade() -> None:
    op.drop_index("uq_static_content_key_global", table_name="static_content", postgresql_where=sa.text("locale_id IS NULL"))
    op.drop_index(
        "uq_static_content_key_locale",
        table_name="static_content",
        postgresql_where=sa.text("locale_id IS NOT NULL"),
    )
    op.drop_index("ix_static_content_sort_order", table_name="static_content")
    op.drop_index("ix_static_content_is_enabled", table_name="static_content")
    op.drop_index("ix_static_content_locale_id", table_name="static_content")
    op.drop_index("ix_static_content_key", table_name="static_content")
    op.drop_table("static_content")
    op.drop_index("ix_site_setting_is_enabled", table_name="site_setting")
    op.drop_index("ix_site_setting_is_public", table_name="site_setting")
    op.drop_index("ix_site_setting_key", table_name="site_setting")
    op.drop_index("ix_site_setting_parent_id", table_name="site_setting")
    op.drop_table("site_setting")
    op.drop_table("post_post_tag")
    op.drop_index(op.f("ix_project_weight"), table_name="project")
    op.drop_index(op.f("ix_project_github_updated_at"), table_name="project")
    op.drop_index(op.f("ix_project_is_pinned"), table_name="project")
    op.drop_index(op.f("ix_project_is_archived"), table_name="project")
    op.drop_index(op.f("ix_project_is_fork"), table_name="project")
    op.drop_index(op.f("ix_project_primary_language_name"), table_name="project")
    op.drop_index(op.f("ix_project_owner_login"), table_name="project")
    op.drop_index(op.f("ix_project_full_name"), table_name="project")
    op.drop_table("project")
    op.drop_index(op.f("ix_post_tag_key"), table_name="post_tag")
    op.drop_table("post_tag")
    op.drop_index(op.f("ix_post_description_key"), table_name="post")
    op.drop_index(op.f("ix_post_title_key"), table_name="post")
    op.drop_index("ix_post_is_featured", table_name="post")
    op.drop_table("post")
    op.drop_index(op.f("ix_locale_trans_key"), table_name="locale")
    op.drop_index(op.f("ix_locale_code"), table_name="locale")
    op.drop_table("locale")
    op.drop_index("ix_site_navigation_sort_order", table_name="site-navigation")
    op.drop_index("ix_site_navigation_label_key", table_name="site-navigation")
    op.drop_index("ix_site_navigation_key", table_name="site-navigation")
    op.drop_index("ix_site_navigation_parent_id", table_name="site-navigation")
    op.drop_table("site-navigation")
    op.drop_index("ix_embedding_source", table_name="embedding")
    op.drop_table("embedding")
    op.drop_index(op.f("ix_dictionary_key"), table_name="dictionary")
    op.drop_table("dictionary")
