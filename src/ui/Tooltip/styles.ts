import { TooltipPlacement, TooltipTheme, TooltipAnimation } from './types'

/**
 * 获取Tooltip主题样式
 */
export const getThemeStyles = (theme: TooltipTheme): string => {
  const themes = {
    light: 'bg-white text-gray-900 border border-gray-200 shadow-lg',
  }
  return themes[theme] || themes.light
}

/**
 * 获取Tooltip位置样式 - 移除CSS定位，使用JavaScript计算位置
 */
export const getPlacementStyles = (): string => {
  // 由于使用JavaScript计算位置，这里只返回空字符串
  // 避免CSS定位与JavaScript计算的位置冲突
  return ''
}

/**
 * 获取箭头样式
 */
export const getArrowStyles = (placement: TooltipPlacement): string => {
  const arrowBase = 'absolute w-2 h-2 transform rotate-45'
  const lightArrow = 'bg-white border border-gray-200'
  
  const arrowColor = lightArrow
  
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
    'whitespace-normal',
    'min-h-fit',
    'h-auto',
  ].join(' ')
}

/**
 * 获取交互式样式
 */
export const getInteractiveStyles = (interactive: boolean, trigger: string): string => {
  // 如果是hover触发，需要允许鼠标事件以便用户可以hover到tooltip内容上
  if (trigger === 'hover') {
    return 'pointer-events-auto'
  }
  return interactive ? 'pointer-events-auto' : 'pointer-events-none'
}

/**
 * 组合所有样式类名
 */
export const getTooltipStyles = (
  theme: TooltipTheme = 'light',
  animation: TooltipAnimation = 'fade',
  visible: boolean = false,
  interactive: boolean = false,
  customClassName?: string,
  trigger: string = 'hover'
): string => {
  const baseStyles = getBaseStyles()
  const themeStyles = getThemeStyles(theme)
  const placementStyles = getPlacementStyles()
  const animationStyles = getAnimationStyles(animation, visible)
  const interactiveStyles = getInteractiveStyles(interactive, trigger)
  
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

