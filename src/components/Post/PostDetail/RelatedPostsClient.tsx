'use client'

import { useMemo, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { getBlogPostRecommendations } from '@/apis/blog'
import { Button, Link } from '@/ui'
import { PostTag } from '../PostTag'
import type { BlogPostListItem } from '@/types/blog'

const RefreshIcon = ({ isRotating }: { isRotating: boolean }) => (
  <svg
    className={`w-4 h-4 ${isRotating ? 'animate-spin' : ''}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
    />
  </svg>
)

interface RelatedPostsClientProps {
  postId: string
  initialPosts: BlogPostListItem[]
  initialCursor?: number | null
  limit?: number
}

export function RelatedPostsClient({
  postId,
  initialPosts,
  initialCursor = null,
  limit = 3,
}: RelatedPostsClientProps) {
  const locale = useLocale()
  const t = useTranslations('Posts')
  const [currentPosts, setCurrentPosts] = useState<BlogPostListItem[]>(initialPosts)
  const [cursor, setCursor] = useState<number | null>(initialCursor)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const dateFormatter = useMemo(() => {
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC',
    })
  }, [locale])

  if (currentPosts.length === 0) {
    return null
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      const response = await getBlogPostRecommendations(postId, {
        siteLanguage: locale,
        limit,
        cursor,
      })
      setCurrentPosts(response.data.items)
      setCursor(response.data.cursor)
    } finally {
      setIsRefreshing(false)
    }
  }

  return (
    <div className="mt-12 pt-8 border-t border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">{t('relatedPosts')}</h3>
        <Button
          type="ghost"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="text-blue-600! hover:text-blue-800 hover:bg-blue-50"
        >
          <RefreshIcon isRotating={isRefreshing} />
          <span className="ml-2 text-sm">
            {isRefreshing ? t('refreshing') : t('refresh')}
          </span>
        </Button>
      </div>

      <div className="-mx-4 px-4 md:mx-0 md:px-0">
        <div className="grid w-full max-w-4xl grid-cols-1 gap-4 md:grid-cols-3">
          {currentPosts.map((relatedPost) => (
            <Link
              key={relatedPost.id}
              href={`/posts/${relatedPost.id}`}
              className="group block min-w-0 p-6 bg-white rounded-lg border border-gray-200 hover:border-[var(--site-action)] transition-colors duration-200"
            >
              <div className="space-y-3 h-full flex flex-col">
                <h4 className="overflow-hidden [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] text-lg font-medium text-gray-900 transition-colors group-hover:text-blue-600">
                  {relatedPost.title}
                </h4>

                {relatedPost.description && (
                  <p className="flex-1 overflow-hidden [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3] text-sm text-gray-600">
                    {relatedPost.description}
                  </p>
                )}

                <div className="mt-auto space-y-2">
                  {relatedPost.tags && relatedPost.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {relatedPost.tags.slice(0, 2).map((tag) => (
                        <PostTag key={tag} size="small" variant="secondary">
                          {tag}
                        </PostTag>
                      ))}
                    </div>
                  )}

                  <time dateTime={relatedPost.createdAt} className="text-sm text-gray-500">
                    {dateFormatter.format(new Date(relatedPost.createdAt))}
                  </time>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
