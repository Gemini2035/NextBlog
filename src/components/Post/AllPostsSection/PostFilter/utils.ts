import Fuse from 'fuse.js'
import type { FilterState } from './types'
import type { BlogPostListItem } from '@/types/blog'

// 计算文章字数
export function getWordCount(post: BlogPostListItem): number {
  return post.description?.split(/\s+/).filter(Boolean).length ?? 0
}

// 获取所有标签及其计数
export function getAllTagsWithCount(posts: BlogPostListItem[]): Array<{ value: string; label: string; count: number }> {
  const tagCounts: Record<string, number> = {}
  
  posts.forEach(post => {
    if (post.tags) {
      post.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1
      })
    }
  })
  
  return Object.entries(tagCounts)
    .map(([tag, count]) => ({
      value: tag,
      label: tag,
      count
    }))
    .sort((a, b) => b.count - a.count)
}

// 使用Fuse.js进行模糊搜索
export function searchPosts(posts: BlogPostListItem[], keyword: string): BlogPostListItem[] {
  if (!keyword.trim()) return posts
  
  const fuse = new Fuse(posts, {
    keys: [
      { name: 'title', weight: 0.4 },
      { name: 'description', weight: 0.3 },
      { name: 'tags', weight: 0.2 },
    ],
    threshold: 0.6,
    includeScore: true
  })
  
  const results = fuse.search(keyword)
  return results.map(result => result.item)
}

// 按标签筛选
export function filterByTags(posts: BlogPostListItem[], selectedTags: string[]): BlogPostListItem[] {
  if (selectedTags.length === 0) return posts
  
  return posts.filter(post => 
    post.tags && selectedTags.some(tag => post.tags!.includes(tag))
  )
}

// 按featured筛选
export function filterByFeatured(posts: BlogPostListItem[], featuredFilter: boolean | null): BlogPostListItem[] {
  if (featuredFilter === null) return posts
  
  return posts.filter(post => post.featured === featuredFilter)
}

// 按字数排序
export function sortByWordCount(posts: BlogPostListItem[], direction: 'asc' | 'desc' | null): BlogPostListItem[] {
  if (!direction) return posts
  
  return [...posts].sort((a, b) => {
    const countA = getWordCount(a)
    const countB = getWordCount(b)
    return direction === 'asc' ? countA - countB : countB - countA
  })
}

// 按创建时间排序
export function sortByCreateTime(posts: BlogPostListItem[], direction: 'asc' | 'desc' | null): BlogPostListItem[] {
  if (!direction) return posts
  
  return [...posts].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime()
    const dateB = new Date(b.createdAt).getTime()
    return direction === 'asc' ? dateA - dateB : dateB - dateA
  })
}

// 按更新时间排序
export function sortByUpdateTime(posts: BlogPostListItem[], direction: 'asc' | 'desc' | null): BlogPostListItem[] {
  if (!direction) return posts
  
  return [...posts].sort((a, b) => {
    const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : new Date(a.createdAt).getTime()
    const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : new Date(b.createdAt).getTime()
    return direction === 'asc' ? dateA - dateB : dateB - dateA
  })
}

// 应用所有筛选条件
export function applyFilters(posts: BlogPostListItem[], filters: FilterState): BlogPostListItem[] {
  let filteredPosts = [...posts]
  
  // 1. 关键字搜索
  if (filters.keyword.trim()) {
    filteredPosts = searchPosts(filteredPosts, filters.keyword)
  }
  
  // 2. 标签筛选
  if (filters.selectedTags.length > 0) {
    filteredPosts = filterByTags(filteredPosts, filters.selectedTags)
  }
  
  // 3. Featured筛选
  if (filters.featuredFilter !== null) {
    filteredPosts = filterByFeatured(filteredPosts, filters.featuredFilter)
  }
  
  // 4. 排序（按优先级：更新时间 > 创建时间 > 字数）
  if (filters.updateTimeSort) {
    filteredPosts = sortByUpdateTime(filteredPosts, filters.updateTimeSort)
  } else if (filters.createTimeSort) {
    filteredPosts = sortByCreateTime(filteredPosts, filters.createTimeSort)
  } else if (filters.wordCountSort) {
    filteredPosts = sortByWordCount(filteredPosts, filters.wordCountSort)
  }
  
  return filteredPosts
}
