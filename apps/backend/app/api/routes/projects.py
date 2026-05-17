from enum import Enum

from fastapi import APIRouter, HTTPException

from app.schemas import ApiResponse, ProjectDetailPayload, ProjectsPayload
from app.services import projects

prefix = "/projects"
tags: list[str | Enum] = ["projects"]
router = APIRouter()

@router.get("", response_model=ApiResponse[ProjectsPayload])
def get_projects() -> ApiResponse[ProjectsPayload]:
    return ApiResponse[ProjectsPayload](
        data=ProjectsPayload.model_validate(projects.get_projects()),
    )

@router.get("/{id}", response_model=ApiResponse[ProjectDetailPayload])
def get_project_detail(id: str) -> ApiResponse[ProjectDetailPayload]:
    project = projects.get_project_detail(id)

    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")

    return ApiResponse[ProjectDetailPayload](
        data=ProjectDetailPayload.model_validate(
            {
                "project": project,
                "source": "mock",
            }
        ),
    )
