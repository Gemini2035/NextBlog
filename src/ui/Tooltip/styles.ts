import { TooltipPlacement, TooltipTheme, TooltipAnimation } from './types'

/**
 * 获取Tooltip主题样式
 */
export const getThemeStyles = (theme: TooltipTheme): string => {
  const themes = {
    light: 'bg-white text-gray-900 border border-gray-200 shadow-lg',
    dark: 'bg-gray-900 text-white border border-gray-700 shadow-xl',
  }
  return themes[theme] || themes.light
}

/**
 * 获取Tooltip位置样式
 */
export const getPlacementStyles = (placement: TooltipPlacement): string => {
  const placements = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    topLeft: 'bottom-full left-0 mb-2',
    topRight: 'bottom-full right-0 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    bottomLeft: 'top-full left-0 mt-2',
    bottomRight: 'top-full right-0 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    leftTop: 'right-full top-0 mr-2',
    leftBottom: 'right-full bottom-0 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
    rightTop: 'left-full top-0 ml-2',
    rightBottom: 'left-full bottom-0 ml-2',
  }
  return placements[placement] || placements.top
}

/**
 * 获取箭头样式
 */
export const getArrowStyles = (placement: TooltipPlacement, theme: TooltipTheme): string => {
  const arrowBase = 'absolute w-2 h-2 transform rotate-45'
  const lightArrow = 'bg-white border border-gray-200'
  const darkArrow = 'bg-gray-900 border border-gray-700'
  
  const arrowColor = theme === 'dark' ? darkArrow : lightArrow
  
  const arrowPositions = {
    top: `${arrowColor} -bottom-1 left-1/2 transform -translate-x-1/2`,
    topLeft: `${arrowColor} -bottom-1 left-4`,
    topRight: `${arrowColor} -bottom-1 right-4`,
    bottom: `${arrowColor} -top-1 left-1/2 transform -translate-x-1/2`,
    bottomLeft: `${arrowColor} -top-1 left-4`,
    bottomRight: `${arrowColor} -top-1 right-4`,
    left: `${arrowColor} -right-1 top-1/2 transform -translate-y-1/2`,
    leftTop: `${arrowColor} -right-1 top-4`,
    leftBottom: `${arrowColor} -right-1 bottom-4`,
    right: `${arrowColor} -left-1 top-1/2 transform -translate-y-1/2`,
    rightTop: `${arrowColor} -left-1 top-4`,
    rightBottom: `${arrowColor} -left-1 bottom-4`,
  }
  
  return `${arrowBase} ${arrowPositions[placement] || arrowPositions.top}`
}

/**
 * 获取动画样式
 */
export const getAnimationStyles = (animation: TooltipAnimation, visible: boolean): string => {
  const animations = {
    fade: visible 
      ? 'opacity-100 transition-opacity duration-200 ease-in-out' 
      : 'opacity-0 transition-opacity duration-200 ease-in-out',
    zoom: visible 
      ? 'opacity-100 scale-100 transition-all duration-200 ease-in-out' 
      : 'opacity-0 scale-95 transition-all duration-200 ease-in-out',
    slide: visible 
      ? 'opacity-100 translate-y-0 transition-all duration-200 ease-in-out' 
      : 'opacity-0 translate-y-1 transition-all duration-200 ease-in-out',
    none: '',
  }
  return animations[animation] || animations.fade
}

/**
 * 获取基础样式
 */
export const getBaseStyles = (): string => {
  return [
    'absolute z-50',
    'px-3 py-2',
    'text-sm font-medium',
    'rounded-md',
    'pointer-events-none',
    'max-w-xs',
    'break-words',
    'whitespace-nowrap',
  ].join(' ')
}

/**
 * 获取交互式样式
 */
export const getInteractiveStyles = (interactive: boolean): string => {
  return interactive ? 'pointer-events-auto' : 'pointer-events-none'
}

/**
 * 组合所有样式类名
 */
export const getTooltipStyles = (
  placement: TooltipPlacement = 'top',
  theme: TooltipTheme = 'light',
  animation: TooltipAnimation = 'fade',
  visible: boolean = false,
  interactive: boolean = false,
  customClassName?: string
): string => {
  const baseStyles = getBaseStyles()
  const themeStyles = getThemeStyles(theme)
  const placementStyles = getPlacementStyles(placement)
  const animationStyles = getAnimationStyles(animation, visible)
  const interactiveStyles = getInteractiveStyles(interactive)
  
  return [
    baseStyles,
    themeStyles,
    placementStyles,
    animationStyles,
    interactiveStyles,
    customClassName,
  ]
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * 获取箭头样式类名
 */
export const getArrowStyles = (
  placement: TooltipPlacement = 'top',
  theme: TooltipTheme = 'light'
): string => {
  const arrowBase = 'absolute w-2 h-2 transform rotate-45'
  const lightArrow = 'bg-white border border-gray-200'
  const darkArrow = 'bg-gray-900 border border-gray-700'
  
  const arrowColor = theme === 'dark' ? darkArrow : lightArrow
  
  const arrowPositions = {
    top: `${arrowColor} -bottom-1 left-1/2 transform -translate-x-1/2`,
    topLeft: `${arrowColor} -bottom-1 left-4`,
    topRight: `${arrowColor} -bottom-1 right-4`,
    bottom: `${arrowColor} -top-1 left-1/2 transform -translate-x-1/2`,
    bottomLeft: `${arrowColor} -top-1 left-4`,
    bottomRight: `${arrowColor} -top-1 right-4`,
    left: `${arrowColor} -right-1 top-1/2 transform -translate-y-1/2`,
    leftTop: `${arrowColor} -right-1 top-4`,
    leftBottom: `${arrowColor} -right-1 bottom-4`,
    right: `${arrowColor} -left-1 top-1/2 transform -translate-y-1/2`,
    rightTop: `${arrowColor} -left-1 top-4`,
    rightBottom: `${arrowColor} -left-1 bottom-4`,
  }
  
  return `${arrowBase} ${arrowPositions[placement] || arrowPositions.top}`
}
