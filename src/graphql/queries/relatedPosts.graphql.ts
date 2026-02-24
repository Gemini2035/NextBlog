/**
 * BFF GraphQL 查询 - 相关文章列表
 */

export const RELATED_POSTS_QUERY = /* GraphQL */ `
  query RelatedPosts($id: ID!, $locale: String!, $limit: Int!) {
    relatedPosts(id: $id, locale: $locale, limit: $limit) {
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

export interface RelatedPostsResult {
  relatedPosts: Array<{
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
