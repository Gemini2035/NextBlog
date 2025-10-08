import { ReactNode } from 'react'

/**
 * Loading组件的尺寸类型
 */
export type LoadingSize = 
  | 'xs'      // 超小尺寸 (16px)
  | 'sm'      // 小尺寸 (24px)
  | 'md'      // 中等尺寸 (32px)
  | 'lg'      // 大尺寸 (48px)
  | 'xl'      // 超大尺寸 (64px)

/**
 * Loading组件的变体类型
 */
export type LoadingVariant = 
  | 'spinner'   // 旋转加载器
  | 'dots'      // 点状加载器
  | 'pulse'     // 脉冲加载器
  | 'skeleton'  // 骨架屏

/**
 * Loading组件的属性接口
 */
export interface LoadingProps {
  /** 尺寸 */
  size?: LoadingSize
  /** 变体 */
  variant?: LoadingVariant
  /** 加载文本 */
  text?: string
  /** 是否显示文本 */
  showText?: boolean
  /** 是否全屏 */
  fullscreen?: boolean
  /** 自定义类名 */
  className?: string
  /** 子元素（用于skeleton模式） */
  children?: ReactNode
}

