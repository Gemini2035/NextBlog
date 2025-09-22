import { allPosts, Post } from '../../.contentlayer/generated'

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

export function getAllTags(locale?: string): string[] {
  let posts = allPosts.filter((post) => post.published !== false)
  
  if (locale) {
    posts = posts.filter((post) => post.locale === locale)
  }
  
  const tags = posts.flatMap((post) => post.tags || [])
  return Array.from(new Set(tags)).sort()
}

// 新增功能：获取置顶文章
export function getFeaturedPost(locale?: string): Post | undefined {
  let posts = allPosts.filter((post) => post.published !== false && post.featured === true)
  
  if (locale) {
    posts = posts.filter((post) => post.locale === locale)
  }
  
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
}

// 新增功能：获取最近一周更新的文章（最多10篇）
export function getRecentPosts(locale?: string): Post[] {
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
  
  let posts = allPosts.filter((post) => {
    if (post.published === false) return false
    
    // 使用 updatedAt 或 date 字段
    const updateDate = post.updatedAt ? new Date(post.updatedAt) : new Date(post.date)
    return updateDate >= oneWeekAgo
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

// 新增功能：按指定标签分类获取文章
export function getPostsByCategory(category: string, locale?: string): Post[] {
  const categoryMap: { [key: string]: string[] } = {
    'TypeScript': ['TypeScript'],
    'Javascript': ['Javascript', 'JavaScript'],
    'NodeJs': ['NodeJs', 'Node.js'],
    'ReactJs': ['ReactJs', 'React', 'React.js'],
    'VueJS': ['VueJS', 'Vue', 'Vue.js'],
    '其它': [] // 其他标签的文章
  }
  
  const targetTags = categoryMap[category] || []
  let posts = allPosts.filter((post) => post.published !== false)
  
  if (locale) {
    posts = posts.filter((post) => post.locale === locale)
  }
  
  if (category === '其它') {
    // 获取不属于主要分类的文章
    const mainTags = ['TypeScript', 'Javascript', 'JavaScript', 'NodeJs', 'Node.js', 'ReactJs', 'React', 'React.js', 'VueJS', 'Vue', 'Vue.js']
    return posts
      .filter((post) => {
        if (!post.tags || post.tags.length === 0) return true
        
        // 检查是否包含主要标签
        const hasMainTag = post.tags.some(tag => mainTags.includes(tag))
        return !hasMainTag
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }
  
  return posts
    .filter((post) => {
      if (!post.tags || post.tags.length === 0) return false
      
      // 检查是否包含目标标签
      return post.tags.some(tag => targetTags.includes(tag))
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

// 新增功能：获取所有分类
export function getCategories(): string[] {
  return ['TypeScript', 'Javascript', 'NodeJs', 'ReactJs', 'VueJS', '其它']
}
