'use client'

import { forwardRef, useEffect, useCallback } from 'react'
import { DrawerProps, DrawerRef } from './types'
import {
  getDrawerStyles,
  getMaskStyles,
  getHeaderStyles,
  getBodyStyles,
  getFooterStyles,
} from './styles'
import { cn } from '@/utils'
import { CloseIcon } from '@/assets/icons'

/**
 * 默认关闭图标组件
 */
const DefaultCloseIcon = () => (
  <CloseIcon className="w-5 h-5" />
)

/**
 * Drawer 组件 - 仿照 Ant Design 的抽屉组件
 * 支持多个方向、自定义尺寸、遮罩层控制
 * 
 * @example
 * ```tsx
 * // 基础用法
 * <Drawer open={visible} onClose={() => setVisible(false)} title="标题">
 *   内容
 * </Drawer>
 * 
 * // 从左侧展开
 * <Drawer open={visible} placement="left" onClose={() => setVisible(false)}>
 *   内容
 * </Drawer>
 * 
 * // 全屏抽屉
 * <Drawer open={visible} size="full" onClose={() => setVisible(false)}>
 *   内容
 * </Drawer>
 * 
 * // 带底部操作按钮
 * <Drawer 
 *   open={visible} 
 *   onClose={() => setVisible(false)}
 *   footer={
 *     <Button onClick={() => setVisible(false)}>关闭</Button>
 *   }
 * >
 *   内容
 * </Drawer>
 * ```
 */
export const Drawer = forwardRef<DrawerRef, DrawerProps>(
  (
    {
      open = false,
      title,
      placement = 'right',
      size = 'md',
      mask = true,
      maskClosable = true,
      closable = true,
      closeIcon,
      destroyOnClose = false,
      className,
      maskClassName,
      bodyClassName,
      headerClassName,
      footerClassName,
      children,
      footer,
      extra,
      onClose,
      afterOpenChange,
      zIndex = 1000,
      ...props
    },
    ref
  ) => {
    // 处理 ESC 键关闭
    useEffect(() => {
      if (!open) return

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && onClose) {
          onClose()
        }
      }

      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }, [open, onClose])

    // 处理遮罩点击
    const handleMaskClick = useCallback(() => {
      if (maskClosable && onClose) {
        onClose()
      }
    }, [maskClosable, onClose])

    // 处理关闭按钮点击
    const handleClose = useCallback(() => {
      if (onClose) {
        onClose()
      }
    }, [onClose])

    // 监听打开状态变化
    useEffect(() => {
      if (afterOpenChange) {
        afterOpenChange(open)
      }
    }, [open, afterOpenChange])

    // 阻止滚动穿透
    useEffect(() => {
      if (open) {
        document.body.style.overflow = 'hidden'
        return () => {
          document.body.style.overflow = ''
        }
      }
    }, [open])

    // 如果未打开且设置了销毁，则不渲染
    if (!open && destroyOnClose) {
      return null
    }

    // 如果未打开，只渲染隐藏状态
    if (!open) {
      return (
        <>
          {mask && (
            <div
              className={cn(getMaskStyles(false, maskClassName), 'pointer-events-none')}
              style={{ zIndex: zIndex - 1 }}
              aria-hidden="true"
            />
          )}
          <div
            ref={ref}
            className={cn(getDrawerStyles(placement, size, false, className))}
            style={{ zIndex }}
            aria-hidden="true"
            {...props}
          />
        </>
      )
    }

    return (
      <>
        {/* 遮罩层 */}
        {mask && (
          <div
            className={cn(getMaskStyles(open, maskClassName))}
            style={{ zIndex: zIndex - 1 }}
            onClick={handleMaskClick}
            aria-hidden="true"
          />
        )}

        {/* 抽屉主体 */}
        <div
          ref={ref}
          className={cn(getDrawerStyles(placement, size, open, className))}
          style={{ zIndex }}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? 'drawer-title' : undefined}
          {...props}
        >
          {/* 头部 */}
          {(title || closable || extra) && (
            <div className={cn(getHeaderStyles(headerClassName))}>
              <div className="flex items-center gap-4 flex-1">
                {title && (
                  <h2
                    id="drawer-title"
                    className="text-lg font-semibold text-gray-900 flex-1"
                  >
                    {title}
                  </h2>
                )}
                {extra && <div className="flex items-center gap-2">{extra}</div>}
              </div>
              {closable && (
                <button
                  type="button"
                  onClick={handleClose}
                  className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  aria-label="关闭抽屉"
                >
                  {closeIcon || <DefaultCloseIcon />}
                </button>
              )}
            </div>
          )}

          {/* 内容区域 */}
          <div className={cn(getBodyStyles(bodyClassName))}>{children}</div>

          {/* 底部 */}
          {footer && (
            <div className={cn(getFooterStyles(footerClassName))}>{footer}</div>
          )}
        </div>
      </>
    )
  }
)

Drawer.displayName = 'Drawer'

export default Drawer


