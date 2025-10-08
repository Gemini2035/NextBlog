/**
 * GitHub GraphQL 客户端
 * 统一的GraphQL客户端配置
 */

import { graphql } from '@octokit/graphql'
import type { GraphqlResponseError } from '@octokit/graphql'

/**
 * GraphQL 客户端配置
 */
export interface GraphQLClientConfig {
  token?: string
}

/**
 * 创建配置好的 GraphQL 客户端
 */
export function createGraphQLClient(config?: GraphQLClientConfig) {
  const token = config?.token || process.env.NEXT_PUBLIC_GITHUB_TOKEN

  return graphql.defaults({
    headers: {
      authorization: token ? `token ${token}` : '',
    },
  })
}

/**
 * 默认 GraphQL 客户端实例
 */
export const githubGraphQLClient = createGraphQLClient()

/**
 * 错误处理工具
 */
export function handleGraphQLError(error: unknown): Error {
  if (isGraphqlError(error)) {
    const errorMessages = error.errors?.map((e) => e.message).join(', ')
    return new Error(`GraphQL Error: ${errorMessages || error.message}`)
  }

  if (error instanceof Error) {
    return error
  }

  return new Error('Unknown GraphQL error occurred')
}

/**
 * 类型守卫：判断是否为 GraphQL 错误
 */
function isGraphqlError(error: unknown): error is GraphqlResponseError<unknown> {
  return (
    typeof error === 'object' &&
    error !== null &&
    'errors' in error &&
    Array.isArray((error as { errors?: unknown }).errors)
  )
}

/**
 * 延迟工具函数
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

