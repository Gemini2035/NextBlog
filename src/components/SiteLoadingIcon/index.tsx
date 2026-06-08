'use client'

import { Loading } from '@/ui'
import { cn } from '@/utils'

interface SiteLoadingIconProps {
  className?: string
}

export function SiteLoadingIcon({ className }: SiteLoadingIconProps) {
  return (
    <span className={cn('inline-flex items-center justify-center', className)}>
      <Loading variant="spinner" size="lg" />
    </span>
  )
}
