'use client'

import { ReactNode } from 'react'
import { Link, Button } from '@/ui'
import { ArrowRightIcon } from '@/assets/icons'
import { useIntersectionObserver } from '@/hooks'
import { cn } from '@/utils'

export interface HomeSectionSkeletonProps {
  title?: ReactNode
  description?: ReactNode
  href?: string
  ctaText?: ReactNode
  index: number
  children?: ReactNode
}

export default function HomeSectionSkeleton({ title, description, href, ctaText, index, children }: HomeSectionSkeletonProps) {
  const isFirstContentSection = index === 0

  // 使用 Intersection Observer 检测元素是否进入视口
  const { elementRef, shouldAnimate } = useIntersectionObserver({
    threshold: isFirstContentSection ? 0.12 : 0, // 首个内容区避免被首屏视频高度变化提前触发
    rootMargin: isFirstContentSection ? '0px 0px -12% 0px' : '0px 0px 0px 0px',
    triggerOnce: false // 支持重复播放
  })

  // Apple white style: alternate white and soft canvas, no dark or saturated sections.
  const getBackgroundClass = () => {
    return index % 2 === 0
      ? 'bg-[var(--site-canvas-muted)] border-transparent'
      : 'bg-[var(--site-canvas)] border-transparent'
  }

  return (
    <section
      ref={elementRef}
      className={cn(
        'w-full overflow-hidden border-y transition-all duration-700 ease-out',
        'group relative isolate',
        getBackgroundClass(),
        shouldAnimate
          ? 'opacity-100 translate-y-0 scale-100'
          : 'opacity-0 translate-y-12 scale-95'
      )}
    >
      <div className={cn(
        'mx-auto max-w-7xl px-6 py-16 text-[var(--site-text)] transition-all duration-700 ease-out delay-150 sm:px-10 sm:py-20 lg:px-16',
        shouldAnimate
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-4'
      )}>
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
              <p className={cn(
                'mt-4 sm:mt-6',
                'text-base sm:text-lg lg:text-xl text-[var(--site-text-muted)]'
              )}>
                {description}
              </p>
            )}

            {href && ctaText && (
              <div className="mt-8 sm:mt-10">
                <Link href={href}>
                  <Button
                    type="primary"
                    size="sm"
                    rounded={true}
                    className={cn(
                      'inline-flex items-center gap-2',
                      'rounded-[var(--site-radius-control)] border border-[var(--site-action)] bg-[var(--site-action)] text-white hover:bg-[var(--site-action)] focus-visible:outline-[var(--site-focus-ring)]'
                    )}
                  >
                    <span>{ctaText}</span>
                    <ArrowRightIcon className="w-4 h-4" strokeWidth={1.8} />
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

    </section>
  )
}
