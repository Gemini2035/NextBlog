import type { ReactNode } from 'react'
import { cn } from '@/utils'

interface StickySectionHeaderProps {
  children: ReactNode
  className?: string
}

export function StickySectionHeader({ children, className }: StickySectionHeaderProps) {
  return (
    <div
      className={cn(
        'sticky top-0 z-20 mb-8 border-b border-gray-200 bg-white/95 py-4 pl-0 pr-8 backdrop-blur supports-[backdrop-filter]:bg-white/80',
        className,
      )}
    >
      {children}
    </div>
  )
}
