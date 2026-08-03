'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

interface UseFilterUrlSyncOptions {
  skipInitialSync?: boolean
}

export function useFilterUrlSync(
  nextSearchParams: URLSearchParams,
  { skipInitialSync = true }: UseFilterUrlSyncOptions = {},
) {
  const pathname = usePathname()
  const isInitialSyncRef = useRef(true)

  useEffect(() => {
    if (skipInitialSync && isInitialSyncRef.current) {
      isInitialSyncRef.current = false
      return
    }

    isInitialSyncRef.current = false

    const nextQuery = nextSearchParams.toString()
    const nextUrl = nextQuery ? `${pathname}?${nextQuery}` : pathname
    const currentUrl = `${pathname}${window.location.search}`

    if (nextUrl !== currentUrl) {
      window.history.replaceState(window.history.state, '', nextUrl)
    }
  }, [nextSearchParams, pathname, skipInitialSync])
}
