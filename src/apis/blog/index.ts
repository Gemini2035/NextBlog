import { httpRequest } from '@/apis/http'
import type {
  BlogPostDetailPayload,
  BlogPostWritePayload,
  BlogPostsPayload,
  BlogPostWriteRequest,
} from '@/types/blog'

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
    url: '/post',
    method: 'GET',
    params: queryParams,
    headers: siteLanguage ? { 'X-Locale': siteLanguage } : undefined,
  })
}

export const getBlogPostDetail = (postId: number | string, siteLanguage?: string) => {
  return httpRequest<BlogPostDetailPayload>({
    url: `/post/${postId}`,
    method: 'GET',
    headers: siteLanguage ? { 'X-Locale': siteLanguage } : undefined,
  })
}

export const createBlogPost = (payload: BlogPostWriteRequest) => {
  return httpRequest<BlogPostWritePayload, BlogPostWriteRequest>({
    url: '/post',
    method: 'POST',
    data: payload,
  })
}
