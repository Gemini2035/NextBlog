'use client'

import React from 'react'
import { Link } from '@/ui'
import clsx from 'clsx'

export interface HomeSectionProps {
  title?: React.ReactNode
  description?: React.ReactNode
  href?: string
  ctaText?: React.ReactNode
  index: number
  children?: React.ReactNode
}

export default function HomeSection({ title, description, href, ctaText, index, children }: HomeSectionProps) {
  const isEven = index % 2 === 0

  return (
    <section
      className={clsx(
        'rounded-3xl overflow-hidden border transition-colors',
        'group relative isolate',
        isEven
          ? 'bg-white border-gray-200 hover:border-gray-300'
          : 'bg-gray-900 border-gray-800 hover:border-gray-700'
      )}
    >
      <div className={clsx('px-6 py-16 sm:px-10 sm:py-20 lg:px-16', isEven ? 'text-gray-900' : 'text-white')}>
        {children ? (
          children
        ) : (
          <div className="max-w-3xl">
            {title && (
              <h2 className={clsx('font-bold tracking-tight', 'text-3xl sm:text-4xl lg:text-5xl')}>
                {title}
              </h2>
            )}
            {description && (
              <p className={clsx('mt-4 sm:mt-6', 'text-base sm:text-lg lg:text-xl', isEven ? 'text-gray-600' : 'text-gray-300')}>
                {description}
              </p>
            )}

            {href && ctaText && (
              <div className="mt-8 sm:mt-10">
                <Link
                  href={href}
                  className={clsx(
                    'inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold shadow-sm focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2',
                    isEven
                      ? 'bg-gray-900 text-white hover:bg-black focus-visible:outline-gray-900'
                      : 'bg-white text-gray-900 hover:bg-gray-100 focus-visible:outline-white'
                  )}
                >
                  <span>{ctaText}</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M7 17L17 7M17 7H8M17 7V16"
                      stroke={isEven ? 'white' : '#111827'}
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

      {/* 背景装饰元素，提升辨识度（Apple 风格的简洁渐变）*/}
      <div
        aria-hidden
        className={clsx(
          'pointer-events-none absolute inset-0 -z-10 opacity-60 transition-opacity group-hover:opacity-80',
          isEven ? 'bg-[radial-gradient(80%_60%_at_20%_10%,#dbeafe_0%,transparent_60%)]' : 'bg-[radial-gradient(80%_60%_at_80%_20%,#111827_0%,transparent_60%)]'
        )}
      />
    </section>
  )
}


