from enum import Enum

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas import ApiResponse, ProjectDetailPayload, ProjectsPayload
from app.services import projects

prefix = "/projects"
tags: list[str | Enum] = ["projects"]
router = APIRouter()

@router.get("", response_model=ApiResponse[ProjectsPayload])
def get_projects(db: Session = Depends(get_db)) -> ApiResponse[ProjectsPayload]:
    return ApiResponse[ProjectsPayload](
        data=ProjectsPayload.model_validate(projects.get_projects(db)),
    )

@router.get("/{id}", response_model=ApiResponse[ProjectDetailPayload])
def get_project_detail(id: str, db: Session = Depends(get_db)) -> ApiResponse[ProjectDetailPayload]:
    project = projects.get_project_detail(db, id)

    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")

    return ApiResponse[ProjectDetailPayload](
        data=ProjectDetailPayload.model_validate(
            {
                "project": project,
                "source": "database",
            }
        ),
    )
