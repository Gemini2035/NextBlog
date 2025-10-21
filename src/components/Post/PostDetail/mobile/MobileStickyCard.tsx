'use client'

import { PostTag } from '../../PostTag'
import { formatDate, cn } from '@/utils'
import type { Post } from '../../../../../.contentlayer/generated'

interface MobileStickyCardProps {
  post: Post
  scrollProgress: number
}

/**
 * 移动端 Sticky 卡片
 * 渐进式缩小动画，从完整信息到只显示标题
 */
export function MobileStickyCard({ post, scrollProgress }: MobileStickyCardProps) {
  return (
    <div
      className={cn(
        "fixed left-0 right-0 top-0 z-50",
        "bg-white border-b border-gray-200 shadow-lg",
        "transition-all duration-300 ease-out",
        "animate-in slide-in-from-top"
      )}
    >
      <div 
        className="transition-all duration-300 ease-out"
        style={{
          paddingLeft: `${24 - scrollProgress * 12}px`,
          paddingRight: `${24 - scrollProgress * 12}px`,
          paddingTop: `${16 - scrollProgress * 8}px`,
          paddingBottom: `${16 - scrollProgress * 8}px`,
        }}
      >
        {/* 标题 - 始终显示，逐渐变小 */}
        <h2 
          className="font-bold text-gray-900 transition-all duration-300 ease-out"
          style={{
            fontSize: `${30 - scrollProgress * 12}px`,
            marginBottom: scrollProgress < 1 ? `${16 - scrollProgress * 16}px` : '0px',
            lineHeight: '1.5'
          }}
        >
          <span className={cn(scrollProgress >= 1 ? "line-clamp-1" : "line-clamp-2")}>
            {post.title}
          </span>
        </h2>

        {/* 日期信息 - 逐渐淡出 */}
        <div 
          className="flex flex-wrap items-center gap-4 text-gray-500 transition-all duration-300 ease-out overflow-hidden"
          style={{
            fontSize: `${14 - scrollProgress * 2}px`,
            maxHeight: `${(1 - scrollProgress) * 40}px`,
            opacity: 1 - scrollProgress,
            marginBottom: scrollProgress < 1 ? `${16 - scrollProgress * 16}px` : '0px',
          }}
        >
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          {post.updatedAt && post.updatedAt !== post.date && (
            <span>更新于 {formatDate(post.updatedAt)}</span>
          )}
        </div>

        {/* 标签 - 逐渐淡出 */}
        {post.tags && post.tags.length > 0 && (
          <div 
            className="transition-all duration-300 ease-out overflow-hidden"
            style={{
              maxHeight: `${(1 - scrollProgress) * 80}px`,
              opacity: Math.max(0, 1 - scrollProgress * 2),
            }}
          >
            <h3 
              className="font-semibold text-gray-800 transition-all duration-300 ease-out overflow-hidden"
              style={{
                fontSize: `${16 - scrollProgress * 4}px`,
                marginBottom: scrollProgress < 0.5 ? `${12 - scrollProgress * 24}px` : '0px',
              }}
            >
              标签
            </h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.slice(0, 4).map((tag: string) => (
                <PostTag key={tag} size="medium" variant="primary">
                  {tag}
                </PostTag>
              ))}
              {post.tags.length > 4 && (
                <span className="text-sm text-gray-500">+{post.tags.length - 4}</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

