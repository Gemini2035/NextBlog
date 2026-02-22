/**
 * GitHub REST API 操作 - 仓库相关
 */

import {
  getRestUserRepos,
  getRestRepoDetail,
  getRestRepoLanguages,
  getRestRateLimit,
  handleGitHubError,
  delay,
} from '../client'
import { transformRestRepoToProcessed } from '../transformers/repository'
import type { ProcessedRepository } from '../types/processed'

export type RepositoryAffiliation = 'owner' | 'member' | 'all' | 'public'

/**
 * 获取用户仓库列表（单页）
 */
export async function getUserRepositories(
  username: string,
  options: {
    type?: RepositoryAffiliation
    sort?: 'created' | 'updated' | 'pushed' | 'full_name'
    direction?: 'asc' | 'desc'
    page?: number
    perPage?: number
  } = {}
): Promise<ProcessedRepository[]> {
  try {
    const list = await getRestUserRepos(username, {
      type: options.type ?? 'owner',
      sort: options.sort ?? 'updated',
      direction: options.direction ?? 'desc',
      page: options.page ?? 1,
      per_page: options.perPage ?? 100,
    })
    const results: ProcessedRepository[] = []
    for (const item of list) {
      try {
        const [detail, languages] = await Promise.all([
          getRestRepoDetail(item.owner.login, item.name),
          getRestRepoLanguages(item.owner.login, item.name),
        ])
        results.push(transformRestRepoToProcessed(detail, languages, false))
      } catch {
        results.push(transformRestRepoToProcessed(item as import('../types/rest').RestRepoDetail, null, false))
      }
      await delay(100)
    }
    return results
  } catch (error) {
    console.error('Failed to fetch user repositories:', error)
    throw handleGitHubError(error)
  }
}

/**
 * 获取所有用户仓库（分页，并转为 ProcessedRepository）
 */
export async function getAllUserRepositories(
  username: string,
  options: {
    maxPages?: number
    type?: RepositoryAffiliation
    sort?: 'created' | 'updated' | 'pushed' | 'full_name'
    direction?: 'asc' | 'desc'
    featuredRepos?: string[]
  } = {}
): Promise<ProcessedRepository[]> {
  const { maxPages = 10, featuredRepos = [] } = options
  const all: ProcessedRepository[] = []
  let page = 1

  while (page <= maxPages) {
    const { featuredRepos: _fr, ...restOptions } = options
    const list = await getRestUserRepos(username, {
      ...restOptions,
      page,
      per_page: 100,
    })
    if (list.length === 0) break

    for (const item of list) {
      try {
        const [detail, languages] = await Promise.all([
          getRestRepoDetail(item.owner.login, item.name),
          getRestRepoLanguages(item.owner.login, item.name),
        ])
        const isFeatured = featuredRepos.includes(item.name) || featuredRepos.includes(item.full_name)
        all.push(transformRestRepoToProcessed(detail, languages, isFeatured))
      } catch {
        const isFeatured = featuredRepos.includes(item.name) || featuredRepos.includes(item.full_name)
        all.push(transformRestRepoToProcessed(item as import('../types/rest').RestRepoDetail, null, isFeatured))
      }
      await delay(80)
    }
    if (list.length < 100) break
    page++
  }

  return all
}

/**
 * 获取单个仓库详情（返回 ProcessedRepository）
 */
export async function getRepositoryDetail(
  owner: string,
  name: string
): Promise<ProcessedRepository> {
  try {
    const [detail, languages] = await Promise.all([
      getRestRepoDetail(owner, name),
      getRestRepoLanguages(owner, name),
    ])
    return transformRestRepoToProcessed(detail, languages, false)
  } catch (error) {
    console.error(`Failed to fetch repository ${owner}/${name}:`, error)
    throw handleGitHubError(error)
  }
}

/**
 * 批量获取仓库详情
 */
export async function batchGetRepositoryDetails(
  repos: Array<{ owner: string; name: string }>,
  maxConcurrent: number = 3
): Promise<Map<string, ProcessedRepository>> {
  const results = new Map<string, ProcessedRepository>()

  for (let i = 0; i < repos.length; i += maxConcurrent) {
    const batch = repos.slice(i, i + maxConcurrent)
    await Promise.all(
      batch.map(async (repo) => {
        try {
          const detail = await getRepositoryDetail(repo.owner, repo.name)
          results.set(`${repo.owner}/${repo.name}`, detail)
        } catch (error) {
          console.error(`Failed to fetch ${repo.owner}/${repo.name}:`, error)
        }
      })
    )
    if (i + maxConcurrent < repos.length) {
      await delay(200)
    }
  }

  return results
}

/**
 * 获取 API 速率限制
 */
export async function getRateLimit(): Promise<{
  limit: number
  remaining: number
  resetAt: string
  used: number
}> {
  try {
    return await getRestRateLimit()
  } catch (error) {
    console.error('Failed to fetch rate limit:', error)
    throw handleGitHubError(error)
  }
}
