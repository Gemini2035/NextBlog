import { useMemo } from 'react'
import { usePosts } from './usePosts'
import { useSiteData } from '@/components/SiteDataProvider'

// Search item type.
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

// Recommended content type.
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
    const featuredPostId = featuredPost?.id

    // Featured post.
    const featuredPosts: SearchableItem[] = featuredPost
      ? (() => {
        const { id, title, description, tags } = featuredPost

        return [{
          id: `featured-post-${id}`,
          type: 'post',
          title,
          description: description ?? undefined,
          href: `/posts/${id}`,
          tags,
          priority: 10,
          category: '博客文章'
        }]
      })()
      : []

    // Recent posts, excluding the featured post to avoid duplicates.
    const recentPostsItems: SearchableItem[] = recentPosts
      .filter(({ id }) => !featuredPostId || id !== featuredPostId)
      .slice(0, 5)
      .map(({ id, title, description, tags }) => ({
        id: `recent-post-${id}`,
        type: 'post',
        title,
        description: description ?? undefined,
        href: `/posts/${id}`,
        tags,
        priority: 7,
        category: '博客文章'
      }))

    // Navigation links.
    const navigationLinks: SearchableItem[] = navigation
      .filter(navItem => navItem.key !== 'search' && navItem.key !== 'language')
      .slice(0, 5)
      .map(({ key, label, description, href }) => ({
        id: `nav-${key}`,
        type: 'link',
        title: label,
        description: description ?? undefined,
        href,
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
