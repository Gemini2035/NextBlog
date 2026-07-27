'use client'

import { ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Card, Modal } from '@/ui'
import { cn, smoothScrollToElement } from '@/utils'
import { useIntersectionObserver, useIsomorphicLayoutEffect, useLayoutHeights } from '@/hooks'

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
  const t = useTranslations('AboutPage')
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
        isExpanded ? 'z-50' : '',
        // 锚点聚焦样式
        isFocused && 'ring-2 ring-[var(--site-focus-ring)] ring-offset-2',
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
        border="sm" 
        rounded 
        disabledHover
        className={cn(
          'h-full rounded-[var(--site-radius-card)] border border-[var(--site-border)] bg-[var(--site-canvas)] p-6 shadow-none transition-colors duration-200',
          'hover:border-[var(--site-action)]',
          // 锚点聚焦时的卡片样式
          isFocused && 'border-[var(--site-action)]',
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
            'mt-4 pt-4 border-t border-[var(--site-border)] transition-all duration-700 ease-out delay-200',
            shouldAnimate 
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-2'
          )}>
            <div className="flex items-center justify-between text-sm text-[var(--site-text-tertiary)]">
              <span>{t('clickToViewDetails')}</span>
              <div className="w-2 h-2 bg-[var(--site-action)] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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

interface WaterfallPosition {
  top: number
  left: number
  width: number
}

const areNumberArraysEqual = (first: number[], second: number[]) =>
  first.length === second.length && first.every((value, index) => value === second[index])

const arePositionsEqual = (first: WaterfallPosition[], second: WaterfallPosition[]) =>
  first.length === second.length &&
  first.every((position, index) => {
    const nextPosition = second[index]
    return (
      position.top === nextPosition.top &&
      position.left === nextPosition.left &&
      position.width === nextPosition.width
    )
  })

export default function ExpandableWaterfall({ 
  items, 
  columns = 2,
  gap = 24,
  className 
}: ExpandableWaterfallProps) {
  const t = useTranslations('AboutPage')
  const containerRef = useRef<HTMLDivElement>(null)
  const { headerHeight } = useLayoutHeights()
  const [mounted, setMounted] = useState(false)
  const [columnHeights, setColumnHeights] = useState<number[]>([])
  const [itemPositions, setItemPositions] = useState<WaterfallPosition[]>([])
  const [expandedItem, setExpandedItem] = useState<string | null>(null)
  const [focusedItemId, setFocusedItemId] = useState<string | null>(null)

  useIsomorphicLayoutEffect(() => {
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

  useIsomorphicLayoutEffect(() => {
    if (!mounted || !containerRef.current) return

    const calculateLayout = () => {
      if (!containerRef.current) return

      const container = containerRef.current
      const containerWidth = container.offsetWidth
      const actualColumns = window.innerWidth >= 768 ? Math.max(1, columns) : 1
      const itemWidth = Math.floor((containerWidth - (gap * (actualColumns - 1))) / actualColumns)
      
      const newColumnHeights = new Array(actualColumns).fill(0)
      const newItemPositions: WaterfallPosition[] = []

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

      setColumnHeights((currentHeights) =>
        areNumberArraysEqual(currentHeights, newColumnHeights) ? currentHeights : newColumnHeights
      )
      setItemPositions((currentPositions) =>
        arePositionsEqual(currentPositions, newItemPositions) ? currentPositions : newItemPositions
      )
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
  useIsomorphicLayoutEffect(() => {
    if (!mounted || !containerRef.current) return

    const recalculateLayout = () => {
      const container = containerRef.current
      if (!container) return

      const actualColumns = window.innerWidth >= 768 ? Math.max(1, columns) : 1
      const containerWidth = container.offsetWidth
      const itemWidth = Math.floor((containerWidth - (gap * (actualColumns - 1))) / actualColumns)
      
      const newColumnHeights = new Array(actualColumns).fill(0)
      const newItemPositions: WaterfallPosition[] = []
      
      // 获取所有项目元素
      const itemElements = container.querySelectorAll('[data-waterfall-item]')

      if (items.length > 0 && itemElements.length < items.length) {
        return
      }
      
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

      setColumnHeights((currentHeights) =>
        areNumberArraysEqual(currentHeights, newColumnHeights) ? currentHeights : newColumnHeights
      )
      setItemPositions((currentPositions) =>
        arePositionsEqual(currentPositions, newItemPositions) ? currentPositions : newItemPositions
      )
    }

    recalculateLayout()

    const resizeObserver = new ResizeObserver(recalculateLayout)
    resizeObserver.observe(containerRef.current)
    containerRef.current.querySelectorAll('[data-waterfall-item]').forEach((element) => {
      resizeObserver.observe(element)
    })

    return () => resizeObserver.disconnect()
  }, [mounted, items, columns, gap, itemPositions.length])


  const handleItemClick = (itemId: string) => {
    setExpandedItem(itemId)
  }

  const handleCloseExpanded = useCallback(() => {
    setExpandedItem(null)
  }, [])

  const expandedWaterfallItem = items.find(item => item.id === expandedItem)

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

  if (itemPositions.length === 0) {
    return (
      <>
        <div className={cn('relative', className)} ref={containerRef}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="group cursor-pointer"
                onClick={() => handleItemClick(item.id)}
              >
                <Card 
                  border="sm" 
                  rounded 
                  disabledHover
                  className={cn(
                    'h-full rounded-[var(--site-radius-card)] border border-[var(--site-border)] bg-[var(--site-canvas)] p-6 shadow-none transition-colors duration-200',
                    'hover:border-[var(--site-action)]',
                    item.cardClassName
                  )}
                >
                  {item.content}
                  {item.expandedContent && (
                    <div className="mt-4 border-t border-[var(--site-border)] pt-4">
                      <div className="flex items-center justify-between text-sm text-[var(--site-text-tertiary)]">
                        <span>{t('clickToViewDetails')}</span>
                        <div className="w-2 h-2 rounded-full bg-[var(--site-action)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                      </div>
                    </div>
                  )}
                </Card>
              </div>
            ))}
          </div>
        </div>

        <Modal
          open={Boolean(expandedItem)}
          onClose={handleCloseExpanded}
          size="xl"
          classNames={{
            mask: 'bg-black/30 backdrop-blur-sm',
            content: 'max-w-4xl max-h-[90vh] rounded-[var(--site-radius-card)] border border-[var(--site-border)] bg-[var(--site-canvas)] shadow-none',
            header: 'hidden',
            body: 'max-h-[90vh] overflow-y-auto p-0',
            closeButton: 'top-4 right-4 z-40 rounded-[var(--site-radius-control)] border border-[var(--site-border)] bg-[var(--site-canvas)] text-[var(--site-text-muted)] shadow-sm hover:bg-[var(--site-canvas-muted)] cursor-pointer',
          }}
        >
          <div className="px-4 pt-0 pb-6 [--about-detail-category-top:0px] sm:px-8 sm:pb-8">
            {expandedWaterfallItem?.expandedContent || expandedWaterfallItem?.content}
          </div>
        </Modal>
      </>
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

      <Modal
        open={Boolean(expandedItem)}
        onClose={handleCloseExpanded}
        size="xl"
        classNames={{
          mask: 'bg-black/30 backdrop-blur-sm',
          content: 'max-w-4xl max-h-[90vh] rounded-[var(--site-radius-card)] border border-[var(--site-border)] bg-[var(--site-canvas)] shadow-none',
          header: 'hidden',
          body: 'max-h-[90vh] overflow-y-auto p-0',
          closeButton: 'top-4 right-4 z-40 rounded-[var(--site-radius-control)] border border-[var(--site-border)] bg-[var(--site-canvas)] text-[var(--site-text-muted)] shadow-sm hover:bg-[var(--site-canvas-muted)] cursor-pointer',
        }}
      >
        <div className="px-4 pt-0 pb-6 [--about-detail-category-top:0px] sm:px-8 sm:pb-8">
          {expandedWaterfallItem?.expandedContent || expandedWaterfallItem?.content}
        </div>
      </Modal>

    </>
  )
}
