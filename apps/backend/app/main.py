from fastapi import FastAPI

from app.api.router import api_router
from app.core.config import settings
from app.graphql.router import graphql_router

app = FastAPI(title=settings.project_name)
app.include_router(api_router, prefix=settings.api_prefix_restful)
app.include_router(graphql_router, prefix=settings.api_prefix_graphql)


@app.get("/")
def read_root() -> dict[str, str]:
    return {"service": settings.project_name, "status": "ok"}
