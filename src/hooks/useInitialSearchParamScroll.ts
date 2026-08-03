'use client'

import { useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'

interface UseInitialSearchParamScrollOptions {
  targetId: string
  offset?: number
  delay?: number
}

export function useInitialSearchParamScroll({
  targetId,
  offset = 100,
  delay = 300,
}: UseInitialSearchParamScrollOptions) {
  const searchParams = useSearchParams()
  const hasHandledInitialParamsRef = useRef(false)

  useEffect(() => {
    if (hasHandledInitialParamsRef.current) {
      return
    }

    hasHandledInitialParamsRef.current = true

    if (searchParams.toString().length === 0) {
      return
    }

    const timeoutId = setTimeout(() => {
      const targetElement = document.getElementById(targetId)
      if (!targetElement) {
        return
      }

      const rect = targetElement.getBoundingClientRect()
      const scrollTop = window.scrollY + rect.top - offset
      window.scrollTo({ top: Math.max(0, scrollTop), behavior: 'smooth' })
    }, delay)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [delay, offset, searchParams, targetId])
}
