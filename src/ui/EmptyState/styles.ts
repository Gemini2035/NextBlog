import { EmptyStateSize, EmptyStateVariant } from './types'
import { cn } from '@/utils'

/**
 * 获取空状态组件的样式类名
 */
export function getEmptyStateStyles(
  size: EmptyStateSize = 'md',
  variant: EmptyStateVariant = 'default',
  className?: string
): string {
  const baseStyles = 'flex flex-col items-center justify-center text-center'
  
  const sizeStyles = {
    sm: 'py-8 px-4',
    md: 'py-12 px-6',
    lg: 'py-16 px-8'
  }
  
  const variantStyles = {
    default: 'bg-gray-50 rounded-lg',
    minimal: 'bg-transparent',
    card: 'bg-white border border-gray-200 rounded-lg shadow-sm'
  }
  
  return cn(
    baseStyles,
    sizeStyles[size],
    variantStyles[variant],
    className
  )
}

/**
 * 获取图标容器的样式类名
 */
export function getIconContainerStyles(size: EmptyStateSize = 'md'): string {
  const sizeStyles = {
    sm: 'w-12 h-12 mb-3',
    md: 'w-16 h-16 mb-4',
    lg: 'w-20 h-20 mb-6'
  }
  
  return cn(
    'flex items-center justify-center text-gray-400',
    sizeStyles[size]
  )
}

/**
 * 获取标题的样式类名
 */
export function getTitleStyles(size: EmptyStateSize = 'md'): string {
  const sizeStyles = {
    sm: 'text-lg font-semibold',
    md: 'text-xl font-semibold',
    lg: 'text-2xl font-semibold'
  }
  
  return cn(
    'text-gray-900 mb-2',
    sizeStyles[size]
  )
}

/**
 * 获取描述的样式类名
 */
export function getDescriptionStyles(size: EmptyStateSize = 'md'): string {
  const sizeStyles = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  }
  
  return cn(
    'text-gray-600 mb-4 max-w-md',
    sizeStyles[size]
  )
}

/**
 * 获取操作按钮容器的样式类名
 */
export function getActionStyles(): string {
  return 'mt-2'
}
