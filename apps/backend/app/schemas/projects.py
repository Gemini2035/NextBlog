from typing import Literal

from pydantic import BaseModel


class LanguageStat(BaseModel):
    name: str
    color: str
    percentage: float
    bytes: int


class ContributorStat(BaseModel):
    login: str
    avatarUrl: str
    profileUrl: str
    contributions: int
    name: str | None = None
    percentage: float | None = None


class ProjectOwner(BaseModel):
    login: str
    avatarUrl: str
    url: str


class PrimaryLanguage(BaseModel):
    name: str
    color: str


class ProjectStatsGroup(BaseModel):
    count: int
    stars: int
    forks: int
    languages: int


class ProjectStats(BaseModel):
    totalProjects: int
    totalStars: int
    totalForks: int
    languageDistribution: list[LanguageStat]
    categoryDistribution: dict[str, int]
    activeProjects: int
    archivedProjects: int
    ownedStats: ProjectStatsGroup | None = None
    contributedStats: ProjectStatsGroup | None = None


class RateLimit(BaseModel):
    limit: int
    remaining: int
    resetAt: str
    used: int


class ProjectListItem(BaseModel):
    id: int
    name: str
    description: str
    stars: int
    forks: int
    primaryLanguage: PrimaryLanguage | None = None
    topics: list[str]
    isFork: bool
    isArchived: bool
    isPinned: bool
    createdAt: str
    updatedAt: str
    pushedAt: str
    weight: float | None = None
    contributorCount: int


class ProjectDetail(ProjectListItem):
    fullName: str
    url: str
    homepage: str | None = None
    watchers: int
    openIssues: int
    owner: ProjectOwner
    languages: dict[str, int]
    languageStats: list[LanguageStat]
    contributors: list[ContributorStat]
    isTemplate: bool = False
    isPrivate: bool = False
    isFeatured: bool = False
    license: str | None = None
    defaultBranch: str = "main"
    activityScore: float | None = None
    displayWeight: float | None = None


class ProjectsPayload(BaseModel):
    projects: list[ProjectListItem]
    stats: ProjectStats
    rateLimit: RateLimit | None = None
    source: Literal["mock", "database"] = "mock"


class ProjectDetailPayload(BaseModel):
    project: ProjectDetail
    source: Literal["mock", "database"] = "mock"
