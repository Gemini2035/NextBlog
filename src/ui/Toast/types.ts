/**
 * Toast 组件类型定义
 */

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastOptions {
  /** 提示内容 */
  message: string
  /** 提示类型 */
  type?: ToastType
  /** 显示时长（毫秒），0表示不自动关闭 */
  duration?: number
  /** 是否可关闭 */
  closable?: boolean
  /** 关闭回调 */
  onClose?: () => void
}

export interface ToastInstance {
  /** Toast唯一ID */
  id: string
  /** Toast配置 */
  options: Required<ToastOptions>
  /** 创建时间 */
  timestamp: number
}

