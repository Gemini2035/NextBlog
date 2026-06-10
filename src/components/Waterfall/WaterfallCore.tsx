'use client'

import { ReactNode, useEffect, useRef, useState } from 'react'
import { Card } from '@/ui'
import { cn } from '@/utils'

interface WaterfallItem {
  id: string
  content: ReactNode
  height?: 'short' | 'medium' | 'tall'
  cardClassName?: string
}

interface WaterfallCoreProps {
  items: WaterfallItem[]
  columns?: number
  gap?: number
  className?: string
}

export default function WaterfallCore({ 
  items, 
  columns = 2,
  gap = 24,
  className 
}: WaterfallCoreProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  const [columnHeights, setColumnHeights] = useState<number[]>([])
  const [itemPositions, setItemPositions] = useState<Array<{ top: number; left: number; width: number }>>([])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || !containerRef.current) return

    const calculateLayout = () => {
      if (!containerRef.current) return

      const container = containerRef.current
      const containerWidth = container.offsetWidth
      const actualColumns = window.innerWidth >= 768 ? 2 : 1
      const itemWidth = Math.floor((containerWidth - (gap * (actualColumns - 1))) / actualColumns)
      
      const newColumnHeights = new Array(actualColumns).fill(0)
      const newItemPositions: Array<{ top: number; left: number; width: number }> = []

      items.forEach((item, index) => {
        // 找到最短的列
        const shortestColumnIndex = newColumnHeights.indexOf(Math.min(...newColumnHeights))
        
        const left = shortestColumnIndex * (itemWidth + gap)
        const top = newColumnHeights[shortestColumnIndex]

        newItemPositions[index] = { top, left, width: itemWidth }
        
        // 使用估算高度进行初步布局
        let estimatedHeight = 200 // 默认高度
        if (item.height === 'short') estimatedHeight = 192
        else if (item.height === 'medium') estimatedHeight = 256
        else if (item.height === 'tall') estimatedHeight = 320

        newColumnHeights[shortestColumnIndex] += estimatedHeight + gap
      })

      setColumnHeights(newColumnHeights)
      setItemPositions(newItemPositions)
    }

    // 初始计算
    calculateLayout()

    // 监听窗口大小变化
    const handleResize = () => {
      calculateLayout()
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [mounted, items, columns, gap])

  // 实际渲染后重新计算高度和位置
  useEffect(() => {
    if (!mounted || !containerRef.current) return

    const recalculateLayout = () => {
      const container = containerRef.current
      if (!container) return

      const actualColumns = window.innerWidth >= 768 ? 2 : 1
      const containerWidth = container.offsetWidth
      const itemWidth = Math.floor((containerWidth - (gap * (actualColumns - 1))) / actualColumns)
      
      const newColumnHeights = new Array(actualColumns).fill(0)
      const newItemPositions: Array<{ top: number; left: number; width: number }> = []
      
      // 获取所有项目元素
      const itemElements = container.querySelectorAll('[data-waterfall-item]')
      
      // 按原始顺序重新计算位置
      items.forEach((item, index) => {
        const element = itemElements[index] as HTMLElement
        if (!element) return

        // 找到最短的列
        const shortestColumnIndex = newColumnHeights.indexOf(Math.min(...newColumnHeights))
        
        const left = shortestColumnIndex * (itemWidth + gap)
        const top = newColumnHeights[shortestColumnIndex]

        // 获取元素实际高度
        const elementHeight = element.offsetHeight || 200

        newItemPositions[index] = { top, left, width: itemWidth }
        newColumnHeights[shortestColumnIndex] += elementHeight + gap
      })

      setColumnHeights(newColumnHeights)
      setItemPositions(newItemPositions)
    }

    // 延迟重新计算，确保DOM已渲染
    const timer = setTimeout(recalculateLayout, 100)
    return () => clearTimeout(timer)
  }, [mounted, items, gap])

  if (!mounted) {
    return (
      <div className={cn('relative', className)} ref={containerRef}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((item) => (
            <div key={item.id} className="opacity-0">
              {item.content}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div 
      ref={containerRef}
      className={cn('relative', className)}
      style={{ 
        height: columnHeights.length > 0 ? Math.max(...columnHeights, 0) : 'auto'
      }}
    >
      {items.map((item, index) => {
        const position = itemPositions[index]
        if (!position) return null

        return (
          <div
            key={item.id}
            data-waterfall-item
            className="absolute animate-fade-in-up transition-all duration-500 ease-out"
            style={{
              top: `${position.top}px`,
              left: `${position.left}px`,
              width: `${position.width}px`,
              maxWidth: `${position.width}px`
            }}
          >
            <Card 
              shadow="none"
              border="sm" 
              rounded 
              disabledHover
              className={cn(
                'h-full rounded-[var(--site-radius-card)] border border-[var(--site-border)] bg-[var(--site-canvas)] p-8 shadow-none transition-colors hover:border-[var(--site-action)]',
                item.cardClassName
              )}
            >
              {item.content}
            </Card>
          </div>
        )
      })}
    </div>
  )
}
