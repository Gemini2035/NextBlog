import { forwardRef } from 'react'
import { ButtonProps, ButtonRef } from './types'
import { getButtonStyles } from './styles'
import { cn } from '@/utils'

/**
 * 加载图标组件
 */
const LoadingIcon = () => (
  <svg
    className="animate-spin w-4 h-4 mr-2"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
)

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
 * <Button type="link">链接按钮</Button>
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
        {loading && <LoadingIcon />}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button