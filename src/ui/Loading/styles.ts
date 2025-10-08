import type { LoadingSize } from './types'
import { SIZE_MAP, TEXT_SIZE_MAP } from './constants'

/**
 * 获取加载器尺寸样式
 */
export function getLoaderSize(size: LoadingSize): string {
  return SIZE_MAP[size]
}

/**
 * 获取文本尺寸样式
 */
export function getTextSize(size: LoadingSize): string {
  return TEXT_SIZE_MAP[size]
}

