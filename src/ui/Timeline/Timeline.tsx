import { forwardRef, ReactElement, cloneElement, Children } from 'react'
import type { TimelineProps, TimelineRef } from './types'
import { getTimelineStyles } from './styles'
import { cn } from '@/utils'

/**
 * Timeline 组件 - 参考 Ant Design 设计
 * 用于展示时间轴信息，支持多种模式和样式
 * 
 * @example
 * ```tsx
 * // 基础用法
 * <Timeline>
 *   <TimelineItem label="2023-01-01">开始开发</TimelineItem>
 *   <TimelineItem label="2023-02-01">功能完善</TimelineItem>
 *   <TimelineItem label="2023-03-01">项目上线</TimelineItem>
 * </Timeline>
 * 
 * // 交替模式
 * <Timeline mode="alternate">
 *   <TimelineItem label="2023-01-01">开始开发</TimelineItem>
 *   <TimelineItem label="2023-02-01">功能完善</TimelineItem>
 * </Timeline>
 * 
 * // 自定义样式
 * <Timeline size="lg" showLine={false}>
 *   <TimelineItem color="green" status="finish">已完成</TimelineItem>
 *   <TimelineItem color="blue" status="process">进行中</TimelineItem>
 * </Timeline>
 * ```
 */
export const Timeline = forwardRef<TimelineRef, TimelineProps>(
  (
    {
      mode = 'left',
      size = 'md',
      showLine = true,
      lineColor,
      className,
      children,
      ...props
    },
    ref
  ) => {
    // 处理子组件，传递必要的 props
    const processedChildren = Children.map(children, (child, index) => {
      if (child && typeof child === 'object' && 'type' in child) {
        const element = child as ReactElement<{
          mode?: string
          size?: string
          showLine?: boolean
          lineColor?: string
          isLast?: boolean
        }>
        return cloneElement(element, {
          key: element.key || index,
          mode,
          size,
          showLine,
          lineColor,
          isLast: index === Children.count(children) - 1
        })
      }
      return child
    })

    // 获取样式类名
    const timelineStyles = getTimelineStyles(mode, size, showLine, className)

    return (
      <div
        ref={ref}
        className={cn(timelineStyles)}
        style={lineColor ? { '--timeline-line-color': lineColor } as React.CSSProperties : undefined}
        {...props}
      >
        {processedChildren}
      </div>
    )
  }
)

Timeline.displayName = 'Timeline'

export default Timeline
