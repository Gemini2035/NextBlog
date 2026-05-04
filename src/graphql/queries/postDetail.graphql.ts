/**
 * BFF GraphQL 查询 - 文章详情
 */

import type { IBlogPost } from '@/types'

export const POST_DETAIL_QUERY = /* GraphQL */ `
  query PostDetail($id: ID!) {
    post(id: $id) {
      id
      locale
      title
      description
      updatedAt
      published
      featured
      tags
      content
      createdAt
    }
  }
`

type PostDetailGqlPost = Omit<IBlogPost, 'updatedAt' | 'createdAt' | 'content'> & {
  updatedAt: string | null
  createdAt: string | null
  content: string | null
}

export interface PostDetailResult {
  post: PostDetailGqlPost | null
}
