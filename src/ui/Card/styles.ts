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
 * 组合所有样式类名
 */
export const getCardStyles = (
  shadow: CardShadow = 'none',
  border: CardBorder = 'none',
  rounded: boolean = false,
  customClassName?: string
): string => {
  const baseStyles = 'block w-full p-4 bg-white transition-all duration-200 ease-in-out'
  const shadowStyles = getShadowStyles(shadow)
  const borderStyles = getBorderStyles(border)
  const roundedStyles = getRoundedStyles(rounded)
  
  return [
    baseStyles,
    shadowStyles,
    borderStyles,
    roundedStyles,
    customClassName,
  ]
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
}
