import { ReactNode } from 'react'

/**
 * 空状态组件的尺寸类型
 */
export type EmptyStateSize = 'sm' | 'md' | 'lg'

/**
 * 空状态组件的变体类型
 */
export type EmptyStateVariant = 'default' | 'minimal' | 'card'

/**
 * 空状态组件的图标类型
 */
export type EmptyStateIconType = 'search' | 'folder' | 'document' | 'users' | 'settings' | 'warning' | 'info' | 'success' | 'error'

/**
 * 空状态组件的属性接口
 */
export interface EmptyStateProps {
  /** 图标类型 */
  icon?: EmptyStateIconType | ReactNode
  /** 标题 */
  title?: string
  /** 描述文本 */
  description?: string
  /** 操作按钮 */
  action?: ReactNode
  /** 尺寸 */
  size?: EmptyStateSize
  /** 变体 */
  variant?: EmptyStateVariant
  /** 自定义类名 */
  className?: string
  /** 是否显示图标 */
  showIcon?: boolean
  /** 自定义样式 */
  style?: React.CSSProperties
}

/**
 * 空状态组件的引用类型
 */
export type EmptyStateRef = HTMLDivElement
