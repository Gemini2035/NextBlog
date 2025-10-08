/**
 * GitHub GraphQL Server Actions
 * Next.js 推荐的服务端数据获取方式
 */

'use server'

import {
  getAllUserRepositories,
  getRepositoryDetail,
  getRateLimit,
  transformRepositories,
  filterRepositoriesByOptions,
  generateProjectStats,
} from '@/services/github'
import { cache } from 'react'
import type {
  ProcessedRepository,
  ProjectStats,
  RepositoryAffiliation,
} from '@/services/github'

/**
 * 仓库列表响应
 */
export interface GetReposResult {
  success: boolean
  data?: {
    projects: ProcessedRepository[]
    stats: ProjectStats
    rateLimit: {
      limit: number
      remaining: number
      resetAt: string
      used: number
    } | null
  }
  error?: string
}

/**
 * 仓库详情响应
 */
export interface GetRepoDetailResult {
  success: boolean
  data?: {
    project: ProcessedRepository
    rateLimit: {
      limit: number
      remaining: number
      resetAt: string
      used: number
    } | null
  }
  error?: string
}

/**
 * 获取仓库列表参数
 */
export interface GetReposParams {
  username?: string
  repoType?: 'all' | 'owner' | 'member' | 'public'
  includeForked?: boolean
  includeArchived?: boolean
  minStars?: number
  maxProjects?: number
  maxPages?: number
  featuredRepos?: string[]
}

/**
 * Server Action: 获取 GitHub 仓库列表（使用 GraphQL）
 *
 * 优势：
 * - 一次请求获取仓库 + 语言 + 贡献者数据
 * - API 调用次数从 300+ 减少到 1-3 次
 * - 性能提升 50%+
 */
export const getGitHubRepositories = cache(
  async (params: GetReposParams = {}): Promise<GetReposResult> => {
    try {
      const {
        username = 'Gemini2035',
        repoType = 'owner',
        includeForked = false,
        includeArchived = false,
        minStars = 0,
        maxProjects = 100,
        maxPages = 10,
        featuredRepos = [],
      } = params

      // 1. 先检查API速率限制
      try {
        const currentRateLimit = await getRateLimit()
        console.log('🔍 当前API速率限制:', currentRateLimit)
        
        if (currentRateLimit.remaining < 100) {
          const resetDate = new Date(currentRateLimit.resetAt)
          const resetTime = resetDate.toLocaleTimeString('zh-CN')
          
          return {
            success: false,
            error: `API 速率限制不足！剩余 ${currentRateLimit.remaining} 次请求，需要至少 100 次。请在 ${resetTime} 后重试。`
          }
        }
      } catch (rateLimitError) {
        console.warn('无法获取速率限制信息，继续执行:', rateLimitError)
      }

      // 2. 转换 repoType 为 GraphQL affiliations
      const affiliations: RepositoryAffiliation[] =
        repoType === 'owner'
          ? ['OWNER']
          : repoType === 'member'
            ? ['COLLABORATOR', 'ORGANIZATION_MEMBER']
            : ['OWNER', 'COLLABORATOR', 'ORGANIZATION_MEMBER']

      // 3. 获取所有仓库（GraphQL 自动包含语言和贡献者数据）
      const graphqlRepos = await getAllUserRepositories(username, {
        maxPages,
        orderBy: 'UPDATED_AT',
        direction: 'DESC',
        affiliations,
      })

      console.log('📦 GraphQL 原始数据（前3个）:', graphqlRepos.slice(0, 3).map(r => ({
        name: r.nameWithOwner,
        stars: r.stargazerCount,
        forks: r.forkCount,
      })))

      // 转换为 ProcessedRepository 格式
      let projects = transformRepositories(graphqlRepos, featuredRepos)
      
      console.log('✅ 转换后的数据（前3个）:', projects.slice(0, 3).map(p => ({
        name: p.fullName,
        stars: p.stars,
        forks: p.forks,
      })))

      // 应用筛选
      projects = filterRepositoriesByOptions(projects, {
        includeForked,
        includeArchived,
        minStars,
        maxProjects,
      })

      // 生成统计数据
      const stats = generateProjectStats(projects, username)

      // 获取速率限制信息
      let rateLimit = null
      try {
        rateLimit = await getRateLimit()
      } catch (error) {
        console.warn('Failed to fetch rate limit:', error)
      }

      return {
        success: true,
        data: {
          projects,
          stats,
          rateLimit,
        },
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to fetch repositories'
      console.error('GraphQL API Error:', errorMessage)
      return {
        success: false,
        error: errorMessage,
      }
    }
  }
)

/**
 * Server Action: 获取单个仓库详情（使用 GraphQL）
 */
export const getGitHubRepositoryDetail = cache(
  async (owner: string, repo: string): Promise<GetRepoDetailResult> => {
    try {
      // 获取仓库详细信息（包含语言和贡献者）
      const graphqlRepo = await getRepositoryDetail(owner, repo)

      // 转换为 ProcessedRepository 格式
      const project = transformRepositories([graphqlRepo])[0]

      // 获取速率限制信息
      let rateLimit = null
      try {
        rateLimit = await getRateLimit()
      } catch (error) {
        console.warn('Failed to fetch rate limit:', error)
      }

      return {
        success: true,
        data: {
          project,
          rateLimit,
        },
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to fetch repository detail'
      console.error('GraphQL API Error:', errorMessage)
      return {
        success: false,
        error: errorMessage,
      }
    }
  }
)

/**
 * Server Action: 带重试的获取仓库列表
 */
export async function getGitHubRepositoriesWithRetry(
  params: GetReposParams = {},
  maxRetries: number = 2
): Promise<GetReposResult> {
  let lastResult: GetReposResult = { success: false, error: 'Unknown error' }

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    lastResult = await getGitHubRepositories(params)

    if (lastResult.success) {
      return lastResult
    }

    if (attempt < maxRetries) {
      await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)))
    }
  }

  return lastResult
}
