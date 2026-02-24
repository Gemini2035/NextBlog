import type { PostDetailResult } from './queries/postDetail.graphql'
import type { RelatedPostsResult } from './queries/relatedPosts.graphql'

type GqlPost = PostDetailResult['post'] extends infer P ? (P extends null ? never : P) : never

export function mapGqlPostToBlogPost(post: GqlPost): {
  id: string
  locale: 'zh' | 'en' | 'ja'
  title: string
  description: string | null
  featured: boolean
  published: boolean
  tags: string[]
  content: { raw?: string; code?: string } | null
  date: Date
  updatedAt: Date | null
  createdAt: Date | null
} {
  return {
    id: post.id,
    locale: post.locale as 'zh' | 'en' | 'ja',
    title: post.title,
    description: post.description,
    featured: post.featured,
    published: post.published,
    tags: post.tags,
    content: post.content ? (JSON.parse(post.content) as { raw?: string; code?: string }) : null,
    date: new Date(post.date),
    updatedAt: post.updatedAt ? new Date(post.updatedAt) : null,
    createdAt: post.createdAt ? new Date(post.createdAt) : null,
  }
}

export function mapGqlRelatedPostToBlogPost(
  post: RelatedPostsResult['relatedPosts'][number]
): {
  id: string
  locale: 'zh' | 'en' | 'ja'
  title: string
  description: string | null
  featured: boolean
  published: boolean
  tags: string[]
  updatedAt: Date | null
  createdAt: Date | null
  content: null
} {
  return {
    id: post.id,
    locale: post.locale as 'zh' | 'en' | 'ja',
    title: post.title,
    description: post.description,
    featured: post.featured,
    published: post.published,
    tags: post.tags,
    updatedAt: post.updatedAt ? new Date(post.updatedAt) : null,
    createdAt: post.createdAt ? new Date(post.createdAt) : null,
    content: null,
  }
}
