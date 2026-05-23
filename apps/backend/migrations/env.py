from logging.config import fileConfig
from typing import Any

from sqlalchemy import engine_from_config
from sqlalchemy import pool
from sqlalchemy.sql.type_api import TypeEngine

from alembic import context
from app.core.config import settings
from app.database.base import Base
from app import models  # noqa: F401

# this is the Alembic Config object, which provides
# access to the values within the .ini file in use.
config = context.config

# Interpret the config file for Python logging.
# This line sets up loggers basically.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata

database_url = settings.sqlalchemy_migration_database_url
if not database_url:
    raise RuntimeError(
        "Database migration URL is not configured. "
        "Set NEXT_DATABASE_URL_UNPOOLED, DATABASE_URL_UNPOOLED, "
        "NEXT_DATABASE_URL, or DATABASE_URL."
    )

config.set_main_option("sqlalchemy.url", database_url)


def render_item(type_: str, object_: Any, autogen_context: Any) -> str | bool:
    if type_ == "type" and isinstance(object_, TypeEngine):
        object_class = object_.__class__
        if object_class.__module__.startswith("pgvector.sqlalchemy"):
            autogen_context.imports.add("from pgvector.sqlalchemy import Vector")
            dim = getattr(object_, "dim", None)
            return f"Vector({dim})" if dim else "Vector()"

    return False

# other values from the config, defined by the needs of env.py,
# can be acquired:
# my_important_option = config.get_main_option("my_important_option")
# ... etc.


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode.

    This configures the context with just a URL
    and not an Engine, though an Engine is acceptable
    here as well.  By skipping the Engine creation
    we don't even need a DBAPI to be available.

    Calls to context.execute() here emit the given string to the
    script output.

    """
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        render_item=render_item,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode.

    In this scenario we need to create an Engine
    and associate a connection with the context.

    """
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            render_item=render_item,
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
