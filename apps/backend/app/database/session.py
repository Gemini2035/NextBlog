from collections.abc import Generator
from functools import lru_cache

from sqlalchemy import Engine, create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.core.config import settings


@lru_cache
def get_engine() -> Engine:
    database_url = settings.sqlalchemy_database_url
    if not database_url:
        raise RuntimeError("DATABASE_URL is not configured")

    return create_engine(
        database_url,
        pool_pre_ping=True,
        pool_size=1,
        max_overflow=2,
        pool_recycle=300,
    )


SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    expire_on_commit=False,
)


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal(bind=get_engine())
    try:
        yield db
    finally:
        db.close()
