/**
 * GitHub 仓库数据 Hook（使用 SWR）
 * 提供客户端缓存和自动重新验证
 */

'use client'

import useSWR from 'swr'
import { GITHUB_PROJECTS_QUERY, type GithubProjectsResultDto } from '@/graphql/queries/githubProjects.graphql'
import type { ProcessedRepository, ProjectStats } from '@/server/github'

/**
 * Hook 返回类型
 */
export interface UseGitHubRepositoriesResult {
  projects: ProcessedRepository[]
  stats: ProjectStats | null
  rateLimit: {
    limit: number
    remaining: number
    resetAt: string
    used: number
  } | null
  isLoading: boolean
  isError: boolean
  error: string | null
  mutate: () => void
}

/**
 * 使用 GitHub 仓库数据
 * 
 * @example
 * ```tsx
 * const { projects, stats, isLoading } = useGitHubRepositories({
 *   username: 'Gemini2035',
 *   repoType: 'owner'
 * })
 * ```
 */
export function useGitHubRepositories(
  // 参数现在仅用于生成缓存 key，实际 GitHub 请求配置全部在后端与数据库中
  params: Record<string, unknown> = {},
  swrOptions: {
    refreshInterval?: number
    revalidateOnFocus?: boolean
    revalidateOnReconnect?: boolean
    dedupingInterval?: number
  } = {}
): UseGitHubRepositoriesResult {
  const {
    refreshInterval = 0,
    revalidateOnFocus = false,
    revalidateOnReconnect = true,
    dedupingInterval = 60000, // 60秒内不重复请求
  } = swrOptions

  // 生成唯一的缓存key
  const cacheKey = ['github-repositories', JSON.stringify(params)]

  // 使用 SWR 获取数据（通过 BFF GraphQL /api/graphql）
  const { data, error, isLoading, mutate } = useSWR(
    cacheKey,
    async () => {
      const response = await fetch('/api/graphql', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          query: GITHUB_PROJECTS_QUERY,
        }),
      })

      if (!response.ok) {
        throw new Error(`GitHub GraphQL 请求失败，状态码：${response.status}`)
      }

      const json = (await response.json()) as {
        data?: GithubProjectsResultDto
        errors?: { message: string }[]
      }

      if (json.errors && json.errors.length > 0) {
        const message = json.errors.map((e) => e.message).join('; ')
        throw new Error(message || 'GitHub GraphQL 返回错误')
      }

      const payload = json.data?.githubProjects

      if (!payload) {
        throw new Error('GitHub GraphQL 响应中缺少 data.githubProjects 字段')
      }

      if (payload.error) {
        throw new Error(payload.error)
      }

      const projects: ProcessedRepository[] = payload.projects.map((p) => ({
        id: p.id,
        name: p.name,
        fullName: p.fullName,
        description: p.description,
        url: p.url,
        homepage: p.homepage,
        owner: {
          login: p.owner.login,
          avatarUrl: p.owner.avatarUrl,
          url: p.owner.url,
        },
        stars: p.stars,
        forks: p.forks,
        watchers: p.watchers,
        openIssues: p.openIssues,
        primaryLanguage: p.primaryLanguage
          ? {
              name: p.primaryLanguage.name,
              color: p.primaryLanguage.color,
            }
          : null,
        languages: p.languages.reduce<Record<string, number>>((acc, name) => {
          acc[name] = 0
          return acc
        }, {}),
        languageStats: p.languageStats.map((lang) => ({
          name: lang.name,
          color: lang.color,
          percentage: lang.percentage,
          bytes: lang.bytes,
        })),
        topics: p.topics,
        isFork: p.isFork,
        isArchived: p.isArchived,
        isTemplate: p.isTemplate ?? false,
        isPrivate: p.isPrivate ?? false,
        isFeatured: p.isFeatured ?? false,
        isPinned: p.isPinned ?? false,
        license: p.license,
        defaultBranch: p.defaultBranch ?? 'main',
        createdAt: new Date(p.createdAt),
        updatedAt: new Date(p.updatedAt),
        pushedAt: new Date(p.pushedAt),
        activityScore: p.activityScore ?? undefined,
        displayWeight: p.displayWeight ?? undefined,
        weight: p.weight ?? undefined,
      }))

      const stats: ProjectStats = {
        totalProjects: payload.stats.totalProjects,
        totalStars: payload.stats.totalStars,
        totalForks: payload.stats.totalForks,
        activeProjects: payload.stats.activeProjects,
        archivedProjects: payload.stats.archivedProjects,
        languageDistribution: (payload.stats.languageDistribution ?? []).map((lang) => ({
          name: lang.name,
          color: lang.color,
          percentage: lang.percentage,
          bytes: lang.bytes,
        })),
        // 这些字段在 GraphQL 中未暴露，由服务端内部使用时再计算
        categoryDistribution: {} as ProjectStats['categoryDistribution'],
      }

      return {
        projects,
        stats,
        rateLimit: payload.rateLimit,
      }
    },
    {
      refreshInterval,
      revalidateOnFocus,
      revalidateOnReconnect,
      dedupingInterval,
      // 失败时不自动重试（我们在 action 中已经有重试逻辑）
      shouldRetryOnError: false,
      // 保持之前的数据直到新数据到来
      keepPreviousData: true,
    }
  )

  return {
    projects: data?.projects || [],
    stats: data?.stats || null,
    rateLimit: data?.rateLimit || null,
    isLoading,
    isError: !!error,
    error: error?.message || null,
    mutate,
  }
}

