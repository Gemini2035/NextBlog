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
  images: Record<string, BlogPostImage>
}

export interface BlogPostImage {
  id: number
  assetId: number
  slotKey: string
  url: string
  alt?: string | null
  caption?: string | null
  width?: number | null
  height?: number | null
  mimeType: string
  size: number
  placeholder?: string | null
  variants: Record<string, string>
  displayVariant?: string | null
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
