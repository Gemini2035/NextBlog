'use client'

import { ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import { Card } from '@/ui'
import { cn, smoothScrollToElement } from '@/utils'
import { CloseIcon } from '@/assets/icons'
import { useIntersectionObserver, useLayoutHeights } from '@/hooks'

interface ExpandableWaterfallItem {
  id: string
  content: ReactNode
  expandedContent?: ReactNode
  height?: 'short' | 'medium' | 'tall'
  cardClassName?: string
  title?: string
  description?: string
  /** 锚点ID，用于URL定位 */
  anchorId?: string
}

// 单个Waterfall Item组件，处理动画和锚点聚焦
interface WaterfallItemProps {
  item: ExpandableWaterfallItem
  position: { top: number; left: number; width: number }
  isExpanded: boolean
  onItemClick: (itemId: string) => void
  index: number
  isFocused?: boolean
}

function WaterfallItem({ item, position, isExpanded, onItemClick, index, isFocused = false }: WaterfallItemProps) {
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
        // 锚点聚焦样式
        isFocused && 'ring-4 ring-blue-400 ring-opacity-60 shadow-2xl scale-105',
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
          // 锚点聚焦时的卡片样式
          isFocused && 'bg-blue-50/90 shadow-2xl border-blue-200',
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
  const { headerHeight } = useLayoutHeights()
  const [mounted, setMounted] = useState(false)
  const [columnHeights, setColumnHeights] = useState<number[]>([])
  const [itemPositions, setItemPositions] = useState<Array<{ top: number; left: number; width: number }>>([])
  const [expandedItem, setExpandedItem] = useState<string | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [focusedItemId, setFocusedItemId] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // 锚点定位和聚焦逻辑
  useEffect(() => {
    const handleHashChange = () => {
      const currentHash = window.location.hash.slice(1) // 移除 # 符号
      if (!currentHash) {
        setFocusedItemId(null)
        return
      }

      // 查找匹配的锚点ID
      const targetItem = items.find(item => 
        item.anchorId === currentHash || item.id === currentHash
      )

      if (targetItem) {
        // 设置聚焦状态
        setFocusedItemId(targetItem.id)

        // 滚动到目标元素
        setTimeout(() => {
          const element = document.getElementById(targetItem.anchorId || targetItem.id)
          if (element) {
            smoothScrollToElement(element, headerHeight + 20)
          }
        }, 200)

        // 3秒后清除聚焦状态
        setTimeout(() => {
          setFocusedItemId(null)
        }, 3000)
      }
    }

    // 监听hash变化
    window.addEventListener('hashchange', handleHashChange)
    
    // 页面加载时检查hash
    handleHashChange()

    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [items, headerHeight])

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
    setIsClosing(true)
    
    // 开始关闭动画
    setTimeout(() => {
      setExpandedItem(null)
      setIsClosing(false)
      
      // 恢复body滚动
      document.body.style.overflow = 'unset'
      
      // 动画完成后重置动画状态
      setTimeout(() => {
        setIsAnimating(false)
      }, 100)
    }, 300) // 关闭动画持续时间
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleCloseExpanded()
    }
  }

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && expandedItem) {
      handleCloseExpanded()
    }
  }, [expandedItem])

  useEffect(() => {
    if (expandedItem) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [expandedItem, handleKeyDown])

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
          const isFocused = focusedItemId === item.id

          return (
            <WaterfallItem
              key={item.id}
              item={item}
              position={position}
              isExpanded={isExpanded}
              onItemClick={handleItemClick}
              index={index}
              isFocused={isFocused}
            />
          )
        })}
      </div>

      {/* 展开的模态框 */}
      {expandedItem && (
        <div 
          className={cn(
            "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-all duration-300",
            isClosing ? "opacity-0" : "opacity-100"
          )}
          onClick={handleBackdropClick}
        >
          <div 
            className={cn(
              "relative max-w-4xl max-h-[90vh] w-full bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300",
              isClosing 
                ? "opacity-0 scale-95 translate-y-4" 
                : "opacity-100 scale-100 translate-y-0"
            )}
          >
            {/* 关闭按钮 */}
            <button
              onClick={handleCloseExpanded}
              className="absolute top-4 right-4 z-10 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110 cursor-pointer"
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

    </>
  )
}