import { useMemo } from 'react'
import { SearchableItem } from './useSearchData'
import { usePosts } from './usePosts'

// 推荐内容类型
export interface RecommendedContent {
  featuredPosts: SearchableItem[]
  recentPosts: SearchableItem[]
  navigationLinks: SearchableItem[]
}

export function useRecommendedContent() {
  const posts = usePosts()
  
  const recommendedContent = useMemo((): RecommendedContent => {
    const featuredPost = posts.getFeaturedPost()
    const recentPosts = posts.getRecentPosts()

    // 置顶文章
    const featuredPosts: SearchableItem[] = featuredPost ? [{
      id: `featured-post-${featuredPost.slug}-${featuredPost.locale || 'default'}`,
      type: 'post',
      title: featuredPost.title,
      description: featuredPost.description,
      href: `/posts/${featuredPost.slug}`,
      tags: featuredPost.tags,
      priority: 10,
      category: '博客文章'
    }] : []

    // 最新文章（排除置顶文章以避免重复）
    const recentPostsItems: SearchableItem[] = recentPosts
      .filter(post => !featuredPost || post.slug !== featuredPost.slug || post.locale !== featuredPost.locale)
      .slice(0, 5)
      .map(post => ({
        id: `recent-post-${post.slug}-${post.locale || 'default'}`,
        type: 'post',
        title: post.title,
        description: post.description,
        href: `/posts/${post.slug}`,
        tags: post.tags,
        priority: 7,
        category: '博客文章'
      }))

    // 导航链接（简化版，只包含主要导航）
    const navigationLinks: SearchableItem[] = [
      {
        id: 'nav-blog',
        type: 'link',
        title: 'Blog',
        description: '查看所有博客文章',
        href: '/posts',
        priority: 8,
        category: '导航链接'
      },
      {
        id: 'nav-about',
        type: 'link',
        title: 'About',
        description: '了解关于我的信息',
        href: '/about',
        priority: 8,
        category: '导航链接'
      }
    ]

    return {
      featuredPosts,
      recentPosts: recentPostsItems,
      navigationLinks
    }
  }, [posts])

  return {
    recommendedContent
  }
}
