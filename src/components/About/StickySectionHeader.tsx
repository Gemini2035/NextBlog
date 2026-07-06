'use client'

import type { ReactNode } from 'react'
import { useEffect, useRef } from 'react'
import { cn } from '@/utils'

interface StickySectionHeaderProps {
  children: ReactNode
  className?: string
}

export function StickySectionHeader({ children, className }: StickySectionHeaderProps) {
  const headerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const header = headerRef.current
    const container = header?.parentElement
    if (!header || !container) return

    const syncCategoryTop = () => {
      container.style.setProperty('--about-detail-category-top', `${header.offsetHeight}px`)
    }

    syncCategoryTop()

    const resizeObserver = new ResizeObserver(syncCategoryTop)
    resizeObserver.observe(header)
    window.addEventListener('resize', syncCategoryTop)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', syncCategoryTop)
      container.style.removeProperty('--about-detail-category-top')
    }
  }, [])

  return (
    <div
      ref={headerRef}
      className={cn(
        'sticky top-0 z-20 mb-8 border-b border-gray-200 bg-white/95 py-4 pl-0 pr-8 backdrop-blur supports-[backdrop-filter]:bg-white/80',
        '[&_p]:max-h-16 [&_p]:overflow-y-auto [&_p]:pr-1',
        'sm:[&_p]:max-h-20',
        className,
      )}
    >
      {children}
    </div>
  )
}
