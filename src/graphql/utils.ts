import type { PostDetailResult } from './queries/postDetail.graphql'
import type { RelatedPostsResult } from './queries/relatedPosts.graphql'
import type { IBlogPost } from '@/types'

type GqlPost = PostDetailResult['post'] extends infer P ? (P extends null ? never : P) : never

/** 列表项通用形状（无 content） */
export type GqlListPost = {
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
}

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
    locale: rest.locale as 'zh' | 'en' | 'ja',
    updatedAt: updatedAt ? new Date(updatedAt) : null,
    createdAt: createdAt ? new Date(createdAt) : null,
    content: null,
  }
}

/** 将 GraphQL 列表项（postsList.list / featuredPosts / recentPosts）转为 IBlogPost */
export function mapGqlListPostToBlogPost(post: GqlListPost): IBlogPost {
  return {
    ...post,
    locale: post.locale as 'zh' | 'en' | 'ja',
    updatedAt: post.updatedAt ? new Date(post.updatedAt) : null,
    createdAt: post.createdAt ? new Date(post.createdAt) : null,
    content: null,
  }
}
