// Posts 适配器 - 为服务器组件提供 posts 功能
import { allPosts, Post } from '../../.contentlayer/generated'
import { tagList } from '../../.contentlayer/generated'

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

export function getPostsByTag(tag: string, locale?: string): Post[] {
  let posts = allPosts.filter((post) => post.published !== false && post.tags?.includes(tag))
  
  if (locale) {
    posts = posts.filter((post) => post.locale === locale)
  }
  
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getAllTags(): string[] {
  // 使用 Contentlayer 生成的 tagList
  return tagList
}

// 获取置顶文章（单篇，向后兼容）
export function getFeaturedPost(locale?: string): Post | undefined {
  return getFeaturedPosts(locale)[0]
}

// 获取所有置顶文章
export function getFeaturedPosts(locale?: string): Post[] {
  let posts = allPosts.filter((post) => post.published !== false && post.featured === true)
  
  if (locale) {
    posts = posts.filter((post) => post.locale === locale)
  }
  
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

// 获取最近一个月更新的文章（最多10篇）
export function getRecentPosts(locale?: string): Post[] {
  const oneMonthAgo = new Date()
  oneMonthAgo.setDate(oneMonthAgo.getDate() - 30)
  
  let posts = allPosts.filter((post) => {
    if (post.published === false) return false
    
    // 使用 updatedAt 或 date 字段
    const updateDate = post.updatedAt ? new Date(post.updatedAt) : new Date(post.date)
    return updateDate >= oneMonthAgo
  })
  
  if (locale) {
    posts = posts.filter((post) => post.locale === locale)
  }
  
  return posts
    .sort((a, b) => {
      const dateA = a.updatedAt ? new Date(a.updatedAt) : new Date(a.date)
      const dateB = b.updatedAt ? new Date(b.updatedAt) : new Date(b.date)
      return dateB.getTime() - dateA.getTime()
    })
    .slice(0, 10)
}



