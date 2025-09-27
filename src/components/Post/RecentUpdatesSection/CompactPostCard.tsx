'use client'

import { Link, Card, Tag } from '@/ui'
import type { Post } from '../../../../.contentlayer/generated'
import { formatDate, cn } from '@/utils'
import { useEffect, useRef, useState } from 'react'

interface CompactPostCardProps {
  post: Post
  featured?: boolean
}

export default function CompactPostCard({ post, featured = false }: CompactPostCardProps) {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isTitleScrolling, setIsTitleScrolling] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [animationKey, setAnimationKey] = useState(0)
  const [scrollDistance, setScrollDistance] = useState(0)

  useEffect(() => {
    const titleElement = titleRef.current
    if (!titleElement) return

    // 检查标题是否超出容器宽度
    const checkOverflow = () => {
      const containerWidth = titleElement.parentElement?.clientWidth || 0
      const textWidth = titleElement.scrollWidth
      const isOverflowing = textWidth > containerWidth
      
      // 计算滚动距离：让标题最右侧刚好到达容器最右侧
      const distance = isOverflowing ? textWidth - containerWidth : 0
      
      setIsTitleScrolling(isOverflowing)
      setScrollDistance(distance)
    }

    // 延迟检查，确保DOM已渲染
    setTimeout(checkOverflow, 100)
    
    // 监听窗口大小变化
    window.addEventListener('resize', checkOverflow)
    return () => window.removeEventListener('resize', checkOverflow)
  }, [post.title])
  return (
    <Card 
      shadow="sm" 
      rounded 
    >
      <Link 
        href={post.url}
        className="block h-full"
        onMouseEnter={() => {
          setIsHovered(true)
          if (isTitleScrolling) {
            setAnimationKey(prev => prev + 1)
          }
        }}
        onMouseLeave={() => {
          setIsHovered(false)
          // 重置动画
          setAnimationKey(prev => prev + 1)
        }}
      >
        <div className="flex flex-col h-full p-4">
          <div className="flex-1">
            <div className="h-8 flex flex-col justify-center overflow-hidden relative mb-2">
              <div ref={containerRef} className="w-full overflow-hidden">
                <h3 
                  key={animationKey}
                  ref={titleRef}
                  className={cn(
                    "text-lg font-bold text-gray-900 leading-tight",
                    "whitespace-nowrap relative transition-all duration-300",
                    isTitleScrolling && isHovered ? "w-max animate-pulse" : "w-full overflow-hidden"
                  )}
                  style={{
                    animation: isTitleScrolling && isHovered ? 'title-scroll 4s ease-out forwards 0.3s' : 'none',
                    '--scroll-distance': `${scrollDistance}px`
                  } as React.CSSProperties}
                  title={post.title}
                >
                  {post.title}
                </h3>
              </div>
              {/* 标题超出提示箭头 */}
              {isTitleScrolling && (
                <div className="absolute right-1 bottom-0 flex items-center">
                  <div className="text-gray-400 text-xs font-bold animate-pulse">»</div>
                </div>
              )}
            </div>
            
            
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
          
          {post.tags && post.tags.length > 0 && (
            <div className="h-6 flex items-center gap-1 overflow-hidden">
              <div className="flex gap-1 overflow-hidden">
                {post.tags.slice(0, 3).map((tag: string) => (
                  <Tag key={tag} size="sm" className="text-xs px-2 py-1 flex-shrink-0">
                    {tag}
                  </Tag>
                ))}
                {post.tags.length > 3 && (
                  <span className="text-xs text-gray-400 px-2 py-1 flex-shrink-0">
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
