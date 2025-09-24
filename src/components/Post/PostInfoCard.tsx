'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/ui'
import { formatDate, cn } from '@/utils'
import type { Post } from '../../../.contentlayer/generated'

interface PostInfoCardProps {
  post: Post
  triggerPoint?: number
}

export default function PostInfoCard({ post, triggerPoint = 200 }: PostInfoCardProps) {
  const [isSticky, setIsSticky] = useState(false)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const shouldBeSticky = scrollY > triggerPoint
      setIsSticky(shouldBeSticky)
    }

    // 添加滚动监听
    window.addEventListener('scroll', handleScroll)

    // 初始检查
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [triggerPoint])

  return (
    <Card 
      id="post-info-card"
      shadow="lg" 
      border="sm"
      rounded
      disabledHover
      className={cn(
        'liquid-transform transition-all duration-500 ease-in-out',
        isSticky 
          ? 'fixed top-50 right-4 min-w-80 w-30vw z-50 max-h-[calc(100vh-2rem)] overflow-y-auto shadow-2xl transform -translate-y-1/2' 
          : 'w-full mb-8',
        isSticky ? 'animate-slide-in-right' : 'animate-slide-in-top'
      )}
    >
      <div className="p-6">
        {/* 文章标题 */}
        <h1 className={cn('font-bold text-gray-900 mb-4', isSticky ? 'text-xl' : 'text-3xl')}>
          {post.title}
        </h1>
        
        {/* 日期信息 */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
          <time dateTime={post.date}>
            {formatDate(post.date)}
          </time>
          
          {post.updatedAt && post.updatedAt !== post.date && (
            <span>
              更新于 {formatDate(post.updatedAt)}
            </span>
          )}
        </div>
        
        {/* 文章描述 */}
        {post.description && (
          <div className="mb-6">
            <p className={cn('text-gray-700', isSticky ? 'text-sm' : 'text-lg')}>
              {post.description}
            </p>
          </div>
        )}
        
        {/* 标签 */}
        {post.tags && post.tags.length > 0 && (
          <div>
            <h3 className={cn('font-semibold text-gray-800 mb-3', isSticky ? 'text-sm' : 'text-base')}>
              标签
            </h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag: string) => (
                <span
                  key={tag}
                  className={cn('px-3 py-1 bg-blue-100 text-blue-800 rounded-full', isSticky ? 'text-xs' : 'text-sm')}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                