/**
 * BFF GraphQL 查询 - 最近更新文章列表
 */

export const RECENT_POSTS_QUERY = /* GraphQL */ `
  query RecentPosts($limit: Int) {
    recentPosts(limit: $limit) {
      id
      locale
      title
      description
      date
      updatedAt
      published
      featured
      tags
      createdAt
    }
  }
`

export interface RecentPostsResult {
  recentPosts: Array<{
    id: string
    locale: string
    title: string
    description: string | null
    date: string
    updatedAt: string | null
    published: boolean
    featured: boolean
    tags: string[]
    createdAt: string
  }>
}
