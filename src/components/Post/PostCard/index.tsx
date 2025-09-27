'use client'

import { Link, Card, Tag } from '@/ui'
import type { Post } from '../../../../.contentlayer/generated'
import { formatDate, cn } from '@/utils'
import { useEffect, useRef, useState } from 'react'

interface PostCardProps {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
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

  return (
    <Card 
      shadow="md" 
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
        <div className="grid grid-rows-[auto_auto_auto] h-full p-6 gap-4">
                {/* 标题区域 - 固定高度 */}
                <div className="h-[4rem] flex flex-col justify-center overflow-hidden relative">
                  <div ref={titleContainerRef} className="w-full overflow-hidden">
                    <h2 
                      key={animationKey}
                      ref={titleRef}
                      className={cn(
                        "text-xl font-bold text-gray-900 leading-tight",
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
                    </h2>
                  </div>
                  {/* 标题超出提示箭头 */}
                  {isTitleScrolling && (
                    <div className="absolute right-1 bottom-1 flex items-center">
                      <div className="text-gray-400 text-sm font-bold animate-pulse">»</div>
                    </div>
                  )}
                </div>
          
          {/* 内容区域 - 固定高度 */}
          <div className="h-36 flex flex-col gap-2 overflow-hidden">
            {post.description && (
              <div ref={descriptionContainerRef} className="flex-1 overflow-hidden relative">
                <p 
                  key={animationKey}
                  ref={descriptionRef}
                  className={cn(
                    "text-gray-600 leading-relaxed text-sm transition-all duration-300",
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
                {/* 描述超出提示箭头 */}
                {isDescriptionScrolling && (
                  <div className="absolute right-1 bottom-1 flex items-center">
                    <div className="text-gray-400 text-sm font-bold animate-pulse rotate-90">»</div>
                  </div>
                )}
              </div>
            )}
            
            <div className="text-sm text-gray-500 flex-shrink-0">
              <div className="flex items-center">
                <time dateTime={post.date}>
                  {formatDate(post.date)}
                </time>
              </div>
              {post.updatedAt && post.updatedAt !== post.date && (
                <div className="text-xs text-gray-400 mt-1">
                  更新于 {formatDate(post.updatedAt)}
                </div>
              )}
            </div>
          </div>
          
          {/* 标签区域 - 固定高度 */}
          {post.tags && post.tags.length > 0 && (
            <div className="h-8 flex items-center gap-2 overflow-hidden">
              <div className="flex gap-2 overflow-hidden">
                {post.tags.slice(0, 3).map((tag: string) => (
                  <Tag key={tag} size="sm" className="flex-shrink-0">
                    {tag}
                  </Tag>
                ))}
                {post.tags.length > 3 && (
                  <span className="text-xs text-gray-400 flex-shrink-0 px-2 py-1">
                    +{post.tags.length - 3}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </Link>
    </Card>
  )
}
