'use client'

import { forwardRef, useEffect, useCallback, useState } from 'react'
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
    // 内部状态：用于延迟卸载 DOM，让关闭动画完成
    const [shouldRender, setShouldRender] = useState(open)
    const [isAnimating, setIsAnimating] = useState(false)

    // 当 open 变化时，处理渲染状态和动画
    useEffect(() => {
      if (open) {
        // 打开时：先渲染 DOM，然后在下一帧触发动画
        setShouldRender(true)
        // 使用 requestAnimationFrame 确保 DOM 已渲染，再触发动画
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setIsAnimating(true)
          })
        })
      } else {
        // 关闭时：立即触发关闭动画
        setIsAnimating(false)
        // 延迟卸载，等待动画完成（300ms）
        const timer = setTimeout(() => {
          setShouldRender(false)
        }, 300)
        return () => clearTimeout(timer)
      }
    }, [open])

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

    // 阻止滚动穿透（桌面与移动端都生效）
    useEffect(() => {
      if (!open) return

      const scrollY = window.scrollY || 0
      const { style: bodyStyle } = document.body
      const { style: htmlStyle } = document.documentElement

      // 锁定滚动：固定 body，记录并维持当前位置
      bodyStyle.position = 'fixed'
      bodyStyle.top = `-${scrollY}px`
      bodyStyle.left = '0'
      bodyStyle.right = '0'
      bodyStyle.width = '100%'
      bodyStyle.overflow = 'hidden'
      htmlStyle.overflow = 'hidden'
      htmlStyle.overscrollBehavior = 'none'

      // 防止页面其他容器滚动（触摸与滚轮）
      const preventDefault = (e: Event) => e.preventDefault()
      window.addEventListener('touchmove', preventDefault, { passive: false })
      window.addEventListener('wheel', preventDefault, { passive: false })

      return () => {
        // 恢复滚动状态
        window.removeEventListener('touchmove', preventDefault as EventListener)
        window.removeEventListener('wheel', preventDefault as EventListener)
        bodyStyle.position = ''
        bodyStyle.top = ''
        bodyStyle.left = ''
        bodyStyle.right = ''
        bodyStyle.width = ''
        bodyStyle.overflow = ''
        htmlStyle.overflow = ''
        htmlStyle.overscrollBehavior = ''
        window.scrollTo(0, scrollY)
      }
    }, [open])

    // 未打开且动画已完成时不渲染（destroyOnClose 或 shouldRender 为 false）
    if (!shouldRender && destroyOnClose) {
      return null
    }

    // 非 destroyOnClose 模式下，也要等待动画完成再卸载
    if (!shouldRender) {
      return null
    }

    return (
      <>
        {/* 遮罩层 */}
        {mask && (
          <div
            className={cn(getMaskStyles(isAnimating, maskClassName))}
            style={{ zIndex: zIndex - 1 }}
            onClick={handleMaskClick}
            aria-hidden="true"
          />
        )}

        {/* 抽屉主体 */}
        <div
          ref={ref}
          className={cn(getDrawerStyles(placement, size, isAnimating, className))}
          style={{ zIndex, height: size === 'full' && (placement === 'left' || placement === 'right') ? '100vh' : undefined }}
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

          {/* 内容区域 - 保证占满剩余高度并可滚动 */}
          <div
            className={cn(getBodyStyles(bodyClassName), 'min-h-0 flex-1 overflow-y-auto')}
            style={{ overscrollBehavior: 'contain' }}
            onWheel={(e) => { e.stopPropagation() }}
            onTouchMove={(e) => { e.stopPropagation() }}
          >
            {children}
          </div>

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


