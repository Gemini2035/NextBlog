import { forwardRef, ReactNode } from 'react'
import { TimelineItemProps, TimelineItemRef, TimelineMode, TimelineSize, TimelineColor, TimelineStatus } from './types'
import { getTimelineItemStyles, getTimelineDotStyles, getTimelineContentStyles, getTimelineLabelStyles } from './styles'
import { cn } from '@/utils'

/**
 * TimelineItem 组件的扩展属性
 */
interface ExtendedTimelineItemProps extends TimelineItemProps {
  mode?: TimelineMode
  size?: TimelineSize
  isLast?: boolean
}

/**
 * TimelineItem 组件 - 时间轴项目
 * 用于展示单个时间轴项目，支持自定义样式和状态
 * 
 * @example
 * ```tsx
 * // 基础用法
 * <TimelineItem label="2023-01-01">
 *   <h3>项目开始</h3>
 *   <p>开始开发新项目</p>
 * </TimelineItem>
 * 
 * // 自定义状态和颜色
 * <TimelineItem 
 *   label="2023-02-01" 
 *   color="green" 
 *   status="finish"
 * >
 *   <h3>项目完成</h3>
 *   <p>项目开发完成</p>
 * </TimelineItem>
 * 
 * // 自定义时间轴点
 * <TimelineItem 
 *   label="2023-03-01"
 *   dot={<CustomIcon />}
 * >
 *   <h3>特殊节点</h3>
 *   <p>这是一个特殊的里程碑</p>
 * </TimelineItem>
 * ```
 */
export const TimelineItem = forwardRef<TimelineItemRef, ExtendedTimelineItemProps>(
  (
    {
      label,
      color = 'blue',
      status = 'process',
      dot,
      showLine = true,
      lineColor,
      mode = 'left',
      size = 'md',
      isLast = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    // 获取样式类名
    const itemStyles = getTimelineItemStyles(mode, size, status, color, showLine, className)
    const dotStyles = getTimelineDotStyles(size, color, status)
    const contentStyles = getTimelineContentStyles(mode, size)
    const labelStyles = getTimelineLabelStyles(mode, size)

    // 渲染时间轴点
    const renderDot = (): ReactNode => {
      if (dot) {
        return (
          <div className={cn('flex-shrink-0', dotStyles)}>
            {dot}
          </div>
        )
      }

      // 根据状态渲染不同的点
      const getDotContent = (): ReactNode => {
        switch (status) {
          case 'finish':
            return '✓'
          case 'error':
            return '✕'
          case 'process':
            return '●'
          default:
            return '○'
        }
      }

      return (
        <div className={cn(dotStyles)}>
          {getDotContent()}
        </div>
      )
    }

    // 渲染连接线
    const renderLine = (): ReactNode => {
      if (!showLine || isLast) return null

      const lineColorClass = lineColor 
        ? `bg-[${lineColor}]` 
        : color === 'blue' ? 'bg-blue-300' 
        : color === 'green' ? 'bg-green-300'
        : color === 'red' ? 'bg-red-300'
        : color === 'orange' ? 'bg-orange-300'
        : color === 'purple' ? 'bg-purple-300'
        : 'bg-gray-300'

      return (
        <div 
          className={cn(
            'absolute left-6 top-0 bottom-0 w-0.5 rounded-full',
            lineColorClass
          )}
          style={lineColor ? { backgroundColor: lineColor } : undefined}
        />
      )
    }

    return (
      <div
        ref={ref}
        className={cn(itemStyles)}
        {...props}
      >
        {/* 连接线 */}
        {renderLine()}
        
        {/* 时间轴点 */}
        {renderDot()}
        
        {/* 内容区域 */}
        <div className="flex-1">
          {/* 标签 */}
          {label && (
            <div className={cn(labelStyles)}>
              {label}
            </div>
          )}
          
          {/* 内容 */}
          <div className={cn(contentStyles)}>
            {children}
          </div>
        </div>
      </div>
    )
  }
)

TimelineItem.displayName = 'TimelineItem'

export default TimelineItem
