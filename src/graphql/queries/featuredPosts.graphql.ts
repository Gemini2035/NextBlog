/**
 * BFF GraphQL 查询 - 置顶文章列表
 */

export const FEATURED_POSTS_QUERY = /* GraphQL */ `
  query FeaturedPosts($locale: String!) {
    featuredPosts(locale: $locale) {
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

export interface FeaturedPostsResult {
  featuredPosts: Array<{
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
