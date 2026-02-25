/**
 * BFF GraphQL 查询 - 相关文章列表
 */

import type { IBlogPost } from '@/types'

export const RELATED_POSTS_QUERY = /* GraphQL */ `
  query RelatedPosts($id: ID!, $locale: String!, $limit: Int!) {
    relatedPosts(id: $id, locale: $locale, limit: $limit) {
      id
      locale
      title
      description
      updatedAt
      published
      featured
      tags
      createdAt
    }
  }
`

type RelatedPostGqlItem = Omit<IBlogPost, 'updatedAt' | 'createdAt' | 'content'> & {
  updatedAt: string | null
  createdAt: string | null
}

export interface RelatedPostsResult {
  relatedPosts: RelatedPostGqlItem[]
}
