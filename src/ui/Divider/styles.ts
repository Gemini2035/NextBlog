import { DividerOrientation, DividerThickness } from './types'

/**
 * 获取分割线方向样式
 */
export const getOrientationStyles = (orientation: DividerOrientation): string => {
  const orientations = {
    horizontal: 'w-full h-0',
    vertical: 'h-full w-0',
  }
  return orientations[orientation]
}

/**
 * 获取分割线粗细样式
 */
export const getThicknessStyles = (thickness: DividerThickness, orientation: DividerOrientation): string => {
  const thicknessMap = {
    thin: orientation === 'horizontal' ? 'h-px' : 'w-px',
    medium: orientation === 'horizontal' ? 'h-0.5' : 'w-0.5',
    thick: orientation === 'horizontal' ? 'h-1' : 'w-1',
    'extra-thick': orientation === 'horizontal' ? 'h-1.5' : 'w-1.5',
  }
  return thicknessMap[thickness]
}

/**
 * 获取分割线圆角样式
 */
export const getRoundedStyles = (rounded: boolean): string => {
  return rounded ? 'rounded-full' : 'rounded-none'
}

/**
 * 获取分割线颜色样式
 */
export const getColorStyles = (color?: string): string => {
  if (color) {
    return `bg-[${color}]`
  }
  return 'bg-gray-200'
}

/**
 * 获取虚线样式
 */
export const getDashedStyles = (dashed: boolean): string => {
  return dashed ? 'border-dashed' : 'border-solid'
}

/**
 * 获取分割线长度样式
 */
export const getLengthStyles = (length?: number, orientation: DividerOrientation = 'horizontal'): string => {
  if (length && orientation === 'horizontal') {
    return `w-[${length}%]`
  }
  return ''
}

/**
 * 组合所有样式类名
 */
export const getDividerStyles = (
  orientation: DividerOrientation = 'horizontal',
  thickness: DividerThickness = 'medium',
  rounded: boolean = false,
  color?: string,
  dashed: boolean = false,
  length?: number,
  customClassName?: string
): string => {
  // 如果提供了自定义类名，只使用基础样式和自定义类名
  if (customClassName) {
    return [
      'block', // 确保元素显示
      customClassName
    ]
      .filter(Boolean)
      .join(' ')
      .trim()
  }
  
  // 默认样式逻辑
  const baseStyles = orientation === 'vertical' ? 'bg-gray-200' : 'border-0'
  const orientationStyles = getOrientationStyles(orientation)
  const thicknessStyles = getThicknessStyles(thickness, orientation)
  const roundedStyles = getRoundedStyles(rounded)
  const colorStyles = getColorStyles(color)
  const dashedStyles = getDashedStyles(dashed)
  const lengthStyles = getLengthStyles(length, orientation)
  
  return [
    baseStyles,
    orientationStyles,
    thicknessStyles,
    roundedStyles,
    colorStyles,
    dashedStyles,
    lengthStyles,
  ]
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
}
