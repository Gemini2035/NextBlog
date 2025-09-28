import Fuse from 'fuse.js'
import type { Post } from '../../../../../.contentlayer/generated'
import type { FilterState } from './types'

// 计算文章字数
export function getWordCount(post: Post): number {
  if (!post.body?.raw) return 0
  return post.body.raw.split(/\s+/).length
}

// 获取所有标签及其计数
export function getAllTagsWithCount(posts: Post[]): Array<{ value: string; label: string; count: number }> {
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
export function searchPosts(posts: Post[], keyword: string): Post[] {
  if (!keyword.trim()) return posts
  
  const fuse = new Fuse(posts, {
    keys: [
      { name: 'title', weight: 0.4 },
      { name: 'description', weight: 0.3 },
      { name: 'tags', weight: 0.2 },
      { name: 'body.raw', weight: 0.1 }
    ],
    threshold: 0.6,
    includeScore: true
  })
  
  const results = fuse.search(keyword)
  return results.map(result => result.item)
}

// 按标签筛选
export function filterByTags(posts: Post[], selectedTags: string[]): Post[] {
  if (selectedTags.length === 0) return posts
  
  return posts.filter(post => 
    post.tags && selectedTags.some(tag => post.tags!.includes(tag))
  )
}

// 按featured筛选
export function filterByFeatured(posts: Post[], featuredFilter: boolean | null): Post[] {
  if (featuredFilter === null) return posts
  
  return posts.filter(post => post.featured === featuredFilter)
}

// 按字数排序
export function sortByWordCount(posts: Post[], direction: 'asc' | 'desc' | null): Post[] {
  if (!direction) return posts
  
  return [...posts].sort((a, b) => {
    const countA = getWordCount(a)
    const countB = getWordCount(b)
    return direction === 'asc' ? countA - countB : countB - countA
  })
}

// 按创建时间排序
export function sortByCreateTime(posts: Post[], direction: 'asc' | 'desc' | null): Post[] {
  if (!direction) return posts
  
  return [...posts].sort((a, b) => {
    const dateA = new Date(a.date).getTime()
    const dateB = new Date(b.date).getTime()
    return direction === 'asc' ? dateA - dateB : dateB - dateA
  })
}

// 按更新时间排序
export function sortByUpdateTime(posts: Post[], direction: 'asc' | 'desc' | null): Post[] {
  if (!direction) return posts
  
  return [...posts].sort((a, b) => {
    const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : new Date(a.date).getTime()
    const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : new Date(b.date).getTime()
    return direction === 'asc' ? dateA - dateB : dateB - dateA
  })
}

// 应用所有筛选条件
export function applyFilters(posts: Post[], filters: FilterState): Post[] {
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
