'use client'

import { ReactNode } from 'react'
import { Link } from '@/ui'
import { cn } from '@/utils'

export interface HomeSectionProps {
  title?: ReactNode
  description?: ReactNode
  href?: string
  ctaText?: ReactNode
  index: number
  children?: ReactNode
}

export default function HomeSection({ title, description, href, ctaText, index, children }: HomeSectionProps) {
  return (
    <section
      className={cn(
        'overflow-hidden border-y border-transparent transition-colors',
        'group relative isolate',
        index % 2 === 0 ? 'bg-[var(--site-canvas-muted)]' : 'bg-[var(--site-canvas)]'
      )}
    >
      <div className={cn('mx-auto max-w-7xl px-6 py-16 text-[var(--site-text)] sm:px-10 sm:py-20 lg:px-16')}>
        {children ? (
          children
        ) : (
          <div className="max-w-3xl">
            {title && (
              <h2 className={cn('font-bold tracking-tight', 'text-3xl sm:text-4xl lg:text-5xl')}>
                {title}
              </h2>
            )}
            {description && (
              <p className={cn('mt-4 sm:mt-6', 'text-base sm:text-lg lg:text-xl text-[var(--site-text-muted)]')}>
                {description}
              </p>
            )}

            {href && ctaText && (
              <div className="mt-8 sm:mt-10">
                <Link
                  href={href}
                  className={cn(
                    'inline-flex items-center gap-2 rounded-[var(--site-radius-control)] border border-[var(--site-action)] bg-[var(--site-action)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--site-focus-ring)]',
                    'hover:bg-[var(--site-action)]'
                  )}
                >
                  <span>{ctaText}</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M7 17L17 7M17 7H8M17 7V16"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
