import { forwardRef } from 'react'
import { DividerProps, DividerRef } from './types'
import { getDividerStyles } from './styles'
import { cn } from '@/utils'

/**
 * Divider组件 - 分割线组件
 * 支持方向、粗细、圆角、颜色、虚线等配置
 * 
 * @example
 * ```tsx
 * // 基础用法
 * <Divider />
 * 
 * // 不同方向
 * <Divider orientation="horizontal" />
 * <Divider orientation="vertical" />
 * 
 * // 不同粗细
 * <Divider thickness="thin" />
 * <Divider thickness="medium" />
 * <Divider thickness="thick" />
 * <Divider thickness="extra-thick" />
 * 
 * // 圆角设置
 * <Divider rounded={false} />
 * <Divider rounded={true} />
 * 
 * // 自定义颜色
 * <Divider color="#ff0000" />
 * <Divider color="bg-blue-500" />
 * 
 * // 虚线样式
 * <Divider dashed />
 * 
 * // 自定义长度（仅水平分割线）
 * <Divider length={50} />
 * 
 * // 组合使用
 * <Divider 
 *   orientation="horizontal"
 *   thickness="thick"
 *   rounded={true}
 *   color="#3b82f6"
 *   dashed
 *   length={80}
 * />
 * ```
 */
export const Divider = forwardRef<DividerRef, DividerProps>(
  (
    {
      orientation = 'horizontal',
      thickness = 'medium',
      rounded = false,
      color,
      dashed = false,
      length,
      className,
      ...props
    },
    ref
  ) => {
    // 获取样式类名
    const dividerStyles = getDividerStyles(
      orientation,
      thickness,
      rounded ?? false,
      color,
      dashed,
      length,
      className
    )

    return (
      <div
        ref={ref}
        className={cn(dividerStyles)}
        {...props}
      />
    )
  }
)

Divider.displayName = 'Divider'

export default Divider
