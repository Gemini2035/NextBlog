export interface BlogLanguage {
  id: number
  code: string
  name: string
}

export interface BlogPostListItem {
  id: string
  url: string
  title: string
  description?: string | null
  isFeatured: boolean
  featured: boolean
  locale?: string | null
  language?: BlogLanguage | null
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface BlogPostDetail extends BlogPostListItem {
  content: string
}

export interface BlogPostsPayload {
  posts: BlogPostListItem[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface BlogPostDetailPayload {
  post: BlogPostDetail
}
