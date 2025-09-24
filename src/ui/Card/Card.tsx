import { forwardRef } from 'react'
import { CardProps, CardRef } from './types'
import { getCardStyles } from './styles'
import { cn } from '@/utils'

/**
 * Card组件 - 卡片容器组件
 * 支持直角和圆角两种样式，以及自定义阴影和边框
 * 
 * @example
 * ```tsx
 * // 基础用法 - 直角卡片
 * <Card>这是卡片内容</Card>
 * 
 * // 圆角卡片
 * <Card rounded>这是圆角卡片</Card>
 * 
 * // 带阴影的卡片
 * <Card shadow="md">带中等阴影的卡片</Card>
 * 
 * // 带边框的卡片
 * <Card border="sm">带细边框的卡片</Card>
 * 
 * // 组合使用
 * <Card shadow="lg" border="sm" rounded>圆角阴影边框卡片</Card>
 * ```
 */
export const Card = forwardRef<CardRef, CardProps>(
  (
    {
      shadow = 'md',
      border = 'sm',
      rounded = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    // 获取样式类名
    const cardStyles = getCardStyles(shadow, border, rounded, className)

    return (
      <div
        ref={ref}
        className={cn(cardStyles)}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

export default Card
