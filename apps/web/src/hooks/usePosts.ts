import { useEffect, useMemo, useState } from 'react'
import { useLocale } from 'next-intl'
import { getBlogPosts } from '@/apis/blog'
import type { BlogPostListItem } from '@/types/blog'

export interface UsePostsReturn {
  getAllPosts: () => BlogPostListItem[]
  getRelatedPosts: (post: BlogPostListItem, limit?: number) => BlogPostListItem[]
  getPostsByTag: (tag: string) => BlogPostListItem[]
  getAllTags: () => string[]
  getFeaturedPost: () => BlogPostListItem | undefined
  getRecentPosts: () => BlogPostListItem[]
  currentLocale: string
}

export function usePosts(): UsePostsReturn {
  const locale = useLocale()
  const [posts, setPosts] = useState<BlogPostListItem[]>([])

  useEffect(() => {
    let ignore = false

    const fetchPosts = async () => {
      const response = await getBlogPosts({ siteLanguage: locale, pageSize: 100 })
      if (!ignore) {
        setPosts(response.data.posts)
      }
    }

    void fetchPosts()

    return () => {
      ignore = true
    }
  }, [locale])

  const sortedPosts = useMemo(
    () =>
      [...posts].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    [posts]
  )

  const getAllPosts = useMemo(() => () => sortedPosts, [sortedPosts])

  const getRelatedPosts = useMemo(
    () => (post: BlogPostListItem, limit: number = 3) => {
      const sameLocalePosts = sortedPosts.filter((candidate) => candidate.id !== post.id)
      const relatedByTags = sameLocalePosts.filter((candidate) =>
        candidate.tags.some((tag) => post.tags.includes(tag))
      )
      const otherPosts = sameLocalePosts.filter((candidate) => !relatedByTags.includes(candidate))

      return [...relatedByTags, ...otherPosts].slice(0, limit)
    },
    [sortedPosts]
  )

  const getPostsByTag = useMemo(
    () => (tag: string) => sortedPosts.filter((post) => post.tags.includes(tag)),
    [sortedPosts]
  )

  const getAllTags = useMemo(
    () => () => Array.from(new Set(sortedPosts.flatMap((post) => post.tags))).sort(),
    [sortedPosts]
  )

  const getFeaturedPost = useMemo(
    () => () => sortedPosts.find((post) => post.featured),
    [sortedPosts]
  )

  const getRecentPosts = useMemo(
    () => () => {
      const oneMonthAgo = new Date()
      oneMonthAgo.setDate(oneMonthAgo.getDate() - 30)

      return sortedPosts
        .filter((post) => new Date(post.updatedAt || post.createdAt) >= oneMonthAgo)
        .sort(
          (a, b) =>
            new Date(b.updatedAt || b.createdAt).getTime() -
            new Date(a.updatedAt || a.createdAt).getTime()
        )
        .slice(0, 10)
    },
    [sortedPosts]
  )

  return useMemo(
    () => ({
      getAllPosts,
      getRelatedPosts,
      getPostsByTag,
      getAllTags,
      getFeaturedPost,
      getRecentPosts,
      currentLocale: locale,
    }),
    [
      getAllPosts,
      getRelatedPosts,
      getPostsByTag,
      getAllTags,
      getFeaturedPost,
      getRecentPosts,
      locale,
    ]
  )
}
