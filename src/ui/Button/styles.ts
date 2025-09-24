import { ButtonType, ButtonSize } from './types'

/**
 * 获取按钮变体样式
 */
export const getVariantStyles = (variant: ButtonType): string => {
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500 border border-gray-300',
    outline: 'bg-transparent text-blue-600 hover:bg-blue-50 focus:ring-blue-500 border border-blue-600',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
    link: 'bg-transparent text-blue-600 hover:text-blue-700 focus:ring-blue-500 underline-offset-4 hover:underline',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  }
  return variants[variant] || variants.primary
}

/**
 * 获取按钮尺寸样式
 */
export const getSizeStyles = (size: ButtonSize): string => {
  const sizes = {
    xs: 'px-2 py-1 text-xs min-h-[1.5rem]',
    sm: 'px-3 py-1.5 text-sm min-h-[2rem]',
    md: 'px-4 py-2 text-sm min-h-[2.5rem]',
    lg: 'px-6 py-3 text-base min-h-[3rem]',
    xl: 'px-8 py-4 text-lg min-h-[3.5rem]',
  }
  return sizes[size] || sizes.md
}

/**
 * 获取按钮圆角样式
 */
export const getRoundedStyles = (rounded: boolean): string => {
  return rounded ? 'rounded-lg' : 'rounded-none'
}

/**
 * 组合所有样式类名
 */
export const getButtonStyles = (
  variant: ButtonType = 'primary',
  size: ButtonSize = 'md',
  rounded: boolean = false,
  disabled: boolean = false,
  loading: boolean = false,
  customClassName?: string
): string => {
  const baseStyles = 'inline-flex items-center justify-center font-medium text-center transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  const variantStyles = getVariantStyles(variant)
  const sizeStyles = getSizeStyles(size)
  const roundedStyles = getRoundedStyles(rounded)
  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : ''
  const loadingStyles = loading ? 'cursor-wait' : ''
  
  return [
    baseStyles,
    variantStyles,
    sizeStyles,
    roundedStyles,
    disabledStyles,
    loadingStyles,
    customClassName,
  ]
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
}