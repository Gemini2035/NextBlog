'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { RouteLoadingMask } from '@/components/RouteLoadingMask'

interface NavigationLoadingContextValue {
  startNavigationLoading: () => void
}

const NavigationLoadingContext = createContext<NavigationLoadingContextValue | null>(null)
const MAX_PENDING_DURATION_MS = 15000
const COMPLETE_DELAY_MS = 300

export function NavigationLoadingProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [pending, setPending] = useState(false)
  const pendingRef = useRef(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const completeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearTimers = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

    if (completeTimeoutRef.current) {
      clearTimeout(completeTimeoutRef.current)
      completeTimeoutRef.current = null
    }
  }, [])

  const stopNavigationLoading = useCallback(() => {
    clearTimers()
    pendingRef.current = false
    setPending(false)
  }, [clearTimers])

  const startNavigationLoading = useCallback(() => {
    clearTimers()
    pendingRef.current = true
    setPending(true)
    timeoutRef.current = setTimeout(stopNavigationLoading, MAX_PENDING_DURATION_MS)
  }, [clearTimers, stopNavigationLoading])

  useEffect(() => {
    if (!pendingRef.current) {
      return
    }

    if (completeTimeoutRef.current) {
      clearTimeout(completeTimeoutRef.current)
    }

    completeTimeoutRef.current = setTimeout(stopNavigationLoading, COMPLETE_DELAY_MS)
  }, [pathname, searchParams, stopNavigationLoading])

  useEffect(() => {
    return clearTimers
  }, [clearTimers])

  return (
    <NavigationLoadingContext.Provider value={{ startNavigationLoading }}>
      {children}
      {pending && <RouteLoadingMask />}
    </NavigationLoadingContext.Provider>
  )
}

export function useNavigationLoading() {
  const context = useContext(NavigationLoadingContext)

  return {
    startNavigationLoading: context?.startNavigationLoading ?? (() => undefined),
  }
}
