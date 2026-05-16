/**
 * BFF GraphQL 查询 - GitHub 项目列表
 */

export const GITHUB_PROJECTS_QUERY = /* GraphQL */ `
  query GithubProjects {
    githubProjects {
      error
      rateLimit {
        limit
        remaining
        resetAt
        used
      }
      stats {
        totalProjects
        totalStars
        totalForks
        activeProjects
        archivedProjects
        languageDistribution {
          name
          color
          percentage
          bytes
        }
      }
      projects {
        id
        name
        fullName
        description
        url
        homepage
        owner {
          login
          avatarUrl
          url
        }
        stars
        forks
        watchers
        openIssues
        primaryLanguage {
          name
          color
        }
        languages
        languageStats {
          name
          color
          percentage
          bytes
        }
        topics
        isFork
        isArchived
        isTemplate
        isPrivate
        isFeatured
        isPinned
        license
        defaultBranch
        createdAt
        updatedAt
        pushedAt
        activityScore
        displayWeight
        weight
      }
    }
  }
`

export interface GithubLanguageStatDto {
  name: string
  color: string
  percentage: number
  bytes: number
}

export interface GithubProjectStatsDto {
  totalProjects: number
  totalStars: number
  totalForks: number
  activeProjects: number
  archivedProjects: number
  languageDistribution: GithubLanguageStatDto[]
}

export interface GithubOwnerDto {
  login: string
  avatarUrl: string
  url: string
}

export interface GithubProjectDto {
  id: number
  name: string
  fullName: string
  description: string
  url: string
  homepage: string | null

  owner: GithubOwnerDto

  stars: number
  forks: number
  watchers: number
  openIssues: number

  primaryLanguage: {
    name: string
    color: string
  } | null
  languages: string[]
  languageStats: GithubLanguageStatDto[]

  topics: string[]
  isFork: boolean
  isArchived: boolean
  isTemplate?: boolean | null
  isPrivate?: boolean | null
  isFeatured?: boolean | null
  isPinned?: boolean | null

  license: string | null
  defaultBranch?: string | null

  createdAt: string
  updatedAt: string
  pushedAt: string

  activityScore?: number | null
  displayWeight?: number | null
  weight?: number | null
}

export interface GithubRateLimitDto {
  limit: number
  remaining: number
  resetAt: string
  used: number
}

export interface GithubProjectsResultDto {
  githubProjects: {
    projects: GithubProjectDto[]
    stats: GithubProjectStatsDto
    rateLimit: GithubRateLimitDto | null
    error: string | null
  }
}

