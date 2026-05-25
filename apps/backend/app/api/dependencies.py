from fastapi import Header, HTTPException

from app.core.config import settings


def verify_admin_request(authorization: str | None = Header(default=None)) -> None:
    if not settings.admin_api_secret:
        raise HTTPException(status_code=500, detail="ADMIN_API_SECRET is not configured")

    if authorization != f"Bearer {settings.admin_api_secret}":
        raise HTTPException(status_code=401, detail="Unauthorized")
