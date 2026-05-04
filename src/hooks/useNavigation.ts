import { useMemo, useState, useEffect } from 'react'
import { useLocale } from 'next-intl'
import { NAVIGATION_ITEMS, NavigationItem, SubmenuItem } from '@/constants'
import {
  FEATURED_POSTS_QUERY,
  RECENT_POSTS_QUERY,
  type FeaturedPostsResult,
  type RecentPostsResult,
} from '@/graphql/operations'

interface BlogNavPost {
  id: string
  title: string
}

async function fetchGraphQL<T>(query: string, variables: Record<string, unknown>): Promise<T> {
  const res = await fetch('/api/graphql', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  })
  if (!res.ok) return await Promise.reject(new Error(`GraphQL 请求失败: ${res.status}`))
  const json = (await res.json()) as { data?: T; errors?: { message: string }[] }
  if (json.errors?.length) return await Promise.reject(new Error(json.errors.map((e) => e.message).join('; ')))
  if (!json.data) return await Promise.reject(new Error('GraphQL 响应缺少 data'))
  return json.data
}

export function useNavigation() {
  const locale = useLocale()
  const [blogNavData, setBlogNavData] = useState<{
    featured: BlogNavPost[]
    recent: BlogNavPost[]
  } | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const [featuredRes, recentRes] = await Promise.all([
          fetchGraphQL<FeaturedPostsResult>(FEATURED_POSTS_QUERY, { locale }),
          fetchGraphQL<RecentPostsResult>(RECENT_POSTS_QUERY, { locale, limit: 10 }),
        ])
        if (cancelled) return
        const featured = featuredRes.featuredPosts.map((p) => ({ id: p.id, title: p.title }))
        const recent = recentRes.recentPosts.map((p) => ({ id: p.id, title: p.title }))
        setBlogNavData({ featured, recent })
      } catch {
        if (!cancelled) setBlogNavData({ featured: [], recent: [] })
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [locale])

  const navigationItems = useMemo((): NavigationItem[] => {
    try {
      return NAVIGATION_ITEMS.map((item) => {
        if (item.type !== '__blog' || !item.submenu) return item
        const submenuItems: SubmenuItem[] = []
        if (blogNavData) {
          if (blogNavData.featured.length > 0) {
            submenuItems.push({
              label: 'Featured Articles',
              href: '/posts#featured',
              items: blogNavData.featured.map((post) => ({
                label: post.title,
                href: `/posts/${post.id}`,
              })),
            })
          }
          submenuItems.push({
            label: 'Latest Articles',
            href: '/posts#recent',
            items: blogNavData.recent.slice(0, 10).map((post) => ({
              label: post.title,
              href: `/posts/${post.id}`,
            })),
          })
        }
        return {
          ...item,
          submenu: {
            ...item.submenu,
            items: submenuItems,
          },
        }
      })
    } catch {
      return NAVIGATION_ITEMS
    }
  }, [blogNavData])

  return {
    navigationItems,
    currentLocale: locale,
  }
}
