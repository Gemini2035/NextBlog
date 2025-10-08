/**
 * GitHub Server Actions
 * Next.js 推荐的服务端数据获取方式
 * 优势：类型安全、自动序列化、无需手动fetch
 */

'use server'

import { 
  githubApiService,
  processRepositories, 
  processRepository, 
  generateProjectStats 
} from '@/services'
import { cache } from 'react'
import type { 
  ProcessedRepository, 
  ProjectStats, 
  GitHubRateLimit,
  GitHubLanguages,
  GitHubContributor
} from '@/types/github'

/**
 * 仓库列表响应
 */
export interface GetReposResult {
  success: boolean
  data?: {
    projects: ProcessedRepository[]
    stats: ProjectStats
    rateLimit: GitHubRateLimit | null
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
    rateLimit: GitHubRateLimit | null
  }
  error?: string
}

/**
 * 获取仓库列表参数
 */
export interface GetReposParams {
  username?: string
  repoType?: 'all' | 'owner' | 'member' | 'public'  // 仓库类型
  includeForked?: boolean
  includeArchived?: boolean
  minStars?: number
  maxProjects?: number
  maxPages?: number
  includeLanguages?: boolean        // 是否获取语言占比（会增加API调用）
  includeContributors?: boolean     // 是否获取贡献者（会增加API调用）
}

/**
 * Server Action: 获取GitHub仓库列表
 * 
 * 使用示例:
 * ```ts
 * const result = await getGitHubRepositories({ username: 'xxx' })
 * if (result.success) {
 *   console.log(result.data.projects)
 * }
 * ```
 */
export const getGitHubRepositories = cache(async (params: GetReposParams = {}): Promise<GetReposResult> => {
  try {
    const {
      username = 'Gemini2035',
      repoType = 'owner',            // 默认只获取自己创建的
      includeForked = false,
      includeArchived = false,
      minStars = 0,
      maxProjects = 100,
      maxPages = 10,
      includeLanguages = false,      // 默认不获取（节省API调用）
      includeContributors = false,   // 默认不获取（节省API调用）
    } = params

    // 获取所有仓库
    const repos = await githubApiService.getAllUserRepositories(username, maxPages, repoType)

    // 应用筛选
    let filteredRepos = repos
    
    if (!includeForked) {
      filteredRepos = filteredRepos.filter(repo => !repo.fork)
    }
    
    if (!includeArchived) {
      filteredRepos = filteredRepos.filter(repo => !repo.archived)
    }
    
    if (minStars > 0) {
      filteredRepos = filteredRepos.filter(repo => repo.stargazers_count >= minStars)
    }
    
    if (maxProjects && filteredRepos.length > maxProjects) {
      filteredRepos = filteredRepos.slice(0, maxProjects)
    }

    // 如果需要获取详细信息（语言、贡献者）
    let detailsMap: Map<string, { languages?: GitHubLanguages; contributors?: GitHubContributor[] }> | undefined
    if (includeLanguages || includeContributors) {
      detailsMap = await githubApiService.batchGetRepositoryDetails(filteredRepos, {
        includeLanguages,
        includeContributors,
        maxConcurrent: 5,
      })
    }

    // 处理数据
    const projects = processRepositories(filteredRepos, detailsMap)
    const stats = generateProjectStats(projects)
    const rateLimit = githubApiService.getRateLimit()

    return {
      success: true,
      data: {
        projects,
        stats,
        rateLimit,
      }
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch repositories'
    return {
      success: false,
      error: errorMessage
    }
  }
})

/**
 * Server Action: 获取单个仓库详情
 */
export const getGitHubRepositoryDetail = cache(async (
  owner: string,
  repo: string,
  includeLanguages: boolean = true,
  includeContributors: boolean = true
): Promise<GetRepoDetailResult> => {
  try {
    // 获取仓库基本信息
    const repository = await githubApiService.getRepository(owner, repo)

    // 获取详细信息
    let languages
    let contributors

    if (includeLanguages) {
      languages = await githubApiService.getRepositoryLanguages(owner, repo)
    }

    if (includeContributors) {
      contributors = await githubApiService.getRepositoryContributors(owner, repo)
    }

    // 处理数据
    const project = processRepository(repository, languages, contributors)
    const rateLimit = githubApiService.getRateLimit()

    return {
      success: true,
      data: {
        project,
        rateLimit,
      }
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch repository detail'
    return {
      success: false,
      error: errorMessage
    }
  }
})

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
      await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)))
    }
  }

  return lastResult
}

