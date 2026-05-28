import { useMemo } from 'react'
import { usePosts } from './usePosts'
import { useSiteData } from '@/components/SiteDataProvider'

// 搜索项类型定义
interface SearchableItem {
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

// 推荐内容类型
export interface RecommendedContent {
  featuredPosts: SearchableItem[]
  recentPosts: SearchableItem[]
  navigationLinks: SearchableItem[]
}

export function useRecommendedContent() {
  const posts = usePosts()
  const { navigation } = useSiteData()
  
  const recommendedContent = useMemo((): RecommendedContent => {
    const featuredPost = posts.getFeaturedPost()
    const recentPosts = posts.getRecentPosts()

    // 置顶文章
    const featuredPosts: SearchableItem[] = featuredPost ? [{
      id: `featured-post-${featuredPost.id}`,
      type: 'post',
      title: featuredPost.title,
      description: featuredPost.description ?? undefined,
      href: `/posts/${featuredPost.id}`,
      tags: featuredPost.tags,
      priority: 10,
      category: '博客文章'
    }] : []

    // 最新文章（排除置顶文章以避免重复）
    const recentPostsItems: SearchableItem[] = recentPosts
      .filter(post => !featuredPost || post.id !== featuredPost.id)
      .slice(0, 5)
      .map(post => ({
        id: `recent-post-${post.id}`,
        type: 'post',
        title: post.title,
        description: post.description ?? undefined,
        href: `/posts/${post.id}`,
        tags: post.tags,
        priority: 7,
        category: '博客文章'
      }))

    // 导航链接
    const navigationLinks: SearchableItem[] = navigation
      .filter(navItem => navItem.key !== 'search' && navItem.key !== 'language')
      .slice(0, 5)
      .map(navItem => ({
        id: `nav-${navItem.key}`,
        type: 'link',
        title: navItem.label,
        description: navItem.description ?? undefined,
        href: navItem.href,
        priority: 8,
        category: '导航链接'
      }))

    return {
      featuredPosts,
      recentPosts: recentPostsItems,
      navigationLinks
    }
  }, [posts, navigation])

  return {
    recommendedContent
  }
}
