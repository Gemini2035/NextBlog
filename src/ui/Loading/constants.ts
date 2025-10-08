import type { LoadingSize } from './types'

/**
 * 尺寸映射
 */
export const SIZE_MAP: Record<LoadingSize, string> = {
  xs: 'w-4 h-4',
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16'
}

/**
 * 文本尺寸映射
 */
export const TEXT_SIZE_MAP: Record<LoadingSize, string> = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl'
}

