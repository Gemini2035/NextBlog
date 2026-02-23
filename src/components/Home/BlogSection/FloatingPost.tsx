'use client'

import React from 'react'
import { Link } from '@/ui'
import { PostIcon } from '@/assets/icons/PostIcon'
import { cn } from '@/utils'
import type { Post } from '.contentlayer/generated'

interface FloatingPostProps {
  post: Post
  index: number
  total: number
  hoveredIndex: number | null
  onMouseEnter: (index: number) => void
  onMouseLeave: () => void
}

export const FloatingPost: React.FC<FloatingPostProps> = ({
  post,
  index,
  total,
  hoveredIndex,
  onMouseEnter,
  onMouseLeave
}) => {
  // 为多个卡片分配不同的动画和位置
  const getAnimationClass = (index: number) => {
    const animations = [
      'animate-float-1',
      'animate-float-2', 
      'animate-float-3',
      'animate-float-4',
      'animate-float-5',
      'animate-float-6'
    ]
    return animations[index % animations.length]
  }

  // 根据索引调整透明度，创建层次感
  const getOpacity = (index: number) => {
    if (index < 3) return 'opacity-90'
    if (index < 5) return 'opacity-75'
    return 'opacity-60'
  }

  // 动态z-index管理：hover时提升到最顶层
  const getZIndex = (index: number) => {
    if (hoveredIndex === index) return 50 // hover时最高层级
    if (hoveredIndex !== null) return 20 - index // 有其他hover时保持相对层级
    return 20 - index // 默认层级
  }

  // 计算均匀分布的位置
  const getUniformPosition = (index: number, total: number) => {
    if (total <= 2) {
      // 1-2个时，左右分布
      return {
        top: `${40 + index * 20}%`,
        left: `${60 + index * 20}%`
      }
    } else if (total <= 3) {
      // 3个时，三角形分布
      const positions = [
        { top: '20%', left: '70%' },
        { top: '50%', left: '60%' },
        { top: '80%', left: '80%' }
      ]
      return positions[index]
    } else if (total <= 4) {
      // 4个时，正方形分布
      const positions = [
        { top: '15%', left: '65%' },
        { top: '15%', left: '85%' },
        { top: '75%', left: '65%' },
        { top: '75%', left: '85%' }
      ]
      return positions[index]
    } else if (total <= 6) {
      // 5-6个时，使用网格分布
      const cols = 3
      const rows = Math.ceil(total / cols)
      const col = index % cols
      const row = Math.floor(index / cols)
      const baseTop = 10
      const baseLeft = 60
      const spacingY = rows > 1 ? 80 / (rows - 1) : 0
      const spacingX = cols > 1 ? 30 / (cols - 1) : 0
      return {
        top: `${baseTop + row * spacingY}%`,
        left: `${baseLeft + col * spacingX}%`
      }
    } else {
      // 更多时，使用圆形分布
      const angle = (index * 360) / total
      const radius = 18
      const centerX = 75
      const centerY = 50
      return {
        top: `${centerY + radius * Math.sin(angle * Math.PI / 180)}%`,
        left: `${centerX + radius * Math.cos(angle * Math.PI / 180)}%`
      }
    }
  }

  const position = getUniformPosition(index, total)

  return (
    <div
      className={cn(
        'absolute transform transition-all duration-1000 ease-out hover:scale-110 pointer-events-auto',
        getAnimationClass(index),
        getOpacity(index)
      )}
      style={{
        animationDelay: `${index * 0.2}s`,
        zIndex: getZIndex(index),
        top: position.top,
        left: position.left
      }}
      onMouseEnter={() => onMouseEnter(index)}
      onMouseLeave={onMouseLeave}
    >
      <div className={cn(
        'bg-blue-50/90 backdrop-blur-sm rounded-lg shadow-md',
        'border border-blue-200/60 p-2.5',
        'hover:shadow-lg transition-all duration-300',
        'hover:bg-blue-100/95 hover:opacity-100 max-w-56'
      )}>
        <Link href={post.url} className="block">
          <div className="flex items-center gap-2">
            {/* 文章图标 */}
            <div className="shrink-0 w-4 h-4 flex items-center justify-center">
              <PostIcon className="w-4 h-4" />
            </div>
            
            <div className="flex-1 min-w-0 flex items-center">
              <h3 className="text-xs font-semibold text-blue-800 line-clamp-2 leading-tight">
                {post.title}
              </h3>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}
