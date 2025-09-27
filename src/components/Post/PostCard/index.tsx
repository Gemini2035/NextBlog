'use client'

import { Link, Card, Tag } from '@/ui'
import type { Post } from '../../../../.contentlayer/generated'
import { formatDate, cn } from '@/utils'
import { useEffect, useRef, useState } from 'react'

interface PostCardProps {
  post: Post
  variant?: 'default' | 'compact'
  showDescription?: boolean
}

interface OverflowIndicatorProps {
  isVisible: boolean
  direction: 'right' | 'down'
  size?: 'sm' | 'md'
  position?: 'title' | 'description'
}

function OverflowIndicator({ isVisible, direction, size = 'md', position }: OverflowIndicatorProps) {
  if (!isVisible) return null

  const sizeClasses = size === 'sm' ? 'text-xs' : 'text-sm'
  const arrowChar = direction === 'right' ? '»' : '»'
  const rotation = direction === 'down' ? 'rotate-90' : ''
  
  return (
    <div className={cn(
      "absolute right-1 flex items-center",
      position === 'title' ? 'bottom-1' : 'bottom-1'
    )}>
      <div className={cn(
        "text-gray-400 font-bold animate-pulse",
        sizeClasses,
        rotation
      )}>
        {arrowChar}
      </div>
    </div>
  )
}

interface TagTooltipProps {
  remainingTags: string[]
  children: React.ReactNode
}

function TagTooltip({ remainingTags, children }: TagTooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  
  if (remainingTags.length === 0) {
    return <>{children}</>
  }

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="cursor-pointer"
      >
        {children}
      </div>
      {isVisible && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsVisible(false)}></div>
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50">
            <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg max-w-xs border border-gray-700">
              <div className="flex flex-wrap gap-1">
                {remainingTags.map((tag, index) => (
                  <span key={tag} className="bg-gray-700 px-2 py-1 rounded text-xs">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export function PostCard({ post, variant = 'default', showDescription = true }: PostCardProps) {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const descriptionRef = useRef<HTMLParagraphElement>(null)
  const titleContainerRef = useRef<HTMLDivElement>(null)
  const descriptionContainerRef = useRef<HTMLDivElement>(null)
  const [isTitleScrolling, setIsTitleScrolling] = useState(false)
  const [isDescriptionScrolling, setIsDescriptionScrolling] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [animationKey, setAnimationKey] = useState(0)
  const [titleScrollDistance, setTitleScrollDistance] = useState(0)
  const [descriptionScrollDistance, setDescriptionScrollDistance] = useState(0)

  useEffect(() => {
    const titleElement = titleRef.current
    const descriptionElement = descriptionRef.current
    if (!titleElement || !descriptionElement) return

    // 检查标题是否超出容器宽度
    const checkTitleOverflow = () => {
      const containerWidth = titleElement.parentElement?.clientWidth || 0
      const textWidth = titleElement.scrollWidth
      const isOverflowing = textWidth > containerWidth
      
      // 计算滚动距离：让标题最右侧刚好到达容器最右侧
      const distance = isOverflowing ? textWidth - containerWidth : 0
      
      setIsTitleScrolling(isOverflowing)
      setTitleScrollDistance(distance)
    }

    // 检查描述是否超出容器高度
    const checkDescriptionOverflow = () => {
      const containerHeight = descriptionElement.parentElement?.clientHeight || 0
      const textHeight = descriptionElement.scrollHeight
      const isOverflowing = textHeight > containerHeight
      
      // 计算滚动距离：让描述最底部刚好到达容器最底部
      const distance = isOverflowing ? textHeight - containerHeight : 0
      
      setIsDescriptionScrolling(isOverflowing)
      setDescriptionScrollDistance(distance)
    }

    const checkOverflow = () => {
      checkTitleOverflow()
      checkDescriptionOverflow()
    }

    // 延迟检查，确保DOM已渲染
    setTimeout(checkOverflow, 100)
    
    // 监听窗口大小变化
    window.addEventListener('resize', checkOverflow)
    return () => window.removeEventListener('resize', checkOverflow)
  }, [post.title, post.description])

  const isCompact = variant === 'compact'
  const padding = isCompact ? 'p-4' : 'p-6'
  const titleHeight = isCompact ? 'h-8' : 'h-[4rem]'
  const titleSize = isCompact ? 'text-lg' : 'text-xl'
  const titleTag = isCompact ? 'h3' : 'h2'
  const descriptionHeight = isCompact ? 'h-20' : 'h-36'
  const descriptionSize = isCompact ? 'text-xs' : 'text-sm'
  const tagHeight = isCompact ? 'h-6' : 'h-8'
  const tagSize = isCompact ? 'text-xs px-2 py-1' : ''

  const TitleComponent = titleTag as 'h2' | 'h3'

  return (
    <Card 
      shadow={isCompact ? "sm" : "md"} 
      rounded 
    >
      <Link 
        href={post.url}
        className="block h-full"
        onMouseEnter={() => {
          setIsHovered(true)
          if (isTitleScrolling || isDescriptionScrolling) {
            setAnimationKey(prev => prev + 1)
          }
        }}
        onMouseLeave={() => {
          setIsHovered(false)
          // 重置动画
          setAnimationKey(prev => prev + 1)
        }}
      >
        <div className={cn(
          isCompact ? "flex flex-col h-full" : "grid grid-rows-[auto_auto_auto] h-full",
          padding,
          isCompact ? "gap-0" : "gap-4"
        )}>
          {isCompact ? (
            <div className="flex-1">
              {/* 标题区域 */}
              <div className={cn(
                titleHeight,
                "flex flex-col justify-center overflow-hidden relative mb-3"
              )}>
                <div ref={titleContainerRef} className="w-full overflow-hidden">
                  <TitleComponent 
                    key={animationKey}
                    ref={titleRef}
                    className={cn(
                      titleSize, "font-bold text-gray-900 leading-tight",
                      "whitespace-nowrap relative transition-all duration-300",
                      isTitleScrolling && isHovered ? "w-max animate-pulse" : "w-full overflow-hidden"
                    )}
                    style={{
                      animation: isTitleScrolling && isHovered ? 'title-scroll 4s ease-out forwards 0.3s' : 'none',
                      '--scroll-distance': `${titleScrollDistance}px`
                    } as React.CSSProperties}
                    title={post.title}
                  >
                    {post.title}
                  </TitleComponent>
                </div>
                <OverflowIndicator 
                  isVisible={isTitleScrolling} 
                  direction="right" 
                  size="sm"
                  position="title"
                />
              </div>
              
              {/* 日期信息 */}
              <div className="text-xs text-gray-500 mb-3">
                <time dateTime={post.date}>
                  {formatDate(post.date)}
                </time>
                {post.updatedAt && post.updatedAt !== post.date && (
                  <div className="text-xs text-gray-400 mt-1">
                    更新于 {formatDate(post.updatedAt)}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* 标题区域 */}
              <div className={cn(
                titleHeight,
                "flex flex-col justify-center overflow-hidden relative"
              )}>
                <div ref={titleContainerRef} className="w-full overflow-hidden">
                  <TitleComponent 
                    key={animationKey}
                    ref={titleRef}
                    className={cn(
                      titleSize, "font-bold text-gray-900 leading-tight",
                      "whitespace-nowrap relative transition-all duration-300",
                      isTitleScrolling && isHovered ? "w-max animate-pulse" : "w-full overflow-hidden"
                    )}
                    style={{
                      animation: isTitleScrolling && isHovered ? 'title-scroll 4s ease-out forwards 0.3s' : 'none',
                      '--scroll-distance': `${titleScrollDistance}px`
                    } as React.CSSProperties}
                    title={post.title}
                  >
                    {post.title}
                  </TitleComponent>
                </div>
                <OverflowIndicator 
                  isVisible={isTitleScrolling} 
                  direction="right" 
                  size="md"
                  position="title"
                />
              </div>
              
              {/* 内容区域 */}
              {showDescription && (
                <div className={cn(
                  descriptionHeight,
                  "flex flex-col gap-2 overflow-hidden"
                )}>
                  {post.description && (
                    <div ref={descriptionContainerRef} className="flex-1 overflow-hidden relative">
                      <p 
                        key={animationKey}
                        ref={descriptionRef}
                        className={cn(
                          "text-gray-600 leading-relaxed transition-all duration-300",
                          descriptionSize,
                          isDescriptionScrolling && isHovered ? "animate-pulse" : ""
                        )}
                        style={{
                          animation: isDescriptionScrolling && isHovered ? 'description-scroll 4s ease-out forwards 0.3s' : 'none',
                          '--scroll-distance': `${descriptionScrollDistance}px`
                        } as React.CSSProperties}
                        title={post.description}
                      >
                        {post.description}
                      </p>
                      <OverflowIndicator 
                        isVisible={isDescriptionScrolling} 
                        direction="down" 
                        size="md"
                        position="description"
                      />
                    </div>
                  )}
                  
                  <div className="text-sm text-gray-500 flex-shrink-0">
                    <time dateTime={post.date}>
                      {formatDate(post.date)}
                    </time>
                    {post.updatedAt && post.updatedAt !== post.date && (
                      <div className="text-xs text-gray-400 mt-1">
                        更新于 {formatDate(post.updatedAt)}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
          
          {/* 标签区域 */}
          {post.tags && post.tags.length > 0 && (
            <div className={cn(
              tagHeight,
              "flex items-center overflow-hidden",
              isCompact ? "gap-1" : "gap-2"
            )}>
              <div className={cn(
                "flex overflow-hidden",
                isCompact ? "gap-1" : "gap-2"
              )}>
                {post.tags.slice(0, 3).map((tag: string) => (
                  <Tag key={tag} size="sm" className={cn("flex-shrink-0", tagSize)}>
                    {tag}
                  </Tag>
                ))}
                {post.tags.length > 3 && (
                  <TagTooltip remainingTags={post.tags.slice(3)}>
                    <span className={cn(
                      "text-gray-400 flex-shrink-0 cursor-pointer hover:text-gray-600 transition-colors bg-gray-100 hover:bg-gray-200 rounded px-2 py-1 border border-gray-200",
                      isCompact ? "text-xs" : "text-xs"
                    )}>
                      +{post.tags.length - 3}
                    </span>
                  </TagTooltip>
                )}
              </div>
            </div>
          )}
        </div>
      </Link>
    </Card>
  )
}