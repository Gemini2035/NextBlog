'use client'

import { useState, useMemo, useEffect, useCallback, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import { PostCard } from '../PostCard'
import { PostFilter } from '../FeaturedPostSection/PostFilter'
import type { FilterState } from '../FeaturedPostSection/PostFilter/types'
import { Button, EmptyState, Loading } from '@/ui'
import { useAnchorScroll, useInfiniteScrollSentinel, useLayoutHeights } from '@/hooks'
import { getBlogPosts } from '@/apis/blog'
import { isStaleRequestError } from '@/apis/http'
import { smoothScrollToElement } from '@/utils'
import type { BlogPostListItem } from '@/types/blog'
import { ChevronUpIcon } from '@/assets/icons'

interface StickyWrapperProps {
  posts: BlogPostListItem[]
  initialTotal?: number
  initialPage?: number
  initialPageSize?: number
  initialTotalPages?: number
  title: string
  prevText?: string
  nextText?: string
  locale?: string
  initialTag?: string | null
}

const DEFAULT_PAGE_SIZE = 9

const getPostApiKey = (filters: FilterState | null) =>
  JSON.stringify(getPostParams(filters, 1, 1))

const getPostSort = (filters: FilterState) => {
  if (filters.wordCountSort) return `wordCount-${filters.wordCountSort}`
  if (filters.createTimeSort) return `created-${filters.createTimeSort}`
  if (filters.updateTimeSort) return `updated-${filters.updateTimeSort}`
  return undefined
}

const getPostParams = (filters: FilterState | null, page: number, pageSize: number) => ({
  keyword: filters?.keyword.trim() || undefined,
  tag: filters?.selectedTags[0] || undefined,
  featured: filters?.featuredFilter ?? undefined,
  sort: filters ? getPostSort(filters) : undefined,
  page,
  pageSize,
})

const getInitialPostFilters = (
  searchParams: { get: (key: string) => string | null },
  initialTag?: string | null,
): FilterState => {
  const filters: FilterState = {
    keyword: searchParams.get('keyword') ?? '',
    selectedTags: [],
    wordCountSort: null,
    featuredFilter: null,
    createTimeSort: null,
    updateTimeSort: null,
  }

  const tag = searchParams.get('tag')
  if (tag) {
    filters.selectedTags = [tag]
  } else if (initialTag) {
    filters.selectedTags = [initialTag]
  }

  const featured = searchParams.get('featured')
  if (featured === 'true') {
    filters.featuredFilter = true
  } else if (featured === 'false') {
    filters.featuredFilter = false
  }

  const sort = searchParams.get('sort')
  if (sort) {
    const [sortKey, direction] = sort.split('-')
    const sortDir = (direction === 'asc' ? 'asc' : 'desc') as 'asc' | 'desc'

    switch (sortKey) {
      case 'wordCount':
        filters.wordCountSort = sortDir
        break
      case 'created':
        filters.createTimeSort = sortDir
        break
      case 'updated':
        filters.updateTimeSort = sortDir
        break
    }
  }

  return filters
}

const dedupePosts = (posts: BlogPostListItem[]) => {
  const seen = new Set<string>()
  return posts.filter((post) => {
    if (seen.has(post.id)) return false
    seen.add(post.id)
    return true
  })
}

const ignoreStaleRequest = (error: unknown) => {
  if (!isStaleRequestError(error)) {
    throw error
  }
}

export function StickyWrapper({
  posts,
  initialTotal,
  initialPage = 1,
  initialPageSize = DEFAULT_PAGE_SIZE,
  initialTotalPages,
  title,
  locale,
  initialTag,
}: StickyWrapperProps) {
  const searchParams = useSearchParams()
  const initialFilters = useMemo(
    () => getInitialPostFilters(searchParams, initialTag),
    [initialTag, searchParams],
  )
  const [loadedPosts, setLoadedPosts] = useState<BlogPostListItem[]>(posts)
  const [page, setPage] = useState(initialPage)
  const [total, setTotal] = useState(initialTotal ?? posts.length)
  const [totalPages, setTotalPages] = useState(initialTotalPages ?? 1)
  const [activeFilters, setActiveFilters] = useState<FilterState | null>(initialFilters)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [isResetting, setIsResetting] = useState(false)
  const apiKeyRef = useRef(getPostApiKey(initialFilters))
  const filterRequestIdRef = useRef(0)

  const tEmpty = useTranslations('EmptyState')
  const { headerHeight } = useLayoutHeights()
  const pageSize = initialPageSize || DEFAULT_PAGE_SIZE

  useAnchorScroll({ anchorId: 'all-posts' })

  useEffect(() => {
    if (initialTag) {
      setTimeout(() => {
        const allPostsTitle = document.getElementById('all-posts')
        if (allPostsTitle) {
          smoothScrollToElement(allPostsTitle, headerHeight + 20)
        }
      }, 300)
    }
  }, [initialTag, headerHeight])

  const fetchPage = useCallback(
    async (nextPage: number, mode: 'replace' | 'append') => {
      try {
        const response = await getBlogPosts({
          siteLanguage: locale,
          ...getPostParams(activeFilters, nextPage, pageSize),
        })
        const payload = response.data

        setLoadedPosts((currentPosts) =>
          mode === 'append' ? dedupePosts([...currentPosts, ...payload.posts]) : payload.posts,
        )
        setPage(payload.page)
        setTotal(payload.total)
        setTotalPages(payload.totalPages)
      } catch (error) {
        ignoreStaleRequest(error)
      }
    },
    [activeFilters, locale, pageSize],
  )

  const handleFilterStateChange = useCallback(
    (filters: FilterState) => {
      setActiveFilters(filters)
      const nextApiKey = getPostApiKey(filters)
      if (nextApiKey === apiKeyRef.current) {
        return
      }

      apiKeyRef.current = nextApiKey
      const requestId = filterRequestIdRef.current + 1
      filterRequestIdRef.current = requestId
      setIsResetting(true)
      getBlogPosts({
        siteLanguage: locale,
        ...getPostParams(filters, 1, pageSize),
      })
        .then((response) => {
          if (filterRequestIdRef.current !== requestId) {
            return
          }

          const payload = response.data
          setLoadedPosts(payload.posts)
          setPage(payload.page)
          setTotal(payload.total)
          setTotalPages(payload.totalPages)
        })
        .catch(ignoreStaleRequest)
        .finally(() => {
          if (filterRequestIdRef.current === requestId) {
            setIsResetting(false)
          }
        })
    },
    [locale, pageSize],
  )

  const hasMore = page < totalPages

  const loadMore = useCallback(() => {
    if (!hasMore || isLoadingMore || isResetting) {
      return
    }

    setIsLoadingMore(true)
    fetchPage(page + 1, 'append').finally(() => setIsLoadingMore(false))
  }, [fetchPage, hasMore, isLoadingMore, isResetting, page])

  const sentinelRef = useInfiniteScrollSentinel({
    enabled: hasMore && !isLoadingMore && !isResetting,
    onLoadMore: loadMore,
  })

  const handleCollapse = useCallback(() => {
    setLoadedPosts((currentPosts) => currentPosts.slice(0, pageSize))
    setPage(1)
    const allPostsTitle = document.getElementById('all-posts')
    if (allPostsTitle) {
      smoothScrollToElement(allPostsTitle, headerHeight + 10)
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [headerHeight, pageSize])

  const statusText = useMemo(
    () => `已显示 ${loadedPosts.length} / ${total} 篇`,
    [loadedPosts.length, total],
  )

  return (
    <div className="relative mb-12">
      <div id="all-posts" />
      <div
        className="sticky z-30 mb-6 border-b border-[var(--site-border)] bg-gray-50 py-3"
        style={{ top: `${headerHeight}px` }}
      >
        <h2 className="text-2xl font-bold text-[var(--site-text)]">{title}</h2>
      </div>

      <div className="mb-8">
        <PostFilter
          posts={loadedPosts}
          onFilterStateChange={handleFilterStateChange}
          isLoading={isResetting}
          locale={locale}
          initialTag={initialTag}
        />
      </div>

      {loadedPosts.length === 0 && !isResetting ? (
        <EmptyState
          icon="search"
          title={tEmpty('noPosts')}
          description={tEmpty('noPostsDescription')}
          size="md"
          variant="card"
        />
      ) : (
        <div className={`mb-8 transition-opacity duration-200 ${isResetting ? 'opacity-60' : 'opacity-100'}`}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {loadedPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 flex items-center justify-between gap-4">
        <span className="text-xs text-[var(--site-text-tertiary)]">{statusText}</span>
        {page > 1 && (
          <Button
            type="ghost"
            size="sm"
            onClick={handleCollapse}
            className="text-[var(--site-action)]! hover:text-[var(--site-action-hover)] hover:bg-[var(--site-canvas-muted)]"
          >
            <ChevronUpIcon className="h-4 w-4" />
            <span className="ml-2 text-sm">收起</span>
          </Button>
        )}
      </div>

      <div ref={sentinelRef} className="flex min-h-12 items-center justify-center py-4">
        {(isLoadingMore || isResetting) && <Loading variant="spinner" size="sm" />}
      </div>
    </div>
  )
}
