import { allPosts, Post } from '../../.contentlayer/generated'
import Fuse from 'fuse.js'

export function getAllPosts(locale?: string): Post[] {
  let posts = allPosts.filter((post) => post.published !== false)
  
  if (locale) {
    posts = posts.filter((post) => post.locale === locale)
  }
  
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getPostBySlug(slug: string, locale?: string): Post | undefined {
  let posts = allPosts
  
  if (locale) {
    posts = posts.filter((post) => post.locale === locale)
  }
  
  return posts.find((post) => post.slug === slug)
}

export function getPostBySlugAndLocale(slug: string, locale: string): Post | undefined {
  return allPosts.find((post) => post.slug === slug && post.locale === locale)
}

export function getRelatedPosts(post: Post, limit: number = 3): Post[] {
  const sameLocalePosts = allPosts.filter((p) => 
    p.published !== false && 
    p.locale === post.locale && 
    p.slug !== post.slug
  )
  
  // 优先显示相同标签的文章
  const relatedByTags = sameLocalePosts.filter((p) => 
    p.tags && post.tags && 
    p.tags.some(tag => post.tags!.includes(tag))
  )
  
  // 如果相同标签的文章不够，补充其他文章
  const remaining = limit - relatedByTags.length
  const otherPosts = sameLocalePosts
    .filter((p) => !relatedByTags.includes(p))
    .slice(0, remaining)
  
  return [...relatedByTags, ...otherPosts].slice(0, limit)
}

// 使用 Fuse.js 的智能相关文章推荐
export function getSmartRelatedPosts(post: Post, limit: number = 3): Post[] {
  const sameLocalePosts = allPosts.filter((p) => 
    p.published !== false && 
    p.locale === post.locale && 
    p.slug !== post.slug
  )
  
  if (sameLocalePosts.length === 0) {
    return []
  }
  
  // 配置 Fuse.js 搜索选项
  const fuseOptions = {
    keys: [
      { name: 'title', weight: 0.4 },
      { name: 'description', weight: 0.3 },
      { name: 'tags', weight: 0.3 }
    ],
    threshold: 0.6, // 相似度阈值，0表示完全匹配，1表示完全不匹配
    includeScore: true,
    includeMatches: true
  }
  
  // 创建搜索索引
  const fuse = new Fuse(sameLocalePosts, fuseOptions)
  
  // 构建搜索查询
  const searchQuery = [
    post.title,
    post.description || '',
    ...(post.tags || [])
  ].join(' ')
  
  // 执行搜索
  const searchResults = fuse.search(searchQuery)
  
  // 提取结果并保持优先级逻辑
  const smartRelated = searchResults.map(result => result.item)
  
  // 如果智能推荐结果不够，补充其他文章
  if (smartRelated.length < limit) {
    const remaining = limit - smartRelated.length
    const otherPosts = sameLocalePosts
      .filter((p) => !smartRelated.includes(p))
      .sort((a, b) => {
        const dateA = a.updatedAt ? new Date(a.updatedAt) : new Date(a.date)
        const dateB = b.updatedAt ? new Date(b.updatedAt) : new Date(b.date)
        return dateB.getTime() - dateA.getTime()
      })
      .slice(0, remaining)
    
    return [...smartRelated, ...otherPosts]
  }
  
  return smartRelated.slice(0, limit)
}

// 增强版相关文章推荐，结合多种策略
export function getEnhancedRelatedPosts(post: Post, limit: number = 3): Post[] {
  const sameLocalePosts = allPosts.filter((p) => 
    p.published !== false && 
    p.locale === post.locale && 
    p.slug !== post.slug
  )
  
  if (sameLocalePosts.length === 0) {
    return []
  }
  
  // 1. 优先级1：原文中提到的链接（通过originalSlug匹配）
  const linkedPosts = sameLocalePosts.filter((p) => 
    p.originalSlug && post.originalSlug && p.originalSlug === post.originalSlug
  )
  
  // 2. 优先级2：使用 Fuse.js 智能推荐
  const remainingLimit = limit - linkedPosts.length
  const smartRelated = getSmartRelatedPosts(post, remainingLimit)
  
  // 3. 优先级3：相似标签的文章
  const relatedByTags = sameLocalePosts.filter((p) => 
    p.tags && post.tags && 
    p.tags.some(tag => post.tags!.includes(tag)) &&
    !linkedPosts.includes(p) &&
    !smartRelated.includes(p)
  )
  
  // 4. 优先级4：按更新时间排序的其他文章
  const otherPosts = sameLocalePosts
    .filter((p) => 
      !linkedPosts.includes(p) && 
      !smartRelated.includes(p) && 
      !relatedByTags.includes(p)
    )
    .sort((a, b) => {
      const dateA = a.updatedAt ? new Date(a.updatedAt) : new Date(a.date)
      const dateB = b.updatedAt ? new Date(b.updatedAt) : new Date(b.date)
      return dateB.getTime() - dateA.getTime()
    })
  
  // 按优先级组合结果
  const result = [...linkedPosts, ...smartRelated, ...relatedByTags, ...otherPosts]
  return result.slice(0, limit)
}

export function getPostsByTag(tag: string, locale?: string): Post[] {
  let posts = allPosts.filter((post) => post.published !== false && post.tags?.includes(tag))
  
  if (locale) {
    posts = posts.filter((post) => post.locale === locale)
  }
  
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getAllTags(locale?: string): string[] {
  let posts = allPosts.filter((post) => post.published !== false)
  
  if (locale) {
    posts = posts.filter((post) => post.locale === locale)
  }
  
  const tags = posts.flatMap((post) => post.tags || [])
  return Array.from(new Set(tags)).sort()
}

// 新增功能：获取置顶文章
export function getFeaturedPost(): Post | undefined {
  const posts = allPosts.filter((post) => post.published !== false && post.featured === true)
  
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
}

// 新增功能：获取最近一周更新的文章（最多10篇）
export function getRecentPosts(): Post[] {
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
  
  const posts = allPosts.filter((post) => {
    if (post.published === false) return false
    
    // 使用 updatedAt 或 date 字段
    const updateDate = post.updatedAt ? new Date(post.updatedAt) : new Date(post.date)
    return updateDate >= oneWeekAgo
  })
  
  return posts
    .sort((a, b) => {
      const dateA = a.updatedAt ? new Date(a.updatedAt) : new Date(a.date)
      const dateB = b.updatedAt ? new Date(b.updatedAt) : new Date(b.date)
      return dateB.getTime() - dateA.getTime()
    })
    .slice(0, 10)
}

