import { CardShadow, CardBorder } from './types'

/**
 * 获取卡片阴影样式
 */
export const getShadowStyles = (shadow: CardShadow): string => {
  const shadows = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
    '2xl': 'shadow-2xl',
  }
  return shadows[shadow] || shadows.none
}

/**
 * 获取卡片边框样式
 */
export const getBorderStyles = (border: CardBorder): string => {
  const borders = {
    none: '',
    sm: 'border border-gray-200',
    md: 'border-2 border-gray-200',
    lg: 'border-4 border-gray-200',
    xl: 'border-8 border-gray-200',
    '2xl': 'border-16 border-gray-200',
  }
  return borders[border] || borders.none
}

/**
 * 获取卡片圆角样式
 */
export const getRoundedStyles = (rounded: boolean): string => {
  return rounded ? 'rounded-lg' : 'rounded-none'
}

/**
 * 获取卡片hover效果样式
 */
export const getHoverStyles = (disabledHover: boolean = false): string => {
  return disabledHover ? '' : 'hover:shadow-xl hover:scale-101 hover:-translate-y-1 hover:translate-x-1 origin-bottom-left'
}

/**
 * 组合所有样式类名
 */
export const getCardStyles = (
  shadow: CardShadow = 'none',
  border: CardBorder = 'none',
  rounded: boolean = false,
  disabledHover: boolean = false,
  customClassName?: string
): string => {
  const baseStyles = 'block p-4 bg-white transition-all duration-300 ease-in-out cursor-pointer'
  const shadowStyles = getShadowStyles(shadow)
  const borderStyles = getBorderStyles(border)
  const roundedStyles = getRoundedStyles(rounded)
  const hoverStyles = getHoverStyles(disabledHover)
  
  // 检查是否已经设置了宽度，如果没有则添加默认宽度
  const hasWidthClass = customClassName && /\bw-\w+/.test(customClassName)
  const defaultWidth = hasWidthClass ? '' : 'w-full'
  
  return [
    baseStyles,
    defaultWidth,
    shadowStyles,
    borderStyles,
    roundedStyles,
    hoverStyles,
    customClassName,
  ]
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
}
