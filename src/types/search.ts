import { FuseResultMatch } from 'fuse.js'

// 搜索项类型定义
export interface SearchableItem {
  id: string
  type: 'post' | 'link' | 'category'
  title: string
  description?: string
  href: string
  tags?: string[]
  content?: string
  priority: number
  category?: string
}

// 搜索结果类型
export interface SearchResult {
  item: SearchableItem
  score?: number
  matches?: FuseResultMatch[]
}

// 搜索结果分组
export interface SearchResultsGroup {
  title: string
  items: SearchResult[]
  type: 'posts' | 'links' | 'categories'
}

// 推荐内容类型
export interface RecommendedContent {
  featuredPosts: SearchableItem[]
  recentPosts: SearchableItem[]
  navigationLinks: SearchableItem[]
}
