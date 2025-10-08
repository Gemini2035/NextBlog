/**
 * GitHub 仓库数据 Hook（使用 SWR）
 * 提供客户端缓存和自动重新验证
 */

'use client'

import useSWR from 'swr'
import { getGitHubRepositoriesWithRetry, type GetReposParams } from '@/actions/github'
import type { ProcessedRepository, ProjectStats } from '@/services/github'

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
  params: GetReposParams = {},
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

  // 使用 SWR 获取数据
  const { data, error, isLoading, mutate } = useSWR(
    cacheKey,
    async () => {
      const result = await getGitHubRepositoriesWithRetry(params)
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch repositories')
      }
      
      return result.data!
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

