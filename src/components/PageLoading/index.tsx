'use client'

import { SiteLoadingIcon } from '@/components/SiteLoadingIcon'
import { cn } from '@/utils'

interface PageLoadingProps {
  text?: string
}

export function PageLoading({ text = 'Loading...' }: PageLoadingProps) {
  return (
    <div
      className={cn(
        'min-h-screen flex items-center justify-center',
        'bg-linear-to-br from-gray-50 via-slate-50 to-gray-200',
      )}
    >
      <div
        className={cn(
          'flex flex-col items-center justify-center',
          'px-6 py-8 rounded-2xl bg-white/80 backdrop-blur-md',
          'min-w-[220px] sm:min-w-[260px]',
          'shadow-lg border border-white/60',
        )}
      >
        <SiteLoadingIcon />
        <p className="mt-4 text-sm text-gray-600 tracking-wide">
          {text}
        </p>
      </div>
    </div>
  )
}
