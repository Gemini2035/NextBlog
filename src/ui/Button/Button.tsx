import { forwardRef } from 'react'
import { ButtonProps, ButtonRef } from './types'
import { getButtonStyles } from './styles'
import { cn } from '@/utils'
import { LoadingIcon } from '../icons'

/**
 * Button组件 - 简化版
 * 仅保留基本功能：变体、尺寸、加载状态、禁用状态
 * 
 * @example
 * ```tsx
 * // 基础用法
 * <Button>点击我</Button>
 * 
 * // 不同变体
 * <Button type="primary">主要按钮</Button>
 * <Button type="secondary">次要按钮</Button>
 * <Button type="outline">轮廓按钮</Button>
 * <Button type="ghost">幽灵按钮</Button>
 * <Button type="text">文本按钮</Button>
 * <Button type="danger">危险按钮</Button>
 * 
 * // 不同尺寸
 * <Button size="xs">超小按钮</Button>
 * <Button size="sm">小按钮</Button>
 * <Button size="md">中等按钮</Button>
 * <Button size="lg">大按钮</Button>
 * <Button size="xl">超大按钮</Button>
 * 
 * // 圆角设置
 * <Button rounded={false}>方框按钮</Button>
 * <Button rounded={true}>圆角按钮</Button>
 * 
 * // 加载状态
 * <Button loading>加载中</Button>
 * ```
 */
export const Button = forwardRef<ButtonRef, ButtonProps>(
  (
    {
      type = 'primary',
      size = 'md',
      rounded = false,
      disabled = false,
      loading = false,
      className,
      children,
      htmlType = 'button',
      onClick,
      ...props
    },
    ref
  ) => {
    // 计算最终状态
    const isDisabled = disabled || loading

    // 获取样式类名
    const buttonStyles = getButtonStyles(
      type,
      size,
      rounded,
      isDisabled,
      loading,
      className
    )

    // 处理点击事件
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (isDisabled) {
        event.preventDefault()
        return
      }
      onClick?.(event)
    }

    return (
      <button
        ref={ref}
        type={htmlType}
        disabled={isDisabled}
        onClick={handleClick}
        className={cn(buttonStyles)}
        {...props}
      >
        {loading && <LoadingIcon className="animate-spin w-4 h-4 mr-2" />}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button