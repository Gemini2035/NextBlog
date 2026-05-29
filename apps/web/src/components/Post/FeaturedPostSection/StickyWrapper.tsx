'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { cn } from '@/utils'
import { useLayoutHeights, useAnchorScroll } from '@/hooks'
import { PostCard } from '../PostCard'
import { Slider, Button } from '@/ui'
import { CollapseIcon } from '@/assets/icons'
import type { BlogPostListItem } from '@/types/blog'

interface StickyWrapperProps {
  featuredPosts: BlogPostListItem[]
  title: string
}

export function StickyWrapper({ featuredPosts, title }: StickyWrapperProps) {
  const t = useTranslations('Posts')
  const [isSticky, setIsSticky] = useState(false)
  const [sectionHeight, setSectionHeight] = useState<number | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  const cardListRef = useRef<HTMLDivElement>(null) // 新增：用于监听卡片列表底部
  const originalTopRef = useRef<number | null>(null)
  const lastScrollY = useRef(0)
  const scrollDirection = useRef<'up' | 'down' | null>(null)
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null)
  const { headerHeight } = useLayoutHeights()

  // 优化的滚动处理函数 - 监听卡片列表底部
  const handleScroll = useCallback(() => {
    if (!sectionRef.current || !cardListRef.current || originalTopRef.current === null) return

    const scrollY = window.scrollY
    
    // 检测滚动方向
    const currentScrollDirection = scrollY > lastScrollY.current ? 'down' : 'up'
    scrollDirection.current = currentScrollDirection
    lastScrollY.current = scrollY
    
    // 获取卡片列表底部的位置
    const cardListRect = cardListRef.current.getBoundingClientRect()
    const cardListBottom = cardListRect.bottom + scrollY
    
    // 当卡片列表底部离开顶部HeaderHeight时，才进行sticky状态转换
    const shouldBeSticky = cardListBottom > headerHeight
    
    // 特殊情况：当滚动到接近顶部时，强制取消sticky状态
    const isNearTop = scrollY <= headerHeight + 10 // 10px的缓冲区域
    
    const finalShouldBeSticky = shouldBeSticky && !isNearTop
    
    if (finalShouldBeSticky !== isSticky) {
      setIsTransitioning(true)
      setIsSticky(finalShouldBeSticky)
      
      // 动画完成后重置过渡状态
      setTimeout(() => {
        setIsTransitioning(false)
      }, 300)
    }
    
    // 向上滚动时自动打开折叠状态
    // 当向上滚动且距离原始位置较近时（100px范围内），自动展开
    if (isSticky && isCollapsed && currentScrollDirection === 'up' && scrollY < originalTopRef.current + 100) {
      // 清除之前的定时器
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current)
      }
      
      // 添加防抖，避免过于频繁的状态变化
      scrollTimeout.current = setTimeout(() => {
        setIsCollapsed(false)
      }, 100)
    }
  }, [isSticky, isCollapsed, headerHeight])

  useEffect(() => {
    // 初始化：记录原始位置和高度
    const initPosition = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect()
        originalTopRef.current = rect.top + window.scrollY - headerHeight
        setSectionHeight(rect.height)
      }
    }

    // 页面加载完成后初始化
    if (document.readyState === 'complete') {
      initPosition()
    } else {
      window.addEventListener('load', initPosition)
    }

    // 添加滚动监听
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('load', initPosition)
      window.removeEventListener('scroll', handleScroll)
      // 清理定时器
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current)
      }
    }
  }, [handleScroll, headerHeight])

  // 当不再sticky时重置收起状态
  useEffect(() => {
    if (!isSticky) {
      setIsCollapsed(false)
    }
  }, [isSticky])

  // 使用通用锚点滚动hook
  useAnchorScroll({ anchorId: 'featured' })

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
          isSticky && "fixed left-0 right-0 z-49 bg-white shadow-lg border-b border-gray-200",
          isCollapsed && isSticky && "transform -translate-y-full"
        )}
        style={{ top: headerHeight }}
      >
        <div className={cn(
          isSticky && "mx-auto px-4 sm:px-6 lg:px-8 py-4"
        )}>
          <div className={cn(
            "transition-all duration-300 ease-in-out",
            isTransitioning && "opacity-0",
            !isTransitioning && "opacity-100"
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
                <div ref={cardListRef}>
                  <Slider
                    items={featuredPosts.map((post) => (
                      <PostCard key={post.id} post={post} variant="compact" showDescription={false} />
                    ))}
                    itemsPerPage={3.2}
                    slidePerPage={1}
                    gap={12}
                    showNavigation={featuredPosts.length > 3}
                    showIndicators={false}
                    className="h-auto"
                    itemContainerClassName="py-1"
                    previousPageLabel={t('previousPage')}
                    nextPageLabel={t('nextPage')}
                    goToPageLabel={t('goToPage', { page: '{page}' })}
                  />
                </div>
              </div>
            </div>
          ) : (
            // 正常状态下的布局
            <>
              <h2 id="featured" className="text-2xl font-bold text-gray-900 mb-6">
                {title}
              </h2>
              {featuredPosts.length === 1 ? (
                <PostCard post={featuredPosts[0]} />
              ) : (
                <div className="relative">
                  <div ref={cardListRef}>
                    <Slider
                      items={featuredPosts.map((post) => (
                        <PostCard key={post.id} post={post} />
                      ))}
                      itemsPerPage={3}
                      slidePerPage={1}
                      gap={24}
                      showNavigation={featuredPosts.length > 3}
                      showIndicators={false}
                      className="h-auto"
                      itemContainerClassName="py-1"
                      previousPageLabel={t('previousPage')}
                      nextPageLabel={t('nextPage')}
                      goToPageLabel={t('goToPage', { page: '{page}' })}
                    />
                  </div>
                </div>
              )}
            </>
          )}
          </div>
        </div>
        
        {/* 收起按钮 - 仅在sticky状态下显示 */}
        {isSticky && (
          <Button
            onClick={() => setIsCollapsed(!isCollapsed)}
            type="ghost"
            size="sm"
            className="absolute left-0 top-full px-3 py-2 rounded-full transition-all duration-300 z-50 bg-white border border-gray-200 shadow-sm hover:shadow-md"
            aria-label={isCollapsed ? t('expandFeatured') : t('collapseFeatured')}
          >
            <CollapseIcon 
              className={cn(
                "w-5 h-5 scale-250",
                isCollapsed ? "rotate-0" : "rotate-180"
              )}
            />
          </Button>
        )}
      </div>
    </>
  )
}
