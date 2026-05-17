from copy import deepcopy

from .mock import MOCK_PROJECTS, MockProject


def _get_languages(project: MockProject) -> dict[str, int]:
    return {
        language["name"]: language["bytes"]
        for language in project.get("languageStats", [])
    }


def get_project_detail(project_id: str) -> MockProject | None:
    normalized_project_id = project_id.lower()

    for project in MOCK_PROJECTS:
        identifiers = {
            str(project["id"]).lower(),
            str(project["name"]).lower(),
            str(project["fullName"]).lower(),
        }

        if normalized_project_id in identifiers:
            project_detail = deepcopy(project)
            project_detail["languages"] = _get_languages(project_detail)
            project_detail["isTemplate"] = project_detail.get("isTemplate", False)
            project_detail["isPrivate"] = project_detail.get("isPrivate", False)
            project_detail["isFeatured"] = project_detail.get("isFeatured", False)
            project_detail["defaultBranch"] = project_detail.get("defaultBranch", "main")
            project_detail["contributorCount"] = len(project_detail.get("contributors") or [])
            return project_detail

    return None
