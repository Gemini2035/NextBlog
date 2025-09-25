import { forwardRef, useImperativeHandle, useRef, useState, useEffect, useCallback } from 'react'
import { SliderProps, SliderRef } from './types'
import { 
  getSliderStyles, 
  getSliderTrackStyles, 
  getSliderItemStyles,
  getNavigationButtonStyles,
  getIndicatorStyles,
  getIndicatorContainerStyles
} from './styles'
import { cn } from '@/utils'

/**
 * 左箭头图标
 */
const ChevronLeftIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 19l-7-7 7-7"
    />
  </svg>
)

/**
 * 右箭头图标
 */
const ChevronRightIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5l7 7-7 7"
    />
  </svg>
)

/**
 * Slider组件 - 轮播组件
 * 支持自定义每页显示数量、滑动步长、左侧间距等功能
 * 
 * @example
 * ```tsx
 * // 基础用法
 * <Slider
 *   items={[<div>Item 1</div>, <div>Item 2</div>]}
 *   itemsPerPage={2}
 *   slidePerPage={1}
 * />
 * 
 * // 带导航和指示器
 * <Slider
 *   items={items}
 *   itemsPerPage={3}
 *   slidePerPage={2}
 *   paddingLeft={20}
 *   showNavigation
 *   showIndicators
 * />
 * 
 * // 自动播放
 * <Slider
 *   items={items}
 *   itemsPerPage={2}
 *   slidePerPage={1}
 *   autoPlay
 *   autoPlayInterval={3000}
 *   loop
 * />
 * ```
 */
export const Slider = forwardRef<SliderRef, SliderProps>(
  (
    {
      items,
      itemsPerPage,
      slidePerPage,
      paddingLeft = 0,
      showNavigation = true,
      showIndicators = false,
      autoPlay = false,
      autoPlayInterval = 3000,
      loop = true,
      className,
      style,
      onSlideChange,
      ...props
    },
    ref
  ) => {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isTransitioning, setIsTransitioning] = useState(false)
    const autoPlayRef = useRef<NodeJS.Timeout | null>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    // 计算总页数
    const totalPages = Math.ceil(items.length / slidePerPage)
    const maxIndex = Math.max(0, totalPages - 1)

    // 计算当前应该显示的items
    const getVisibleItems = useCallback(() => {
      const startIndex = currentIndex * slidePerPage
      const endIndex = Math.min(startIndex + itemsPerPage, items.length)
      return items.slice(startIndex, endIndex)
    }, [currentIndex, slidePerPage, itemsPerPage, items])

    // 滑动到指定索引
    const slideTo = useCallback((index: number) => {
      if (isTransitioning) return
      
      const targetIndex = Math.max(0, Math.min(index, maxIndex))
      if (targetIndex === currentIndex) return

      setIsTransitioning(true)
      setCurrentIndex(targetIndex)
      onSlideChange?.(targetIndex)
      
      setTimeout(() => {
        setIsTransitioning(false)
      }, 300)
    }, [currentIndex, maxIndex, isTransitioning, onSlideChange])

    // 滑动到下一页
    const slideNext = useCallback(() => {
      if (currentIndex < maxIndex) {
        slideTo(currentIndex + 1)
      } else if (loop) {
        slideTo(0)
      }
    }, [currentIndex, maxIndex, loop, slideTo])

    // 滑动到上一页
    const slidePrev = useCallback(() => {
      if (currentIndex > 0) {
        slideTo(currentIndex - 1)
      } else if (loop) {
        slideTo(maxIndex)
      }
    }, [currentIndex, loop, maxIndex, slideTo])

    // 获取当前索引
    const getCurrentIndex = useCallback(() => currentIndex, [currentIndex])

    // 获取总页数
    const getTotalPages = useCallback(() => totalPages, [totalPages])

    // 暴露给父组件的方法
    useImperativeHandle(ref, () => ({
      slideTo,
      slideNext,
      slidePrev,
      getCurrentIndex,
      getTotalPages
    }), [slideTo, slideNext, slidePrev, getCurrentIndex, getTotalPages])

    // 自动播放逻辑
    useEffect(() => {
      if (autoPlay && totalPages > 1) {
        autoPlayRef.current = setInterval(() => {
          slideNext()
        }, autoPlayInterval)

        return () => {
          if (autoPlayRef.current) {
            clearInterval(autoPlayRef.current)
          }
        }
      }
    }, [autoPlay, autoPlayInterval, slideNext, totalPages])

    // 计算滑动容器的transform
    const getTransform = () => {
      const itemWidth = 100 / itemsPerPage // 每个item占的百分比宽度
      const translateX = -(currentIndex * slidePerPage * itemWidth)
      return `translateX(${translateX}%)`
    }

    // 计算滑动容器的样式
    const trackStyle: React.CSSProperties = {
      transform: getTransform(),
      paddingLeft: `${paddingLeft}px`,
      ...style
    }

    // 计算每个item的宽度
    const itemStyle: React.CSSProperties = {
      width: `${100 / itemsPerPage}%`,
      flexShrink: 0
    }

    // 处理导航按钮点击
    const handleNavigationClick = (direction: 'left' | 'right') => {
      if (direction === 'left') {
        slidePrev()
      } else {
        slideNext()
      }
    }

    // 处理指示器点击
    const handleIndicatorClick = (index: number) => {
      slideTo(index)
    }

    // 检查是否可以滑动
    const canSlidePrev = loop || currentIndex > 0
    const canSlideNext = loop || currentIndex < maxIndex

    return (
      <div
        ref={containerRef}
        className={getSliderStyles(className)}
        {...props}
      >
        {/* 滑动容器 */}
        <div
          className={getSliderTrackStyles(paddingLeft)}
          style={trackStyle}
        >
          {items.map((item, index) => (
            <div
              key={index}
              className={getSliderItemStyles(itemsPerPage)}
              style={itemStyle}
            >
              {item}
            </div>
          ))}
        </div>

        {/* 导航按钮 */}
        {showNavigation && totalPages > 1 && (
          <>
            <button
              type="button"
              className={getNavigationButtonStyles('left', 'default', !canSlidePrev)}
              onClick={() => handleNavigationClick('left')}
              disabled={!canSlidePrev}
              aria-label="上一页"
            >
              <ChevronLeftIcon />
            </button>
            <button
              type="button"
              className={getNavigationButtonStyles('right', 'default', !canSlideNext)}
              onClick={() => handleNavigationClick('right')}
              disabled={!canSlideNext}
              aria-label="下一页"
            >
              <ChevronRightIcon />
            </button>
          </>
        )}

        {/* 指示器 */}
        {showIndicators && totalPages > 1 && (
          <div className={getIndicatorContainerStyles()}>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                type="button"
                className={getIndicatorStyles('dot', index === currentIndex)}
                onClick={() => handleIndicatorClick(index)}
                aria-label={`跳转到第${index + 1}页`}
              />
            ))}
          </div>
        )}
      </div>
    )
  }
)

Slider.displayName = 'Slider'

export default Slider
