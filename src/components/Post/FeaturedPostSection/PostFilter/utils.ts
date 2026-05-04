import Fuse from 'fuse.js'
import type { IBlogPost } from '@/types'
import type { FilterState } from './types'

type PostWithDate = IBlogPost & { date?: Date | string }

function getRawContent(post: IBlogPost): string {
  const c = post.content
  return (c && typeof c === 'object' && 'raw' in c && typeof (c as { raw?: string }).raw === 'string')
    ? (c as { raw: string }).raw
    : ''
}

export function getWordCount(post: IBlogPost): number {
  const raw = getRawContent(post)
  if (!raw) return 0
  return raw.split(/\s+/).length
}

export function getAllTagsWithCount(posts: IBlogPost[]): Array<{ value: string; label: string; count: number }> {
  const tagCounts: Record<string, number> = {}
  posts.forEach((post) => {
    if (post.tags) {
      post.tags.forEach((tag) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1
      })
    }
  })
  return Object.entries(tagCounts)
    .map(([tag, count]) => ({ value: tag, label: tag, count }))
    .sort((a, b) => b.count - a.count)
}

export function searchPosts(posts: IBlogPost[], keyword: string): IBlogPost[] {
  if (!keyword.trim()) return posts
  const withRaw = posts.map((post) => ({ post, bodyRaw: getRawContent(post) }))
  const fuse = new Fuse(withRaw, {
    keys: [
      { name: 'post.title', weight: 0.4 },
      { name: 'post.description', weight: 0.3 },
      { name: 'post.tags', weight: 0.2 },
      { name: 'bodyRaw', weight: 0.1 },
    ],
    threshold: 0.6,
    includeScore: true,
  })
  const results = fuse.search(keyword)
  return results.map((r) => r.item.post)
}

export function filterByTags(posts: IBlogPost[], selectedTags: string[]): IBlogPost[] {
  if (selectedTags.length === 0) return posts
  return posts.filter((post) => post.tags && selectedTags.some((tag) => post.tags!.includes(tag)))
}

export function filterByFeatured(posts: IBlogPost[], featuredFilter: boolean | null): IBlogPost[] {
  if (featuredFilter === null) return posts
  return posts.filter((post) => post.featured === featuredFilter)
}

export function sortByWordCount(posts: IBlogPost[], direction: 'asc' | 'desc' | null): IBlogPost[] {
  if (!direction) return posts
  return [...posts].sort((a, b) => {
    const countA = getWordCount(a)
    const countB = getWordCount(b)
    return direction === 'asc' ? countA - countB : countB - countA
  })
}

function getDate(post: PostWithDate): number {
  const d = post.date ?? post.createdAt
  return d ? new Date(d).getTime() : 0
}

export function sortByCreateTime(posts: IBlogPost[], direction: 'asc' | 'desc' | null): IBlogPost[] {
  if (!direction) return posts
  return [...posts].sort((a, b) => {
    const dateA = getDate(a as PostWithDate)
    const dateB = getDate(b as PostWithDate)
    return direction === 'asc' ? dateA - dateB : dateB - dateA
  })
}

export function sortByUpdateTime(posts: IBlogPost[], direction: 'asc' | 'desc' | null): IBlogPost[] {
  if (!direction) return posts
  return [...posts].sort((a, b) => {
    const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : getDate(a as PostWithDate)
    const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : getDate(b as PostWithDate)
    return direction === 'asc' ? dateA - dateB : dateB - dateA
  })
}

export function applyFilters(posts: IBlogPost[], filters: FilterState): IBlogPost[] {
  let filteredPosts = [...posts]
  if (filters.keyword.trim()) {
    filteredPosts = searchPosts(filteredPosts, filters.keyword)
  }
  if (filters.selectedTags.length > 0) {
    filteredPosts = filterByTags(filteredPosts, filters.selectedTags)
  }
  if (filters.featuredFilter !== null) {
    filteredPosts = filterByFeatured(filteredPosts, filters.featuredFilter)
  }
  if (filters.updateTimeSort) {
    filteredPosts = sortByUpdateTime(filteredPosts, filters.updateTimeSort)
  } else if (filters.createTimeSort) {
    filteredPosts = sortByCreateTime(filteredPosts, filters.createTimeSort)
  } else if (filters.wordCountSort) {
    filteredPosts = sortByWordCount(filteredPosts, filters.wordCountSort)
  }
  return filteredPosts
}
