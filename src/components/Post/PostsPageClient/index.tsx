'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { FeaturedPostSection, RecentUpdatesSection, AllPostsSection } from '@/components/Post'
import type { IBlogPost } from '@/types'

interface PostsPageClientProps {
  posts: IBlogPost[]
  featuredPosts: IBlogPost[]
  recentPosts: IBlogPost[]
  locale: string
}

export function PostsPageClient({
  posts,
  featuredPosts,
  recentPosts,
  locale,
}: PostsPageClientProps) {
  const searchParams = useSearchParams()
  const t = useTranslations('Posts')
  const [initialTag, setInitialTag] = useState<string | null>(null)

  useEffect(() => {
    const tagParam = searchParams.get('tag')
    if (tagParam) {
      setInitialTag(tagParam)
    }
  }, [searchParams])

  useEffect(() => {
    const hasParams = searchParams.toString().length > 0
    if (hasParams) {
      const timer = setTimeout(() => {
        const allPostsElement = document.getElementById('all-posts')
        if (allPostsElement) {
          const rect = allPostsElement.getBoundingClientRect()
          const scrollTop = window.scrollY + rect.top - 100
          window.scrollTo({ top: Math.max(0, scrollTop), behavior: 'smooth' })
        }
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [searchParams])

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-baseline gap-3 mb-4">
          <h1 className="text-3xl font-bold text-gray-900">{t('allPosts')}</h1>
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {t('totalPosts', { count: posts.length })}
          </span>
        </div>
      </div>

      <FeaturedPostSection
        featuredPosts={featuredPosts}
        title={t('featuredPost')}
      />

      <RecentUpdatesSection
        recentPosts={recentPosts}
        title={`${t('recentPosts')} (${t('updatedThisMonth', { count: recentPosts.length })})`}
      />

      <AllPostsSection
        posts={posts}
        title={t('articleList')}
        prevText={t('prevPage')}
        nextText={t('nextPage')}
        locale={locale}
        initialTag={initialTag}
      />

      {posts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">{t('noPosts')}</p>
        </div>
      )}
    </div>
  )
}
