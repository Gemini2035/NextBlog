'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { cn } from '@/utils'
import { useLayoutHeights } from '@/hooks'
import { PostCard } from '../PostCard'
import CompactPostCard from './CompactPostCard'
import { Slider } from '@/ui'
import type { Post } from '../../../../.contentlayer/generated'

interface StickyWrapperProps {
  featuredPosts: Post[]
  title: string
}

export function StickyWrapper({ featuredPosts, title }: StickyWrapperProps) {
  const [isSticky, setIsSticky] = useState(false)
  const [sectionHeight, setSectionHeight] = useState<number | null>(null)
  const sectionRef = useRef<HTMLDivElement>(null)
  const originalTopRef = useRef<number | null>(null)
  const { headerHeight } = useLayoutHeights()

  // 稳定的滚动处理函数
  const handleScroll = useCallback(() => {
    if (!sectionRef.current || !originalTopRef.current) return

    const scrollY = window.scrollY
    
    // 使用原始位置和当前滚动位置来判断
    const shouldBeSticky = scrollY > originalTopRef.current - headerHeight
    
    if (shouldBeSticky !== isSticky) {
      setIsSticky(shouldBeSticky)
    }
  }, [isSticky])

  useEffect(() => {
    // 初始化：记录原始位置和高度
    if (sectionRef.current) {
      const rect = sectionRef.current.getBoundingClientRect()
      originalTopRef.current = rect.top + window.scrollY - headerHeight
      setSectionHeight(rect.height)
    }

    // 添加滚动监听
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll])

  return (
    <>
      {/* 占位div - 当组件变为sticky时保持布局稳定 */}
      {isSticky && sectionHeight && (
        <div 
          className="w-full"
          style={{ height: sectionHeight }}
          aria-hidden="true"
        />
      )}
      
      <div 
        ref={sectionRef}
        className={cn(
          "mb-12 transition-all duration-300 ease-in-out",
          isSticky && "fixed left-0 right-0 z-49 bg-white shadow-lg border-b border-gray-200"
        )}
        style={{ top: headerHeight }}
      >
        <div className={cn(
          isSticky && "mx-auto px-4 sm:px-6 lg:px-8 py-4"
        )}>
          {isSticky ? (
            // Sticky状态下的左右布局
            <div className="flex items-center gap-16 px-16">
              {/* 左侧标题 */}
              <div className="flex-shrink-0">
                <h2 className="text-xl font-bold text-gray-900 whitespace-nowrap">
                  {title}
                </h2>
              </div>
              
              {/* 右侧Slider */}
              <div className="flex-1 min-w-0">
                <Slider
                  items={featuredPosts.map((post) => (
                    <CompactPostCard key={post._id} post={post} featured={true} />
                  ))}
                  itemsPerPage={3.2}
                  slidePerPage={1}
                  gap={12}
                  showNavigation={featuredPosts.length > 3}
                  showIndicators={false}
                  className="h-auto"
                  itemContainerClassName="py-1"
                />
              </div>
            </div>
          ) : (
            // 正常状态下的布局
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                {title}
              </h2>
              {featuredPosts.length === 1 ? (
                <PostCard post={featuredPosts[0]} featured={true} />
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {featuredPosts.map((post) => (
                    <PostCard key={post._id} post={post} featured={true} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  )
}
