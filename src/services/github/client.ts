/**
 * GitHub REST API 客户端
 * 基于 axios 封装
 */

import { http } from '../http'
import type {
  RestRepoListItem,
  RestRepoDetail,
  RestRepoLanguages,
  RestRateLimit,
} from './types/rest'

const GITHUB_API_BASE = 'https://api.github.com'

export interface GitHubClientConfig {
  token?: string
}

function getAuthToken(config?: GitHubClientConfig): string {
  return config?.token ?? process.env.NEXT_PUBLIC_GITHUB_TOKEN ?? ''
}

function authHeaders(config?: GitHubClientConfig): Record<string, string> {
  const token = getAuthToken(config)
  return {
    Accept: 'application/vnd.github.v3+json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

/**
 * 获取用户公开仓库列表（分页）
 */
export async function getRestUserRepos(
  username: string,
  params: {
    type?: 'all' | 'owner' | 'member' | 'public'
    sort?: 'created' | 'updated' | 'pushed' | 'full_name'
    direction?: 'asc' | 'desc'
    page?: number
    per_page?: number
  } = {},
  config?: GitHubClientConfig
): Promise<RestRepoListItem[]> {
  const { data } = await http.get<RestRepoListItem[]>(
    `${GITHUB_API_BASE}/users/${encodeURIComponent(username)}/repos`,
    {
      params: {
        type: params.type ?? 'owner',
        sort: params.sort ?? 'updated',
        direction: params.direction ?? 'desc',
        page: params.page ?? 1,
        per_page: Math.min(params.per_page ?? 100, 100),
      },
      headers: authHeaders(config),
    }
  )
  return data
}

/**
 * 获取单个仓库详情
 */
export async function getRestRepoDetail(
  owner: string,
  repo: string,
  config?: GitHubClientConfig
): Promise<RestRepoDetail> {
  const { data } = await http.get<RestRepoDetail>(
    `${GITHUB_API_BASE}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`,
    {
      headers: authHeaders(config),
    }
  )
  return data
}

/**
 * 获取仓库语言统计
 */
export async function getRestRepoLanguages(
  owner: string,
  repo: string,
  config?: GitHubClientConfig
): Promise<RestRepoLanguages> {
  const { data } = await http.get<RestRepoLanguages>(
    `${GITHUB_API_BASE}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/languages`,
    {
      headers: authHeaders(config),
    }
  )
  return data
}

/**
 * 获取 API 速率限制
 */
export async function getRestRateLimit(
  config?: GitHubClientConfig
): Promise<{ limit: number; remaining: number; resetAt: string; used: number }> {
  const { data } = await http.get<{ resources: { core: RestRateLimit } }>(
    `${GITHUB_API_BASE}/rate_limit`,
    { headers: authHeaders(config) }
  )
  const rate = data.resources?.core ?? (data as unknown as { core?: RestRateLimit }).core
  if (!rate) {
    throw new Error('Invalid rate limit response')
  }
  return {
    limit: rate.limit,
    remaining: rate.remaining,
    resetAt: new Date(rate.reset * 1000).toISOString(),
    used: rate.used,
  }
}

/**
 * 错误处理工具
 */
export function handleGitHubError(error: unknown): Error {
  if (error instanceof Error) return error
  return new Error('Unknown GitHub API error')
}

/**
 * 延迟工具函数
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
