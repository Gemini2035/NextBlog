'use client'

import { Link, Card, Tooltip } from '@/ui'
import { PostTag } from '../PostTag'
import type { Post } from '../../../../.contentlayer/generated'
import { formatDate, cn } from '@/utils'
import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'

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


export function PostCard({ post, variant = 'default', showDescription = true }: PostCardProps) {
  const t = useTranslations('PostCard')
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
              <div className="flex items-center overflow-hidden w-full gap-1">
                {/* 显示的标签 */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  {post.tags.slice(0, 3).map((tag: string) => (
                    <PostTag key={tag} size="small" compact className={cn("flex-shrink-0", tagSize)}>
                      {tag}
                    </PostTag>
                  ))}
                </div>
                
                {/* 隐藏标签的提示 */}
                {post.tags.length > 3 && (
                  <div className="flex-shrink-0 flex items-center">
                    <Tooltip 
                      title={
                        <div className="space-y-2">
                          <div className="text-xs text-gray-300 font-medium">
                            {t('remainingTags')}
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {post.tags.slice(3).map((tag: string) => (
                              <PostTag key={tag} size="small" inTooltip>
                                {tag}
                              </PostTag>
                            ))}
                          </div>
                        </div>
                      }
                      placement="top"
                      theme="dark"
                      delay={200}
                    >
                      <span className={cn(
                        "text-gray-500 text-xs font-medium",
                        isCompact ? "text-xs" : "text-xs"
                      )}>
                        +{post.tags.length - 3}
                      </span>
                    </Tooltip>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </Link>
    </Card>
  )
}