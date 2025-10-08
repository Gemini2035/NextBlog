/**
 * GitHub API 服务
 * 封装GitHub API调用逻辑
 */

import { createHttpClient, HttpClient, HttpAxiosResponse, HttpAxiosError } from '@/http'
import type {
  GitHubRepository,
  GitHubContributor,
  GitHubLanguages,
  GitHubRepoQueryParams,
  GitHubRateLimit,
  GitHubResponseHeaders,
} from '@/types/github'

/**
 * GitHub API配置
 */
export interface GitHubApiConfig {
  token?: string
  baseURL?: string
  timeout?: number
}

/**
 * GitHub API服务类
 */
export class GitHubApiService {
  private httpClient: HttpClient
  private token?: string
  private rateLimit: GitHubRateLimit | null = null

  constructor(config?: GitHubApiConfig) {
    this.token = config?.token || process.env.NEXT_PUBLIC_GITHUB_TOKEN
    
    this.httpClient = createHttpClient({
      baseURL: config?.baseURL || 'https://api.github.com',
      timeout: config?.timeout || 30000,
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
      },
    })

    // 添加响应拦截器来提取速率限制信息
    this.httpClient.addResponseInterceptor((response: HttpAxiosResponse) => {
      this.extractRateLimit(response.headers as unknown as GitHubResponseHeaders)
      return response
    })

    // 添加错误拦截器
    this.httpClient.addErrorInterceptor(async (error: HttpAxiosError) => {
      if (error.response?.status === 403) {
        const headers = error.response.headers as Record<string, string>
        const resetTime = headers['x-ratelimit-reset']
        if (resetTime) {
          const resetDate = new Date(parseInt(resetTime) * 1000)
          console.error(`GitHub API rate limit exceeded. Resets at: ${resetDate.toLocaleString()}`)
        }
      }
      throw error
    })
  }

  /**
   * 提取速率限制信息
   */
  private extractRateLimit(headers: GitHubResponseHeaders) {
    const limit = headers['x-ratelimit-limit']
    const remaining = headers['x-ratelimit-remaining']
    const reset = headers['x-ratelimit-reset']
    const used = headers['x-ratelimit-used']

    if (limit && remaining && reset) {
      this.rateLimit = {
        limit: parseInt(limit),
        remaining: parseInt(remaining),
        reset: parseInt(reset),
        used: parseInt(used || '0'),
      }

      // 如果剩余请求数较少，输出警告
      if (this.rateLimit.remaining < 100) {
        console.warn(`GitHub API rate limit warning: ${this.rateLimit.remaining} requests remaining`)
      }
    }
  }

  /**
   * 获取当前速率限制信息
   */
  public getRateLimit(): GitHubRateLimit | null {
    return this.rateLimit
  }

  /**
   * 获取用户的所有公开仓库
   * @param username GitHub用户名
   * @param params 查询参数
   */
  public async getUserRepositories(
    username: string,
    params?: GitHubRepoQueryParams
  ): Promise<GitHubRepository[]> {
    const defaultParams: GitHubRepoQueryParams = {
      type: 'owner',
      sort: 'updated',
      direction: 'desc',
      per_page: 100,
      page: 1,
      ...params,
    }

    try {
      const response = await this.httpClient.get<GitHubRepository[]>(
        `/users/${username}/repos`,
        {
          params: defaultParams,
          retry: 2,
          retryDelay: 1000,
        }
      )

      return response.data
    } catch (error) {
      console.error('Failed to fetch user repositories:', error)
      throw error
    }
  }

  /**
   * 获取认证用户的所有仓库（需要token，可获取私有仓库）
   * @param params 查询参数
   */
  public async getAuthenticatedUserRepositories(
    params?: GitHubRepoQueryParams
  ): Promise<GitHubRepository[]> {
    if (!this.token) {
      throw new Error('GitHub token is required for this operation')
    }

    const defaultParams: GitHubRepoQueryParams = {
      type: 'owner',
      sort: 'updated',
      direction: 'desc',
      per_page: 100,
      page: 1,
      ...params,
    }

    try {
      const response = await this.httpClient.get<GitHubRepository[]>(
        '/user/repos',
        {
          params: defaultParams,
          retry: 2,
          retryDelay: 1000,
        }
      )

      return response.data
    } catch (error) {
      console.error('Failed to fetch authenticated user repositories:', error)
      throw error
    }
  }

  /**
   * 获取所有仓库（自动处理分页）
   * @param username GitHub用户名
   * @param maxPages 最大页数，防止无限循环
   * @param type 仓库类型：'owner'(自己创建) | 'member'(参与的) | 'all'(全部)
   */
  public async getAllUserRepositories(
    username: string,
    maxPages: number = 10,
    type: 'all' | 'owner' | 'member' | 'public' = 'owner'
  ): Promise<GitHubRepository[]> {
    const allRepos: GitHubRepository[] = []
    let page = 1
    let hasMore = true

    while (hasMore && page <= maxPages) {
      const repos = await this.getUserRepositories(username, {
        page,
        per_page: 100,
        type,
      })

      if (repos.length === 0) {
        hasMore = false
      } else {
        allRepos.push(...repos)
        page++
      }

      // 如果返回的数量少于100，说明已经是最后一页
      if (repos.length < 100) {
        hasMore = false
      }
    }

    return allRepos
  }

  /**
   * 获取仓库的语言统计
   * @param owner 仓库所有者
   * @param repo 仓库名称
   */
  public async getRepositoryLanguages(
    owner: string,
    repo: string
  ): Promise<GitHubLanguages> {
    try {
      const response = await this.httpClient.get<GitHubLanguages>(
        `/repos/${owner}/${repo}/languages`,
        { retry: 2 }
      )

      return response.data
    } catch (error) {
      console.error(`Failed to fetch languages for ${owner}/${repo}:`, error)
      return {}
    }
  }

  /**
   * 获取仓库的贡献者列表
   * @param owner 仓库所有者
   * @param repo 仓库名称
   * @param perPage 每页数量
   */
  public async getRepositoryContributors(
    owner: string,
    repo: string,
    perPage: number = 30
  ): Promise<GitHubContributor[]> {
    try {
      const response = await this.httpClient.get<GitHubContributor[]>(
        `/repos/${owner}/${repo}/contributors`,
        {
          params: {
            per_page: perPage,
            anon: false, // 不包含匿名贡献者
          },
          retry: 2,
        }
      )

      return response.data
    } catch (error) {
      console.error(`Failed to fetch contributors for ${owner}/${repo}:`, error)
      return []
    }
  }

  /**
   * 获取单个仓库的详细信息
   * @param owner 仓库所有者
   * @param repo 仓库名称
   */
  public async getRepository(
    owner: string,
    repo: string
  ): Promise<GitHubRepository> {
    try {
      const response = await this.httpClient.get<GitHubRepository>(
        `/repos/${owner}/${repo}`,
        { retry: 2 }
      )

      return response.data
    } catch (error) {
      console.error(`Failed to fetch repository ${owner}/${repo}:`, error)
      throw error
    }
  }

  /**
   * 批量获取仓库的完整信息（包括语言和贡献者）
   * @param repos 仓库列表
   * @param includeLanguages 是否包含语言信息
   * @param includeContributors 是否包含贡献者信息
   */
  public async batchGetRepositoryDetails(
    repos: GitHubRepository[],
    options: {
      includeLanguages?: boolean
      includeContributors?: boolean
      maxConcurrent?: number
    } = {}
  ): Promise<Map<string, { languages?: GitHubLanguages; contributors?: GitHubContributor[] }>> {
    const {
      includeLanguages = true,
      includeContributors = true,
      maxConcurrent = 5,
    } = options

    const results = new Map<string, { languages?: GitHubLanguages; contributors?: GitHubContributor[] }>()

    // 使用并发控制避免一次性发送太多请求
    for (let i = 0; i < repos.length; i += maxConcurrent) {
      const batch = repos.slice(i, i + maxConcurrent)
      
      await Promise.all(
        batch.map(async (repo) => {
          const detail: { languages?: GitHubLanguages; contributors?: GitHubContributor[] } = {}

          if (includeLanguages) {
            detail.languages = await this.getRepositoryLanguages(repo.owner.login, repo.name)
          }

          if (includeContributors) {
            detail.contributors = await this.getRepositoryContributors(repo.owner.login, repo.name)
          }

          results.set(repo.full_name, detail)
        })
      )

      // 短暂延迟，避免触发速率限制
      if (i + maxConcurrent < repos.length) {
        await this.delay(200)
      }
    }

    return results
  }

  /**
   * 延迟函数
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  /**
   * 检查token是否有效
   */
  public async validateToken(): Promise<boolean> {
    if (!this.token) {
      return false
    }

    try {
      await this.httpClient.get('/user')
      return true
    } catch {
      return false
    }
  }
}

/**
 * 创建GitHub API服务实例
 */
export function createGitHubApiService(config?: GitHubApiConfig): GitHubApiService {
  return new GitHubApiService(config)
}

/**
 * 默认GitHub API服务实例
 */
export const githubApiService = createGitHubApiService()

// 向后兼容的别名
export const githubApi = githubApiService

