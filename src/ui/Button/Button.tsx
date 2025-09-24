import { forwardRef } from 'react'
import { ButtonProps, ButtonRef } from './types'
import { getButtonStyles } from './styles'
import { cn } from '@/utils'

/**
 * 加载图标组件
 */
const LoadingIcon = ({ size = 'sm' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  }

  return (
    <svg
      className={`animate-spin ${sizeClasses[size]}`}
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
}

/**
 * Button组件
 * 一个高度可定制的按钮组件，支持多种变体、尺寸和状态
 * 
 * @example
 * ```tsx
 * // 基础用法
 * <Button>点击我</Button>
 * 
 * // 不同变体
 * <Button variant="primary">主要按钮</Button>
 * <Button variant="secondary">次要按钮</Button>
 * <Button variant="outline">轮廓按钮</Button>
 * 
 * // 不同尺寸
 * <Button size="sm">小按钮</Button>
 * <Button size="lg">大按钮</Button>
 * 
 * // 加载状态
 * <Button loading loadingText="加载中...">提交</Button>
 * 
 * // 带图标
 * <Button leftIcon={<Icon />}>带图标</Button>
 * ```
 */
export const Button = forwardRef<ButtonRef, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      shape = 'default',
      state = 'default',
      fullWidth = false,
      loading = false,
      loadingText,
      leftIcon,
      rightIcon,
      className,
      children,
      disabled,
      type = 'button',
      onClick,
      ...props
    },
    ref
  ) => {
    // 计算最终状态
    const isDisabled = disabled || loading
    const finalState = loading ? 'loading' : state

    // 获取样式类名
    const buttonStyles = getButtonStyles(
      variant,
      size,
      shape,
      finalState,
      fullWidth,
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

    // 渲染内容
    const renderContent = () => {
      if (loading) {
        return (
          <>
            <LoadingIcon size={size === 'xs' ? 'sm' : size === 'xl' ? 'lg' : 'md'} />
            {loadingText || children}
          </>
        )
      }

      return (
        <>
          {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
        </>
      )
    }

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        onClick={handleClick}
        className={cn(buttonStyles)}
        {...props}
      >
        {renderContent()}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
