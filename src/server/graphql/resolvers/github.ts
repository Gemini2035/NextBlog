import {
  getAllUserRepositories,
  transformRepositories,
  filterRepositoriesByOptions,
  generateProjectStats,
  getRateLimit,
} from '@/server/github'
import { getGithubThirdPartyConfig } from '@/server/github/config'
import type { ProcessedRepository, ProjectStats } from '@/server/github'

function mapProjectToGraphql(project: ProcessedRepository) {
  return {
    id: project.id,
    name: project.name,
    fullName: project.fullName,
    description: project.description,
    url: project.url,
    homepage: project.homepage,
    owner: {
      login: project.owner.login,
      avatarUrl: project.owner.avatarUrl,
      url: project.owner.url,
    },
    stars: project.stars,
    forks: project.forks,
    watchers: project.watchers,
    openIssues: project.openIssues,
    primaryLanguage: project.primaryLanguage
      ? {
          name: project.primaryLanguage.name,
          color: project.primaryLanguage.color,
        }
      : null,
    languages: project.languages ? Object.keys(project.languages) : [],
    languageStats: project.languageStats?.map((lang) => ({
      name: lang.name,
      color: lang.color,
      percentage: lang.percentage,
      bytes: lang.bytes,
    })) ?? [],
    topics: project.topics,
    isFork: project.isFork,
    isArchived: project.isArchived,
    isTemplate: project.isTemplate ?? false,
    isPrivate: project.isPrivate ?? false,
    isFeatured: project.isFeatured ?? false,
    isPinned: project.isPinned ?? false,
    license: project.license,
    defaultBranch: project.defaultBranch ?? 'main',
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString(),
    pushedAt: project.pushedAt.toISOString(),
    activityScore: project.activityScore ?? null,
    displayWeight: project.displayWeight ?? null,
    weight: project.weight ?? null,
  }
}

function createEmptyStats(): ProjectStats {
  return {
    totalProjects: 0,
    totalStars: 0,
    totalForks: 0,
    languageDistribution: [],
    categoryDistribution: {
      featured: 0,
      active: 0,
      stable: 0,
      completed: 0,
      archived: 0,
      fork: 0,
      learning: 0,
    },
    activeProjects: 0,
    archivedProjects: 0,
  }
}

export const githubResolvers = {
  async githubProjects() {
    try {
      const thirdPartyConfig = await getGithubThirdPartyConfig()
      const fetchOptions = thirdPartyConfig.fetchOptions

      // 1. 先检查 API 速率限制
      let currentRateLimit = null
      try {
        currentRateLimit = await getRateLimit()
        if (currentRateLimit.remaining < 100) {
          const resetDate = new Date(currentRateLimit.resetAt)
          const resetTime = resetDate.toLocaleTimeString('zh-CN')
          return {
            projects: [],
            stats: createEmptyStats(),
            rateLimit: currentRateLimit,
            error: `API 速率限制不足！剩余 ${currentRateLimit.remaining} 次请求，需要至少 100 次。请在 ${resetTime} 后重试。`,
          }
        }
      } catch (rateLimitError) {
        console.warn('无法获取速率限制信息，继续执行:', rateLimitError)
      }

      // 2. 获取所有仓库（通过 GitHub GraphQL，用户名与访问配置来自数据库）
      const repoType = fetchOptions?.repoType ?? 'owner'
      const includeForked = fetchOptions?.includeForked ?? false
      const includeArchived = fetchOptions?.includeArchived ?? false
      const minStars = fetchOptions?.minStars ?? 0
      const maxProjects = fetchOptions?.maxProjects ?? 100
      const maxPages = fetchOptions?.maxPages ?? 10

      const affiliations =
        repoType === 'all'
          ? ['OWNER', 'COLLABORATOR', 'ORGANIZATION_MEMBER'] as const
          : repoType === 'member'
          ? ['COLLABORATOR', 'ORGANIZATION_MEMBER'] as const
          : ['OWNER'] as const

      const rawRepositories = await getAllUserRepositories({
        maxPages,
        orderBy: 'UPDATED_AT',
        direction: 'DESC',
        affiliations: [...affiliations],
      })

      // 将 GraphQL 原始仓库数据转换为应用层的 ProcessedRepository
      let projects = transformRepositories(rawRepositories, fetchOptions?.featuredRepos ?? [])

      // 3. 应用筛选
      projects = filterRepositoriesByOptions(projects, {
        includeForked,
        includeArchived,
        minStars,
        maxProjects,
      })

      // 4. 生成统计数据
      const stats = generateProjectStats(projects, thirdPartyConfig.username)

      // 5. 获取速率限制信息
      let rateLimit = currentRateLimit
      if (!rateLimit) {
        try {
          rateLimit = await getRateLimit()
        } catch (error) {
          console.warn('Failed to fetch rate limit:', error)
        }
      }

      return {
        projects: projects.map(mapProjectToGraphql),
        stats: {
          totalProjects: stats.totalProjects,
          totalStars: stats.totalStars,
          totalForks: stats.totalForks,
          languageDistribution: stats.languageDistribution.map((lang) => ({
            name: lang.name,
            color: lang.color,
            percentage: lang.percentage,
            bytes: lang.bytes,
          })),
          activeProjects: stats.activeProjects,
          archivedProjects: stats.archivedProjects,
        },
        rateLimit,
        error: null,
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch repositories'
      console.error('GitHub GraphQL resolver error:', message)
      return {
        projects: [],
        stats: createEmptyStats(),
        rateLimit: null,
        error: message,
      }
    }
  },
}

