import { httpRequest } from '@/apis/http'
import type { BlogPostDetailPayload, BlogPostsPayload } from '@/types/blog'

export interface GetBlogPostsParams {
  siteLanguage?: string
  keyword?: string
  search?: string
  page?: number
  pageSize?: number
}

export const getBlogPosts = (params?: GetBlogPostsParams) => {
  const { siteLanguage, ...queryParams } = params ?? {}

  return httpRequest<BlogPostsPayload>({
    url: '/posts',
    method: 'GET',
    params: queryParams,
    headers: siteLanguage ? { 'X-Site-Language': siteLanguage } : undefined,
  })
}

export const getBlogPostDetail = (postId: number | string) => {
  return httpRequest<BlogPostDetailPayload>({
    url: `/posts/${postId}`,
    method: 'GET',
  })
}
