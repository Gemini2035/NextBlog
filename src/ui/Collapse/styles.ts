import { CollapseSize, CollapseVariant } from './types'

/**
 * 获取 Collapse 组件的尺寸样式
 */
export const getCollapseSizeStyles = (size: CollapseSize): string => {
  const sizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  }
  return sizes[size] || sizes.md
}

/**
 * 获取 Collapse 组件的变体样式
 */
export const getCollapseVariantStyles = (variant: CollapseVariant, bordered: boolean, ghost: boolean): string => {
  if (ghost) {
    return 'bg-transparent'
  }
  
  if (bordered || variant === 'bordered') {
    return 'border border-gray-200 rounded-lg overflow-hidden'
  }
  
  return 'bg-white rounded-lg'
}

/**
 * 获取 Collapse 组件的基础样式
 */
export const getCollapseStyles = (
  size: CollapseSize = 'md',
  variant: CollapseVariant = 'default',
  bordered: boolean = false,
  ghost: boolean = false,
  customClassName?: string
): string => {
  const baseStyles = 'w-full'
  const sizeStyles = getCollapseSizeStyles(size)
  const variantStyles = getCollapseVariantStyles(variant, bordered, ghost)
  
  return [
    baseStyles,
    sizeStyles,
    variantStyles,
    customClassName,
  ]
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * 获取 Collapse.Panel 的样式
 */
export const getPanelStyles = (customClassName?: string): string => {
  const baseStyles = 'border-b border-gray-200 last:border-b-0'
  
  return [
    baseStyles,
    customClassName,
  ]
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * 获取 Panel 头部的样式
 */
export const getPanelHeaderStyles = (
  disabled: boolean = false,
  customClassName?: string
): string => {
  const baseStyles = 'flex items-center justify-between w-full px-4 py-3 text-left font-medium transition-colors duration-200 cursor-pointer hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset'
  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed hover:bg-transparent' : ''
  
  return [
    baseStyles,
    disabledStyles,
    customClassName,
  ]
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * 获取 Panel 内容的样式
 */
export const getPanelContentStyles = (customClassName?: string): string => {
  const baseStyles = 'px-4 pb-4 text-gray-700 overflow-hidden transition-all duration-300 ease-in-out'
  
  return [
    baseStyles,
    customClassName,
  ]
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * 获取箭头图标的样式
 */
export const getArrowStyles = (isActive: boolean, disabled: boolean = false): string => {
  const baseStyles = 'flex-shrink-0 w-4 h-4 transition-transform duration-200 ease-in-out'
  const activeStyles = isActive ? 'rotate-180' : 'rotate-0'
  const disabledStyles = disabled ? 'opacity-50' : ''
  
  return [
    baseStyles,
    activeStyles,
    disabledStyles,
  ]
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * 获取内容容器的样式（用于动画）
 */
export const getContentContainerStyles = (isActive: boolean): string => {
  const baseStyles = 'transition-all duration-300 ease-in-out'
  const activeStyles = isActive ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
  
  return [
    baseStyles,
    activeStyles,
  ]
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
}
