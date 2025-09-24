import { ButtonTheme, ButtonVariant, ButtonSize, ButtonShape, ButtonState } from './types'

/**
 * Button组件的主题配置
 * 使用Tailwind CSS类名，便于后期抽离为独立组件库
 */
export const buttonTheme: ButtonTheme = {
  // 基础样式
  base: `
    inline-flex items-center justify-center
    font-medium text-center
    transition-all duration-200 ease-in-out
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    relative overflow-hidden
  `,

  // 变体样式
  variants: {
    primary: `
      bg-blue-600 text-white
      hover:bg-blue-700 active:bg-blue-800
      focus:ring-blue-500
      shadow-sm hover:shadow-md
    `,
    secondary: `
      bg-gray-100 text-gray-900
      hover:bg-gray-200 active:bg-gray-300
      focus:ring-gray-500
      border border-gray-300
    `,
    outline: `
      bg-transparent text-blue-600
      hover:bg-blue-50 active:bg-blue-100
      focus:ring-blue-500
      border border-blue-600
    `,
    ghost: `
      bg-transparent text-gray-700
      hover:bg-gray-100 active:bg-gray-200
      focus:ring-gray-500
    `,
    link: `
      bg-transparent text-blue-600
      hover:text-blue-700 active:text-blue-800
      focus:ring-blue-500
      underline-offset-4 hover:underline
    `,
    danger: `
      bg-red-600 text-white
      hover:bg-red-700 active:bg-red-800
      focus:ring-red-500
      shadow-sm hover:shadow-md
    `,
  },

  // 尺寸样式
  sizes: {
    xs: `
      px-2 py-1 text-xs
      min-h-[1.5rem]
      gap-1
    `,
    sm: `
      px-3 py-1.5 text-sm
      min-h-[2rem]
      gap-1.5
    `,
    md: `
      px-4 py-2 text-sm
      min-h-[2.5rem]
      gap-2
    `,
    lg: `
      px-6 py-3 text-base
      min-h-[3rem]
      gap-2.5
    `,
    xl: `
      px-8 py-4 text-lg
      min-h-[3.5rem]
      gap-3
    `,
  },

  // 形状样式
  shapes: {
    default: 'rounded-md',
    rounded: 'rounded-lg',
    pill: 'rounded-full',
    square: 'rounded-none',
  },

  // 状态样式
  states: {
    default: '',
    loading: 'cursor-wait',
    disabled: 'opacity-50 cursor-not-allowed',
    success: 'bg-green-600 hover:bg-green-700 text-white',
    error: 'bg-red-600 hover:bg-red-700 text-white',
  },

  // 禁用状态样式
  disabled: 'opacity-50 cursor-not-allowed pointer-events-none',

  // 加载状态样式
  loading: 'cursor-wait',
}

/**
 * 获取按钮变体样式
 */
export const getVariantStyles = (variant: ButtonVariant): string => {
  return buttonTheme.variants[variant] || buttonTheme.variants.primary
}

/**
 * 获取按钮尺寸样式
 */
export const getSizeStyles = (size: ButtonSize): string => {
  return buttonTheme.sizes[size] || buttonTheme.sizes.md
}

/**
 * 获取按钮形状样式
 */
export const getShapeStyles = (shape: ButtonShape): string => {
  return buttonTheme.shapes[shape] || buttonTheme.shapes.default
}

/**
 * 获取按钮状态样式
 */
export const getStateStyles = (state: ButtonState): string => {
  return buttonTheme.states[state] || buttonTheme.states.default
}

/**
 * 组合所有样式类名
 */
export const getButtonStyles = (
  variant: ButtonVariant = 'primary',
  size: ButtonSize = 'md',
  shape: ButtonShape = 'default',
  state: ButtonState = 'default',
  fullWidth: boolean = false,
  disabled: boolean = false,
  loading: boolean = false,
  customClassName?: string
): string => {
  const baseStyles = buttonTheme.base.trim()
  const variantStyles = getVariantStyles(variant)
  const sizeStyles = getSizeStyles(size)
  const shapeStyles = getShapeStyles(shape)
  const stateStyles = getStateStyles(state)
  
  const widthStyles = fullWidth ? 'w-full' : ''
  const disabledStyles = disabled ? buttonTheme.disabled : ''
  const loadingStyles = loading ? buttonTheme.loading : ''
  
  return [
    baseStyles,
    variantStyles,
    sizeStyles,
    shapeStyles,
    stateStyles,
    widthStyles,
    disabledStyles,
    loadingStyles,
    customClassName,
  ]
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
}
