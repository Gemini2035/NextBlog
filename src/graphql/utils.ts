import type { PostDetailResult } from './queries/postDetail.graphql'
import type { RelatedPostsResult } from './queries/relatedPosts.graphql'
import type { IBlogPost } from '@/types'

type GqlPost = PostDetailResult['post'] extends infer P ? (P extends null ? never : P) : never

export function mapGqlPostToBlogPost({ content, updatedAt, createdAt, ...rest }: GqlPost): IBlogPost {

  return {
    ...rest,
    content: content ? (JSON.parse(content) as { raw?: string; code?: string }) : null,
    updatedAt: updatedAt ? new Date(updatedAt) : null,
    createdAt: createdAt ? new Date(createdAt) : null,
  }
}

export function mapGqlRelatedPostToBlogPost(
  post: RelatedPostsResult['relatedPosts'][number]
): IBlogPost {
  const { updatedAt, createdAt, ...rest } = post

  return {
    ...rest,
    updatedAt: updatedAt ? new Date(updatedAt) : null,
    createdAt: createdAt ? new Date(createdAt) : null,
    content: null,
  }
}
