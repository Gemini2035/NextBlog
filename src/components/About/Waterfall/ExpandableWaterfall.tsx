'use client'

import { ReactNode, useEffect, useRef, useState } from 'react'
import { Card } from '@/ui'
import { cn } from '@/utils'
import { CloseIcon } from '@/assets/icons'
import { useIntersectionObserver } from '@/hooks'

interface ExpandableWaterfallItem {
  id: string
  content: ReactNode
  expandedContent?: ReactNode
  height?: 'short' | 'medium' | 'tall'
  cardClassName?: string
  title?: string
  description?: string
}

// 单个Waterfall Item组件，处理动画
interface WaterfallItemProps {
  item: ExpandableWaterfallItem
  position: { top: number; left: number; width: number }
  isExpanded: boolean
  onItemClick: (itemId: string) => void
  index: number
}

function WaterfallItem({ item, position, isExpanded, onItemClick, index }: WaterfallItemProps) {
  const { elementRef, shouldAnimate } = useIntersectionObserver({
    threshold: 0.05,
    rootMargin: '0px 0px -30px 0px',
    triggerOnce: false
  })

  return (
    <div
      ref={elementRef as React.RefObject<HTMLDivElement>}
      data-waterfall-item
      className={cn(
        'absolute transition-all duration-700 ease-out cursor-pointer group',
        isExpanded ? 'z-50' : 'hover:scale-105',
        // 动画状态 - 从下方滑入并淡入
        shouldAnimate 
          ? 'opacity-100 translate-y-0 scale-100' 
          : 'opacity-0 translate-y-8 scale-95'
      )}
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        width: `${position.width}px`,
        maxWidth: `${position.width}px`,
        transitionDelay: `${index * 100}ms` // 交错动画延迟
      }}
      onClick={() => onItemClick(item.id)}
    >
      <Card 
        shadow="lg" 
        border="sm" 
        rounded 
        className={cn(
          'p-6 bg-white/90 backdrop-blur-sm h-full transition-all duration-300',
          'hover:shadow-xl hover:bg-white',
          item.cardClassName
        )}
      >
        <div className={cn(
          'transition-all duration-700 ease-out delay-150',
          // 内容动画 - 稍微延迟出现
          shouldAnimate 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-4'
        )}>
          {item.content}
        </div>
        
        {/* 展开提示 */}
        {item.expandedContent && (
          <div className={cn(
            'mt-4 pt-4 border-t border-gray-200 transition-all duration-700 ease-out delay-200',
            shouldAnimate 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-2'
          )}>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>点击查看详情</span>
              <div className="w-2 h-2 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}

interface ExpandableWaterfallProps {
  items: ExpandableWaterfallItem[]
  columns?: number
  gap?: number
  className?: string
}

export default function ExpandableWaterfall({ 
  items, 
  columns = 2,
  gap = 24,
  className 
}: ExpandableWaterfallProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  const [columnHeights, setColumnHeights] = useState<number[]>([])
  const [itemPositions, setItemPositions] = useState<Array<{ top: number; left: number; width: number }>>([])
  const [expandedItem, setExpandedItem] = useState<string | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)

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

  const handleItemClick = (itemId: string) => {
    if (isAnimating) return
    
    setIsAnimating(true)
    setExpandedItem(itemId)
    
    // 禁用body滚动
    document.body.style.overflow = 'hidden'
    
    // 动画完成后重置动画状态
    setTimeout(() => {
      setIsAnimating(false)
    }, 300)
  }

  const handleCloseExpanded = () => {
    if (isAnimating) return
    
    setIsAnimating(true)
    setExpandedItem(null)
    
    // 恢复body滚动
    document.body.style.overflow = 'unset'
    
    // 动画完成后重置动画状态
    setTimeout(() => {
      setIsAnimating(false)
    }, 300)
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleCloseExpanded()
    }
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && expandedItem) {
      handleCloseExpanded()
    }
  }

  useEffect(() => {
    if (expandedItem) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [expandedItem])

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
    <>
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

          const isExpanded = expandedItem === item.id

          return (
            <WaterfallItem
              key={item.id}
              item={item}
              position={position}
              isExpanded={isExpanded}
              onItemClick={handleItemClick}
              index={index}
            />
          )
        })}
      </div>

      {/* 展开的模态框 */}
      {expandedItem && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={handleBackdropClick}
          style={{
            animation: isAnimating ? 'fadeIn 0.3s ease-out' : undefined
          }}
        >
          <div 
            className="relative max-w-4xl max-h-[90vh] w-full bg-white rounded-2xl shadow-2xl overflow-hidden"
            style={{
              animation: isAnimating ? 'slideInScale 0.3s ease-out' : undefined
            }}
          >
            {/* 关闭按钮 */}
            <button
              onClick={handleCloseExpanded}
              className="absolute top-4 right-4 z-10 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110"
            >
              <CloseIcon className="w-4 h-4 text-gray-600" />
            </button>

            {/* 内容区域 */}
            <div className="overflow-y-auto max-h-[90vh] p-8">
              {items.find(item => item.id === expandedItem)?.expandedContent || 
               items.find(item => item.id === expandedItem)?.content}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideInScale {
          from { 
            opacity: 0;
            transform: scale(0.9) translateY(20px);
          }
          to { 
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </>
  )
}
