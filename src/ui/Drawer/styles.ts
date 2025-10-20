import { DrawerPlacement, DrawerSize } from './types'

/**
 * 获取 Drawer 的位置样式
 */
export const getDrawerPlacementStyles = (placement: DrawerPlacement): string => {
  const placements = {
    top: 'top-0 left-0 right-0',
    right: 'top-0 right-0 bottom-0',
    bottom: 'bottom-0 left-0 right-0',
    left: 'top-0 left-0 bottom-0',
  }
  return placements[placement] || placements.right
}

/**
 * 获取 Drawer 的尺寸样式
 */
export const getDrawerSizeStyles = (size: DrawerSize, placement: DrawerPlacement): string => {
  const isHorizontal = placement === 'left' || placement === 'right'
  
  if (size === 'full') {
    // 使用视口单位，避免在关闭时造成布局占位或导致白屏区域
    return 'w-screen h-screen'
  }
  
  const sizes = {
    sm: isHorizontal ? 'w-64' : 'h-64',
    md: isHorizontal ? 'w-96' : 'h-96',
    lg: isHorizontal ? 'w-[46rem]' : 'h-[46rem]',
  }
  
  return sizes[size] || sizes.md
}

/**
 * 获取 Drawer 打开/关闭的动画样式
 */
export const getDrawerTransformStyles = (
  placement: DrawerPlacement,
  open: boolean
): string => {
  if (open) return 'translate-x-0 translate-y-0'
  
  const transforms = {
    top: '-translate-y-full',
    right: 'translate-x-full', // 关闭时从右向左滑出
    bottom: 'translate-y-full',
    left: '-translate-x-full',
  }
  
  return transforms[placement] || transforms.right
}

/**
 * 获取 Drawer 组件的基础样式
 */
export const getDrawerStyles = (
  placement: DrawerPlacement,
  size: DrawerSize,
  open: boolean,
  customClassName?: string
): string => {
  const baseStyles = 'fixed bg-white shadow-xl transition-transform duration-300 ease-out z-50 flex flex-col will-change-transform'
  const placementStyles = getDrawerPlacementStyles(placement)
  const sizeStyles = getDrawerSizeStyles(size, placement)
  const transformStyles = getDrawerTransformStyles(placement, open)
  const pointerStyles = open ? 'pointer-events-auto' : 'pointer-events-none'
  
  return [
    baseStyles,
    placementStyles,
    sizeStyles,
    transformStyles,
    pointerStyles,
    customClassName,
  ]
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * 获取遮罩层样式
 */
export const getMaskStyles = (open: boolean, customClassName?: string): string => {
  const baseStyles = 'fixed inset-0 h-screen bg-black/50 transition-opacity duration-300 ease-out z-40'
  const opacityStyles = open ? 'opacity-100' : 'opacity-0'
  const pointerStyles = open ? 'pointer-events-auto' : 'pointer-events-none'
  
  return [
    baseStyles,
    opacityStyles,
    pointerStyles,
    customClassName,
  ]
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * 获取头部样式
 */
export const getHeaderStyles = (customClassName?: string): string => {
  const baseStyles = 'flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0'
  
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
 * 获取内容区域样式
 */
export const getBodyStyles = (customClassName?: string): string => {
  const baseStyles = 'min-h-0 flex-1 overflow-y-auto'
  
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
 * 获取底部样式
 */
export const getFooterStyles = (customClassName?: string): string => {
  const baseStyles = 'flex items-center justify-end px-6 py-4 border-t border-gray-200 flex-shrink-0 gap-2'
  
  return [
    baseStyles,
    customClassName,
  ]
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
}


