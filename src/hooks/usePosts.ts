import { useMemo } from 'react'
import { useLocale } from 'next-intl'
import { allPosts, Post } from '../../.contentlayer/generated'
import { tagList } from '../../.contentlayer/generated/tagList.mjs'


export interface UsePostsReturn {
  // 基础文章操作
  getAllPosts: () => Post[]
  getPostBySlug: (slug: string) => Post | undefined
  getPostBySlugAndLocale: (slug: string, locale: string) => Post | undefined
  getRelatedPosts: (post: Post, limit?: number) => Post[]
  
  // 标签相关
  getPostsByTag: (tag: string) => Post[]
  getAllTags: () => string[]
  
  // 特殊文章
  getFeaturedPost: () => Post | undefined
  getRecentPosts: () => Post[]
  
  
  // 当前语言环境
  currentLocale: string
}

export function usePosts(): UsePostsReturn {
  const locale = useLocale()
  
  // 获取当前语言的所有已发布文章
  const currentLocalePosts = useMemo(() => {
    return allPosts.filter((post) => 
      post.published !== false && post.locale === locale
    )
  }, [locale])
  
  // 获取所有文章（当前语言）
  const getAllPosts = useMemo(() => () => {
    return currentLocalePosts.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )
  }, [currentLocalePosts])
  
  // 根据 slug 获取文章
  const getPostBySlug = useMemo(() => (slug: string) => {
    return currentLocalePosts.find((post) => post.slug === slug)
  }, [currentLocalePosts])
  
  // 根据 slug 和 locale 获取文章
  const getPostBySlugAndLocale = useMemo(() => (slug: string, targetLocale: string) => {
    return allPosts.find((post) => 
      post.slug === slug && post.locale === targetLocale
    )
  }, [])
  
  // 获取相关文章
  const getRelatedPosts = useMemo(() => (post: Post, limit: number = 3) => {
    const sameLocalePosts = currentLocalePosts.filter((p) => 
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
  }, [currentLocalePosts])
  
  // 根据标签获取文章
  const getPostsByTag = useMemo(() => (tag: string) => {
    return currentLocalePosts
      .filter((post) => post.tags?.includes(tag))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [currentLocalePosts])
  
  // 获取所有标签
  const getAllTags = useMemo(() => () => {
    // 使用 Contentlayer 生成的 tagList
    return tagList
  }, [])
  
  // 获取置顶文章
  const getFeaturedPost = useMemo(() => () => {
    const featuredPosts = currentLocalePosts.filter((post) => post.featured === true)
    return featuredPosts.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )[0]
  }, [currentLocalePosts])
  
  // 获取最近一周更新的文章
  const getRecentPosts = useMemo(() => () => {
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    
    return currentLocalePosts
      .filter((post) => {
        const updateDate = post.updatedAt ? new Date(post.updatedAt) : new Date(post.date)
        return updateDate >= oneWeekAgo
      })
      .sort((a, b) => {
        const dateA = a.updatedAt ? new Date(a.updatedAt) : new Date(a.date)
        const dateB = b.updatedAt ? new Date(b.updatedAt) : new Date(b.date)
        return dateB.getTime() - dateA.getTime()
      })
      .slice(0, 10)
  }, [currentLocalePosts])
  
  
  return useMemo(() => ({
    // 基础文章操作
    getAllPosts: getAllPosts,
    getPostBySlug,
    getPostBySlugAndLocale,
    getRelatedPosts,
    
    // 标签相关
    getPostsByTag,
    getAllTags,
    
    // 特殊文章
    getFeaturedPost,
    getRecentPosts,
    
    
    // 当前语言环境
    currentLocale: locale
  }), [
    getAllPosts,
    getPostBySlug,
    getPostBySlugAndLocale,
    getRelatedPosts,
    getPostsByTag,
    getAllTags,
    getFeaturedPost,
    getRecentPosts,
    locale
  ])
}
