/**
 * GitHub GraphQL 操作 - 仓库相关
 * 封装所有仓库相关的 API 调用
 */

import { createGraphQLClient, handleGraphQLError, delay } from '../client'
import { GET_USER_REPOSITORIES } from '../queries/repositories.graphql'
import { GET_REPOSITORY_DETAIL } from '../queries/repository.graphql'
import { GET_RATE_LIMIT } from '../queries/rateLimit.graphql'
import { getGithubThirdPartyConfig } from '../config'
import type {
  UserRepositoriesResponse,
  RepositoryDetailResponse,
  RateLimitResponse,
  GetUserRepositoriesVariables,
  GetRepositoryDetailVariables,
  GraphQLRepository,
  RepositoryAffiliation,
} from '../types/graphql'

/**
 * 获取用户的仓库列表（支持分页）
 */
export async function getUserRepositories(
  options: {
    first?: number
    after?: string | null
    orderBy?: 'UPDATED_AT' | 'CREATED_AT' | 'PUSHED_AT' | 'NAME' | 'STARGAZERS'
    direction?: 'ASC' | 'DESC'
    affiliations?: RepositoryAffiliation[]
  } = {}
): Promise<UserRepositoriesResponse> {
  const {
    first = 100,
    after = null,
    orderBy = 'UPDATED_AT',
    direction = 'DESC',
    affiliations = ['OWNER'],
  } = options

  try {
    const githubConfig = await getGithubThirdPartyConfig()
    const githubClient = createGraphQLClient({ token: githubConfig.token })

    const variables: GetUserRepositoriesVariables = {
      username: githubConfig.username,
      first,
      after,
      orderBy: {
        field: orderBy,
        direction,
      },
      ownerAffiliations: affiliations,
    }

    const response = await githubClient<UserRepositoriesResponse>(
      GET_USER_REPOSITORIES,
      variables
    )

    return response
  } catch (error) {
    console.error('Failed to fetch user repositories:', error)
    throw handleGraphQLError(error)
  }
}

/**
 * 获取所有用户仓库（自动处理分页）
 */
export async function getAllUserRepositories(
  options: {
    maxPages?: number
    orderBy?: 'UPDATED_AT' | 'CREATED_AT' | 'PUSHED_AT' | 'NAME' | 'STARGAZERS'
    direction?: 'ASC' | 'DESC'
    affiliations?: RepositoryAffiliation[]
  } = {}
): Promise<GraphQLRepository[]> {
  const { maxPages = 10, orderBy, direction, affiliations } = options

  const allRepositories: GraphQLRepository[] = []
  let hasNextPage = true
  let after: string | null = null
  let currentPage = 0

  while (hasNextPage && currentPage < maxPages) {
    const response = await getUserRepositories({
      first: 100,
      after,
      orderBy,
      direction,
      affiliations,
    })

    const repositories = response.user.repositories
    allRepositories.push(...repositories.nodes)

    hasNextPage = repositories.pageInfo.hasNextPage
    after = repositories.pageInfo.endCursor
    currentPage++

    // 如果没有更多页面，退出循环
    if (!hasNextPage) {
      break
    }
  }

  return allRepositories
}

/**
 * 获取单个仓库的详细信息
 */
export async function getRepositoryDetail(
  owner: string,
  name: string
): Promise<RepositoryDetailResponse['repository']> {
  try {
    const githubConfig = await getGithubThirdPartyConfig()
    const githubClient = createGraphQLClient({ token: githubConfig.token })

    const variables: GetRepositoryDetailVariables = {
      owner,
      name,
    }

    const response = await githubClient<RepositoryDetailResponse>(
      GET_REPOSITORY_DETAIL,
      variables
    )

    return response.repository
  } catch (error) {
    console.error(`Failed to fetch repository ${owner}/${name}:`, error)
    throw handleGraphQLError(error)
  }
}

/**
 * 批量获取仓库详情（带并发控制）
 */
export async function batchGetRepositoryDetails(
  repos: Array<{ owner: string; name: string }>,
  maxConcurrent: number = 5
): Promise<Map<string, RepositoryDetailResponse['repository']>> {
  const results = new Map<string, RepositoryDetailResponse['repository']>()

  // 使用并发控制避免一次性发送太多请求
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

    // 短暂延迟，避免触发速率限制
    if (i + maxConcurrent < repos.length) {
      await delay(200)
    }
  }

  return results
}

/**
 * 获取 API 速率限制信息
 */
export async function getRateLimit(): Promise<RateLimitResponse['rateLimit']> {
  try {
    const githubConfig = await getGithubThirdPartyConfig()
    const githubClient = createGraphQLClient({ token: githubConfig.token })
    const response = await githubClient<RateLimitResponse>(GET_RATE_LIMIT)
    return response.rateLimit
  } catch (error) {
    console.error('Failed to fetch rate limit:', error)
    throw handleGraphQLError(error)
  }
}
