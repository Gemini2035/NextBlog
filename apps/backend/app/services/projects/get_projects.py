from copy import deepcopy

from .mock import MOCK_PROJECTS, MOCK_STATS, ProjectsPayload


def get_projects() -> ProjectsPayload:
    return {
        "projects": deepcopy(MOCK_PROJECTS),
        "stats": deepcopy(MOCK_STATS),
        "rateLimit": None,
        "source": "mock",
    }
