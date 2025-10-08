/**
 * Toast 通知组件
 * 类似 antd 的 message 组件
 */

import type { ToastOptions, ToastInstance } from './types'

let toastId = 0

/**
 * 生成唯一ID
 */
function generateId(): string {
  return `toast-${Date.now()}-${++toastId}`
}

/**
 * 触发Toast显示
 */
function showToast(options: ToastOptions) {
  if (typeof window === 'undefined') return

  const toast: ToastInstance = {
    id: generateId(),
    options: {
      message: options.message,
      type: options.type || 'info',
      duration: options.duration ?? 3000,
      closable: options.closable ?? true,
      onClose: options.onClose || (() => {}),
    },
    timestamp: Date.now(),
  }

  const event = new CustomEvent('show-toast', { detail: toast })
  window.dispatchEvent(event)
}

/**
 * Toast API
 */
export const toast = {
  /**
   * 显示成功提示
   */
  success: (message: string, duration?: number) => {
    showToast({ message, type: 'success', duration })
  },

  /**
   * 显示错误提示
   */
  error: (message: string, duration?: number) => {
    showToast({ message, type: 'error', duration })
  },

  /**
   * 显示警告提示
   */
  warning: (message: string, duration?: number) => {
    showToast({ message, type: 'warning', duration })
  },

  /**
   * 显示信息提示
   */
  info: (message: string, duration?: number) => {
    showToast({ message, type: 'info', duration })
  },

  /**
   * 自定义Toast
   */
  show: (options: ToastOptions) => {
    showToast(options)
  },
}

// 导出组件和类型
export { ToastContainer } from './ToastContainer'
export type { ToastOptions, ToastType, ToastInstance } from './types'

