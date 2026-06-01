'use client'

import { Loading } from '@/ui'
import { cn } from '@/utils'

interface RouteLoadingMaskProps {
  className?: string
}

export function RouteLoadingMask({ className }: RouteLoadingMaskProps) {
  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center',
        'bg-white/45 backdrop-blur-md',
        'transition-opacity duration-200',
        className,
      )}
      aria-live="polite"
      aria-busy="true"
    >
      <Loading variant="spinner" size="lg" />
    </div>
  )
}
