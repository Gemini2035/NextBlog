'use client'

import { useEffect, useRef } from 'react'

interface UseInfiniteScrollSentinelOptions {
  enabled: boolean
  onLoadMore: () => void
  rootMargin?: string
}

export function useInfiniteScrollSentinel({
  enabled,
  onLoadMore,
  rootMargin = '600px 0px',
}: UseInfiniteScrollSentinelOptions) {
  const sentinelRef = useRef<HTMLDivElement>(null)
  const onLoadMoreRef = useRef(onLoadMore)

  useEffect(() => {
    onLoadMoreRef.current = onLoadMore
  }, [onLoadMore])

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!enabled || !sentinel) {
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onLoadMoreRef.current()
        }
      },
      { rootMargin },
    )

    observer.observe(sentinel)

    return () => {
      observer.disconnect()
    }
  }, [enabled, rootMargin])

  return sentinelRef
}
