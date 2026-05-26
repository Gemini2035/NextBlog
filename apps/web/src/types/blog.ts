export interface BlogPostListItem {
  id: string
  url: string
  title: string
  description?: string | null
  isFeatured: boolean
  featured: boolean
  disable: string[]
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface BlogPostDetail extends BlogPostListItem {
  content: string
}

export interface BlogPostDictionaryField {
  key: string
  value: Record<string, string>
}

export interface BlogPostWriteRequest {
  content: string
  title: BlogPostDictionaryField
  description?: BlogPostDictionaryField | null
  isFeatured?: boolean
  disable?: string[]
  tagIds?: number[]
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

export interface BlogPostWritePayload {
  post: BlogPostListItem
  embeddingUpdated: boolean
}
