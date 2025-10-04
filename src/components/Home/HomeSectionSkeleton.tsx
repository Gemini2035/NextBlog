'use client'

import { ReactNode } from 'react'
import { Link } from '@/ui'
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
  const isBlogSection = index === 0 // 博客部分
  const isEven = index % 2 === 0
  
  // 使用 Intersection Observer 检测元素是否进入视口
  const { elementRef, shouldAnimate } = useIntersectionObserver({
    threshold: 0, // 当元素开始进入视口时触发
    rootMargin: '0px 0px 0px 0px', // 上边框出现到屏幕上时触发
    triggerOnce: false // 支持重复播放
  })

  // 确定背景色：博客部分使用与标签相同的蓝色，其他部分交替
  const getBackgroundClass = () => {
    if (isBlogSection) {
      return 'bg-blue-100 border-blue-200 hover:border-blue-300'
    }
    // 从博客部分之后开始交替：index 1=白色, 2=与博客相同的蓝色, 3=白色...
    const adjustedIndex = index - 1
    return adjustedIndex % 2 === 0
      ? 'bg-white border-gray-200 hover:border-gray-300'
      : 'bg-blue-100 border-blue-200 hover:border-blue-300'
  }

  return (
    <section
      ref={elementRef}
      className={cn(
        'w-full overflow-hidden border transition-all duration-700 ease-out',
        'group relative isolate',
        getBackgroundClass(),
        // 动画状态 - 从下方滑入并淡入
        shouldAnimate 
          ? 'opacity-100 translate-y-0 scale-100' 
          : 'opacity-0 translate-y-12 scale-95'
      )}
    >
      <div className={cn(
        'px-6 py-16 sm:px-10 sm:py-20 lg:px-16 transition-all duration-700 ease-out delay-150',
        // 文字颜色：博客部分和projects部分使用与标签相同的蓝色文字，其他部分根据背景色决定
        isBlogSection || (index - 1) % 2 !== 0
          ? 'text-blue-800' 
          : 'text-gray-900',
        // 内容动画 - 稍微延迟出现
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
                'text-base sm:text-lg lg:text-xl', 
                // 描述文字颜色：博客部分和projects部分使用深蓝色，其他部分根据背景色决定
                isBlogSection || (index - 1) % 2 !== 0
                  ? 'text-blue-600'
                  : 'text-gray-600'
              )}>
                {description}
              </p>
            )}

            {href && ctaText && (
              <div className="mt-8 sm:mt-10">
                <Link
                  href={href}
                  className={cn(
                    'inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold shadow-sm focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2',
                    // 按钮颜色：博客部分和projects部分使用深蓝色按钮，其他部分根据背景色决定
                    isBlogSection || (index - 1) % 2 !== 0
                      ? 'bg-blue-800 text-white hover:bg-blue-900 focus-visible:outline-blue-800'
                      : 'bg-blue-900 text-white hover:bg-blue-800 focus-visible:outline-blue-900'
                  )}
                >
                  <span>{ctaText}</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M7 17L17 7M17 7H8M17 7V16"
                      stroke={isBlogSection || (index - 1) % 2 !== 0 ? 'white' : 'white'}
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


