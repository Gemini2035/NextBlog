'use client'

import HomeSectionSkeleton from '../HomeSectionSkeleton'
import { Link, Button } from '@/ui'
import { useTranslations, useLocale } from 'next-intl'
import { NAVIGATION_ITEMS } from '@/constants'
import { useEffect, useState } from 'react'
import { cn } from '@/utils'
import { FloatingPost } from './FloatingPost'
import { StarFilledIcon, ClockIcon, FileTextIcon, TagIcon, ArrowRightIcon } from '@/assets/icons'
import { PostIcon } from '@/assets/icons/PostIcon'
import {
  FEATURED_POSTS_QUERY,
  RECENT_POSTS_QUERY,
  POST_LIST_QUERY,
  mapGqlListPostToBlogPost,
  type FeaturedPostsResult,
  type RecentPostsResult,
  type PostListResult,
} from '@/graphql/operations'
import type { IBlogPost } from '@/types'

interface BlogSectionProps {
  index: number
  href: string
}

async function fetchGraphQL<T>(query: string, variables: Record<string, unknown>): Promise<T> {
  const res = await fetch('/api/graphql', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  })
  if (!res.ok) throw new Error(`GraphQL 请求失败: ${res.status}`)
  const json = (await res.json()) as { data?: T; errors?: { message: string }[] }
  if (json.errors?.length) throw new Error(json.errors.map((e) => e.message).join('; '))
  if (!json.data) throw new Error('GraphQL 响应缺少 data')
  return json.data
}

export default function BlogSection({ index, href }: BlogSectionProps) {
  const t = useTranslations('HomePage')
  const navT = useTranslations('Navigation')
  const locale = useLocale()
  const blogNav = NAVIGATION_ITEMS.find((item) => item.type === '__blog')
  const blogDescription =
    blogNav?.submenu?.description ||
    'Explore my latest technical insights and development experience'
  const [floatingPosts, setFloatingPosts] = useState<IBlogPost[]>([])
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [popularTags, setPopularTags] = useState<string[]>([])

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const [featuredRes, recentRes, listRes] = await Promise.all([
          fetchGraphQL<FeaturedPostsResult>(FEATURED_POSTS_QUERY, { locale }),
          fetchGraphQL<RecentPostsResult>(RECENT_POSTS_QUERY, { locale, limit: 10 }),
          fetchGraphQL<PostListResult>(POST_LIST_QUERY, {
            locale,
            page: 1,
            pageSize: 15,
          }),
        ])
        if (cancelled) return
        const featured = featuredRes.featuredPosts.map(mapGqlListPostToBlogPost)
        const recent = recentRes.recentPosts.map(mapGqlListPostToBlogPost)
        const list = listRes.postsList.list.map(mapGqlListPostToBlogPost)
        const seen = new Set<string>()
        const merged: IBlogPost[] = []
        for (const p of [...featured, ...recent]) {
          if (seen.has(p.id)) continue
          seen.add(p.id)
          merged.push(p)
        }
        if (merged.length < 6) {
          for (const p of list) {
            if (merged.length >= 6) break
            if (seen.has(p.id)) continue
            seen.add(p.id)
            merged.push(p)
          }
        }
        const postsToShow = merged.slice(0, 6)
        setFloatingPosts(postsToShow)
        const tags = Array.from(
          new Set(postsToShow.flatMap((p) => p.tags ?? []))
        ).slice(0, 5)
        setPopularTags(tags)
      } catch {
        if (!cancelled) {
          setFloatingPosts([])
          setPopularTags([])
        }
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [locale])

  return (
    <HomeSectionSkeleton index={index}>
      {/* 突破padding限制的飘动容器 */}
      {floatingPosts.length > 0 && (
        <div className={cn(
          'absolute inset-y-0 left-0 right-0 w-full h-full overflow-hidden hidden lg:block pointer-events-none'
        )}>
          <div className="relative w-full h-full">
            {floatingPosts.map((post, idx) => (
              <FloatingPost
                key={post.id}
                post={post}
                index={idx}
                total={floatingPosts.length}
                hoveredIndex={hoveredIndex}
                onMouseEnter={setHoveredIndex}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            ))}
          </div>
        </div>
      )}

      {/* 主要内容区域 - 突破padding限制 */}
      <div className="relative max-w-6xl mx-auto -ml-6 sm:-ml-10 lg:-ml-16">
        <div className="max-w-3xl pl-6 sm:pl-10 lg:pl-16">
          <h2 className={cn(
            'text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-blue-800'
          )}>
            {t('blogTitle', { default: '博客' })}
          </h2>
          <p className={cn(
            'mt-4 sm:mt-6 text-base sm:text-lg lg:text-xl text-blue-600'
          )}>
            {navT(blogDescription, { default: blogDescription })}
          </p>

          {/* 博客分类链接 */}
          <div className="mt-8 sm:mt-10">
            <div className="flex flex-wrap gap-3 mb-6">
              <Link
                href="/posts#featured"
                className={cn(
                  'inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium',
                  'bg-blue-200 text-blue-800 hover:bg-blue-300 transition-colors',
                  'border border-blue-300 hover:border-blue-400'
                )}
              >
                <StarFilledIcon className="w-4 h-4" />
                <span>{t('featuredArticles', { default: '精选文章' })}</span>
              </Link>
              
              <Link
                href="/posts#recent"
                className={cn(
                  'inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium',
                  'bg-blue-200 text-blue-800 hover:bg-blue-300 transition-colors',
                  'border border-blue-300 hover:border-blue-400'
                )}
              >
                <ClockIcon className="w-4 h-4" />
                <span>{t('latestArticles', { default: '最新文章' })}</span>
              </Link>
              
              <Link
                href="/posts"
                className={cn(
                  'inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium',
                  'bg-blue-200 text-blue-800 hover:bg-blue-300 transition-colors',
                  'border border-blue-300 hover:border-blue-400'
                )}
              >
                <FileTextIcon className="w-4 h-4" />
                <span>{t('allArticles', { default: '所有文章' })}</span>
              </Link>
            </div>

            {/* 热门标签链接 */}
            {popularTags.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-blue-600 mb-3">
                  {t('popularTags', { default: '热门标签' })}:
                </p>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/posts?tag=${encodeURIComponent(tag)}`}
                      className={cn(
                        'inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-medium',
                        'bg-blue-100 text-blue-700 hover:bg-blue-200 hover:text-blue-800 transition-colors',
                        'border border-blue-200 hover:border-blue-300'
                      )}
                    >
                      <TagIcon className="w-3 h-3" />
                      <span>{tag}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* 主要CTA按钮 */}
            <div className="mt-8">
              <Link href={href}>
                <Button
                  type="primary"
                  size="sm"
                  rounded={true}
                  className="inline-flex items-center gap-2 bg-blue-800 text-white hover:bg-blue-900 focus-visible:outline-blue-800 border border-blue-600 hover:border-blue-700"
                >
                  <span>{t('viewMore', { default: '了解更多' })}</span>
                  <ArrowRightIcon className="w-4 h-4" strokeWidth={1.8} />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* 移动端显示的文章预览 */}
        {floatingPosts.length > 0 && (
          <div className="mt-8 lg:hidden">
            <div className={cn(
              'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2'
            )}>
              {floatingPosts.slice(0, 6).map((post) => (
                <div key={post.id} className={cn(
                  'bg-blue-50/90 backdrop-blur-sm rounded-lg shadow-lg',
                  'border border-blue-200/60 p-2.5'
                )}>
                  <Link href={`/posts/${post.id}`} className="block">
                    <div className="flex items-center gap-2">
                      <div className="shrink-0 w-4 h-4 flex items-center justify-center">
                        <PostIcon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0 flex items-center">
                        <h3 className="text-xs font-semibold text-blue-800 line-clamp-2 leading-tight">
                          {post.title}
                        </h3>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </HomeSectionSkeleton>
  )
}

 