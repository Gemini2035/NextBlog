from fastapi import APIRouter, HTTPException
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError

from app.core.config import settings
from app.database.session import get_engine

router = APIRouter()


@router.get("")
def health_check() -> dict[str, str]:
    return {"status": "ok"}


@router.get("/db")
def database_health_check() -> dict[str, str]:
    if not settings.sqlalchemy_database_url:
        return {
            "status": "error",
            "database": "not_configured",
        }

    try:
        with get_engine().connect() as connection:
            connection.execute(text("select 1")).scalar_one()
            database_name = connection.execute(text("select current_database()")).scalar_one()
    except SQLAlchemyError as error:
        raise HTTPException(status_code=503, detail="Database unavailable") from error

    return {
        "status": "ok",
        "database": str(database_name),
    }
