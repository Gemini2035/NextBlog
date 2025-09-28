import React, { 
  useState, 
  useEffect, 
  useRef, 
  useCallback, 
  useMemo,
  forwardRef,
  isValidElement
} from 'react'
import { createPortal } from 'react-dom'
import { TooltipProps, TooltipRef } from './types'
import { getTooltipStyles, getArrowStyles } from './styles'
import { cn } from '@/utils'

/**
 * 计算Tooltip位置
 */
const calculatePosition = (
  triggerElement: HTMLElement,
  tooltipElement: HTMLElement,
  placement: string,
  offset: [number, number] = [0, 0],
  container?: HTMLElement
) => {
  const triggerRect = triggerElement.getBoundingClientRect()
  const tooltipRect = tooltipElement.getBoundingClientRect()
  
  // 获取容器的滚动位置
  let scrollTop = window.pageYOffset || document.documentElement.scrollTop
  let scrollLeft = window.pageXOffset || document.documentElement.scrollLeft
  
  // 如果指定了容器，使用容器的滚动位置
  if (container && container !== document.body) {
    const containerRect = container.getBoundingClientRect()
    scrollTop = container.scrollTop + containerRect.top
    scrollLeft = container.scrollLeft + containerRect.left
  }
  
  let top = 0
  let left = 0
  
  switch (placement) {
    case 'top':
    case 'topLeft':
    case 'topRight':
      top = triggerRect.top + scrollTop - tooltipRect.height - 8 + offset[1]
      left = triggerRect.left + scrollLeft + triggerRect.width / 2 - tooltipRect.width / 2 + offset[0]
      if (placement === 'topLeft') left = triggerRect.left + scrollLeft + offset[0]
      if (placement === 'topRight') left = triggerRect.right + scrollLeft - tooltipRect.width + offset[0]
      break
    case 'bottom':
    case 'bottomLeft':
    case 'bottomRight':
      top = triggerRect.bottom + scrollTop + 8 + offset[1]
      left = triggerRect.left + scrollLeft + triggerRect.width / 2 - tooltipRect.width / 2 + offset[0]
      if (placement === 'bottomLeft') left = triggerRect.left + scrollLeft + offset[0]
      if (placement === 'bottomRight') left = triggerRect.right + scrollLeft - tooltipRect.width + offset[0]
      break
    case 'left':
    case 'leftTop':
    case 'leftBottom':
      top = triggerRect.top + scrollTop + triggerRect.height / 2 - tooltipRect.height / 2 + offset[1]
      left = triggerRect.left + scrollLeft - tooltipRect.width - 8 + offset[0]
      if (placement === 'leftTop') top = triggerRect.top + scrollTop + offset[1]
      if (placement === 'leftBottom') top = triggerRect.bottom + scrollTop - tooltipRect.height + offset[1]
      break
    case 'right':
    case 'rightTop':
    case 'rightBottom':
      top = triggerRect.top + scrollTop + triggerRect.height / 2 - tooltipRect.height / 2 + offset[1]
      left = triggerRect.right + scrollLeft + 8 + offset[0]
      if (placement === 'rightTop') top = triggerRect.top + scrollTop + offset[1]
      if (placement === 'rightBottom') top = triggerRect.bottom + scrollTop - tooltipRect.height + offset[1]
      break
  }
  
  return { top, left }
}

/**
 * 检查是否需要调整位置以避免超出视口
 */
const adjustPositionForViewport = (
  position: { top: number; left: number },
  tooltipRect: DOMRect,
  placement: string,
  container?: HTMLElement
) => {
  let viewportWidth = window.innerWidth
  let viewportHeight = window.innerHeight
  let scrollTop = window.pageYOffset || document.documentElement.scrollTop
  let scrollLeft = window.pageXOffset || document.documentElement.scrollLeft
  
  // 如果指定了容器，使用容器的视口
  if (container && container !== document.body) {
    const containerRect = container.getBoundingClientRect()
    viewportWidth = containerRect.width
    viewportHeight = containerRect.height
    scrollTop = container.scrollTop
    scrollLeft = container.scrollLeft
  }
  
  let { top, left } = position
  
  // 水平方向调整
  if (left < scrollLeft) {
    left = scrollLeft + 8
  } else if (left + tooltipRect.width > scrollLeft + viewportWidth) {
    left = scrollLeft + viewportWidth - tooltipRect.width - 8
  }
  
  // 垂直方向调整
  if (top < scrollTop) {
    top = scrollTop + 8
  } else if (top + tooltipRect.height > scrollTop + viewportHeight) {
    top = scrollTop + viewportHeight - tooltipRect.height - 8
  }
  
  return { top, left }
}

/**
 * Tooltip组件 - 参照Ant Design实现
 * 
 * @example
 * ```tsx
 * // 基础用法
 * <Tooltip title="这是一个提示">
 *   <Button>悬停我</Button>
 * </Tooltip>
 * 
 * // 不同位置
 * <Tooltip title="上方提示" placement="top">
 *   <Button>上方</Button>
 * </Tooltip>
 * 
 * // 不同主题
 * <Tooltip title="深色主题" theme="dark">
 *   <Button>深色</Button>
 * </Tooltip>
 * 
 * // 点击触发
 * <Tooltip title="点击显示" trigger="click">
 *   <Button>点击我</Button>
 * </Tooltip>
 * ```
 */
export const Tooltip = forwardRef<TooltipRef, TooltipProps>(
  (
    {
      title,
      trigger = 'hover',
      placement = 'top',
      theme = 'light',
      arrow = true,
      disabled = false,
      delay = 0,
      hideDelay = 0,
      interactive = false,
      className,
      style,
      children,
      defaultVisible = false,
      visible: controlledVisible,
      onVisibleChange,
      offset = [0, 0],
      followCursor = false,
      maxWidth,
      minWidth,
      getRenderContainer,
      ...props
    },
    ref
  ) => {
    const [internalVisible, setInternalVisible] = useState(defaultVisible)
    const [position, setPosition] = useState({ top: 0, left: 0 })
    
    const triggerRef = useRef<HTMLElement>(null)
    const tooltipRef = useRef<HTMLDivElement>(null)
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)
    const mousePositionRef = useRef({ x: 0, y: 0 })
    
    // 使用受控或非受控状态
    const isVisible = controlledVisible !== undefined ? controlledVisible : internalVisible
    
    // 获取渲染容器
    const getContainer = useCallback(() => {
      if (getRenderContainer) {
        return getRenderContainer()
      }
      return document.body
    }, [getRenderContainer])
    
    // 处理显示状态变化
    const handleVisibleChange = useCallback((newVisible: boolean) => {
      if (controlledVisible === undefined) {
        setInternalVisible(newVisible)
      }
      onVisibleChange?.(newVisible)
    }, [controlledVisible, onVisibleChange])
    
    // 显示Tooltip
    const showTooltip = useCallback(() => {
      if (disabled || !title) return
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      
      if (delay > 0) {
        timeoutRef.current = setTimeout(() => {
          handleVisibleChange(true)
        }, delay)
      } else {
        handleVisibleChange(true)
      }
    }, [disabled, title, delay, handleVisibleChange])
    
    // 隐藏Tooltip
    const hideTooltip = useCallback(() => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      
      if (hideDelay > 0) {
        timeoutRef.current = setTimeout(() => {
          handleVisibleChange(false)
        }, hideDelay)
      } else {
        handleVisibleChange(false)
      }
    }, [hideDelay, handleVisibleChange])
    
    // 更新位置
    const updatePosition = useCallback(() => {
      if (!triggerRef.current || !tooltipRef.current || !isVisible) return
      
      const triggerElement = triggerRef.current
      const tooltipElement = tooltipRef.current
      const container = getContainer()
      
      let newPosition
      if (followCursor) {
        newPosition = {
          top: mousePositionRef.current.y + 8,
          left: mousePositionRef.current.x + 8
        }
      } else {
        newPosition = calculatePosition(triggerElement, tooltipElement, placement, offset, container)
      }
      
      // 调整位置以避免超出视口
      const adjustedPosition = adjustPositionForViewport(
        newPosition,
        tooltipElement.getBoundingClientRect(),
        placement,
        container
      )
      
      setPosition(adjustedPosition)
    }, [isVisible, placement, offset, followCursor, getContainer])
    
    // 处理鼠标移动
    const handleMouseMove = useCallback((e: MouseEvent) => {
      mousePositionRef.current = { x: e.clientX, y: e.clientY }
    }, [])
    
    // 处理触发事件
    const handleTriggerEvents = useCallback(() => {
      const triggerElement = triggerRef.current
      if (!triggerElement) return
      
      const eventHandlers: Record<string, (e: Event) => void> = {}
      
      if (trigger === 'hover' || trigger === 'focus') {
        eventHandlers.mouseenter = showTooltip
        eventHandlers.mouseleave = hideTooltip
        eventHandlers.focus = showTooltip
        eventHandlers.blur = hideTooltip
      }
      
      if (trigger === 'click') {
        eventHandlers.click = (e) => {
          e.preventDefault()
          e.stopPropagation()
          if (isVisible) {
            hideTooltip()
          } else {
            showTooltip()
          }
        }
      }
      
      if (trigger === 'contextMenu') {
        eventHandlers.contextmenu = (e) => {
          e.preventDefault()
          showTooltip()
        }
      }
      
      // 添加事件监听器
      Object.entries(eventHandlers).forEach(([event, handler]) => {
        triggerElement.addEventListener(event, handler)
      })
      
      // 清理函数
      return () => {
        Object.entries(eventHandlers).forEach(([event, handler]) => {
          triggerElement.removeEventListener(event, handler)
        })
      }
    }, [trigger, showTooltip, hideTooltip, isVisible])
    
    // 处理点击外部关闭
    const handleClickOutside = useCallback((e: MouseEvent) => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        hideTooltip()
      }
    }, [hideTooltip])
    
    // 效果钩子
    useEffect(() => {
      if (isVisible) {
        updatePosition()
        if (followCursor) {
          document.addEventListener('mousemove', handleMouseMove)
        }
        if (trigger === 'click') {
          document.addEventListener('click', handleClickOutside)
        }
      }
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('click', handleClickOutside)
      }
    }, [isVisible, followCursor, trigger, updatePosition, handleMouseMove, handleClickOutside])
    
    useEffect(() => {
      const cleanup = handleTriggerEvents()
      return cleanup
    }, [handleTriggerEvents])
    
    useEffect(() => {
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
      }
    }, [])
    
    // 计算样式
    const tooltipStyles = useMemo(() => {
      return getTooltipStyles(
        placement,
        theme,
        'fade',
        isVisible,
        interactive,
        className
      )
    }, [placement, theme, isVisible, interactive, className])
    
    const arrowStyles = useMemo(() => {
      return getArrowStyles(placement, theme)
    }, [placement, theme])
    
    // 渲染触发器
    const renderTrigger = () => {
      if (!isValidElement(children)) {
        return children
      }
      
      // 使用更简单的方式处理ref转发
      const childRef = (node: HTMLElement) => {
        triggerRef.current = node
        // 处理原始ref - 使用类型断言避免类型检查问题
        const originalRef = (children as React.ReactElement & { ref?: React.Ref<HTMLElement> }).ref
        if (originalRef) {
          if (typeof originalRef === 'function') {
            originalRef(node)
          } else if (originalRef && typeof originalRef === 'object' && 'current' in originalRef) {
            (originalRef as React.MutableRefObject<HTMLElement>).current = node
          }
        }
      }
      
      // 使用类型断言来避免cloneElement的类型检查问题
      return React.cloneElement(children, {
        ref: childRef
      } as React.Attributes)
    }
    
    // 如果没有title或disabled，直接返回children
    if (!title || disabled) {
      return <>{children}</>
    }
    
    return (
      <>
        {renderTrigger()}
        {isVisible && createPortal(
          <div
            ref={(node) => {
              tooltipRef.current = node
              if (typeof ref === 'function') {
                ref(node)
              } else if (ref) {
                ref.current = node
              }
            }}
            className={cn(tooltipStyles)}
            style={{
              position: 'absolute',
              top: position.top,
              left: position.left,
              maxWidth,
              minWidth,
              ...style
            }}
            {...props}
          >
            {title}
            {arrow && (
              <div className={cn(arrowStyles)} />
            )}
          </div>,
          getContainer()
        )}
      </>
    )
  }
)

Tooltip.displayName = 'Tooltip'

export default Tooltip
