'use client'

import { useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

interface UseFilterUrlSyncOptions {
  skipInitialSync?: boolean
}

export function useFilterUrlSync(
  nextSearchParams: URLSearchParams,
  { skipInitialSync = true }: UseFilterUrlSyncOptions = {},
) {
  const router = useRouter()
  const currentSearchParams = useSearchParams()
  const isInitialSyncRef = useRef(true)

  useEffect(() => {
    if (skipInitialSync && isInitialSyncRef.current) {
      isInitialSyncRef.current = false
      return
    }

    isInitialSyncRef.current = false

    const nextQuery = nextSearchParams.toString()
    const nextUrl = nextQuery ? `?${nextQuery}` : window.location.pathname
    const currentQuery = currentSearchParams.toString()
    const currentUrl = currentQuery ? `?${currentQuery}` : window.location.pathname

    if (nextUrl !== currentUrl) {
      router.replace(nextUrl, { scroll: false })
    }
  }, [currentSearchParams, nextSearchParams, router, skipInitialSync])
}
