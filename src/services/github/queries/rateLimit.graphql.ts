/**
 * GitHub GraphQL 查询 - 速率限制
 */

/**
 * 获取 GitHub API 速率限制信息
 */
export const GET_RATE_LIMIT = `
  query GetRateLimit {
    rateLimit {
      limit
      remaining
      resetAt
      used
    }
  }
`

