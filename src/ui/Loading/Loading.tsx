'use client'

import { useEffect } from 'react'
import type { LoadingProps } from './types'
import { getLoaderSize, getTextSize } from './styles'
import { cn } from '@/utils'

/**
 * Loading组件 - 加载状态指示器
 * 支持多种变体和尺寸
 * 
 * @example
 * ```tsx
 * // 基础用法
 * <Loading />
 * 
 * // 带文本
 * <Loading text="加载中..." showText />
 * 
 * // 不同尺寸
 * <Loading size="sm" />
 * <Loading size="lg" />
 * 
 * // 不同变体
 * <Loading variant="spinner" />
 * <Loading variant="dots" />
 * <Loading variant="pulse" />
 * 
 * // 全屏加载（会锁定屏幕滚动）
 * <Loading fullscreen text="加载中..." showText />
 * ```
 */
export function Loading({
  size = 'md',
  variant = 'spinner',
  text,
  showText = false,
  fullscreen = false,
  className
}: LoadingProps) {
  
  // 锁定屏幕滚动
  useEffect(() => {
    if (!fullscreen) return

    // 保存原始的 overflow 样式
    const originalOverflow = document.body.style.overflow
    const originalPaddingRight = document.body.style.paddingRight
    
    // 获取滚动条宽度，避免内容抖动
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    
    // 锁定滚动
    document.body.style.overflow = 'hidden'
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`
    }

    // 组件卸载时恢复滚动
    return () => {
      document.body.style.overflow = originalOverflow
      document.body.style.paddingRight = originalPaddingRight
    }
  }, [fullscreen])
  
  const renderLoader = () => {
    const sizeClass = getLoaderSize(size)
    
    switch (variant) {
      case 'spinner':
        return (
          <div className="relative">
            {/* 外圈 - 扁平化圆环 */}
            <div className={cn(
              'rounded-full border-4 border-gray-200',
              sizeClass
            )} />
            {/* 内圈 - 旋转的蓝色弧线 */}
            <div className={cn(
              'absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 animate-spin',
              sizeClass
            )} 
            style={{ animationDuration: '0.8s' }}
            />
          </div>
        )
      
      case 'dots':
        return (
          <div className="flex items-center gap-2">
            <span 
              className={cn('rounded-full bg-blue-600 animate-bounce', sizeClass)} 
              style={{ animationDelay: '0ms', animationDuration: '1s' }} 
            />
            <span 
              className={cn('rounded-full bg-blue-600 animate-bounce', sizeClass)} 
              style={{ animationDelay: '150ms', animationDuration: '1s' }} 
            />
            <span 
              className={cn('rounded-full bg-blue-600 animate-bounce', sizeClass)} 
              style={{ animationDelay: '300ms', animationDuration: '1s' }} 
            />
          </div>
        )
      
      case 'pulse':
        return (
          <div className={cn('rounded-full bg-blue-600 animate-pulse', sizeClass)} />
        )
      
      case 'skeleton':
        return (
          <div className="space-y-3 w-full">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6" />
          </div>
        )
      
      default:
        return null
    }
  }

  const content = (
    <div className={cn(
      'flex flex-col items-center justify-center gap-4',
      fullscreen ? 'min-h-screen' : 'py-8',
      className
    )}>
      {renderLoader()}
      {showText && text && (
        <p className={cn(
          'text-gray-700 font-medium',
          getTextSize(size)
        )}>
          {text}
        </p>
      )}
    </div>
  )

  if (fullscreen) {
    return (
      <div className="fixed inset-0 bg-white/70 backdrop-blur-[2px] z-50 flex items-center justify-center transition-all duration-300">
        {content}
      </div>
    )
  }

  return content
}

