'use client'

import { forwardRef, useState, useCallback, useMemo, cloneElement, isValidElement } from 'react'
import { CollapseProps, CollapseRef, CollapsePanelProps } from './types'
import { getCollapseStyles } from './styles'
import { cn } from '@/utils'

/**
 * 默认箭头图标组件
 */
const DefaultArrowIcon = ({ isActive, disabled }: { isActive: boolean; disabled?: boolean }) => (
  <svg
    className={cn(
      'flex-shrink-0 w-4 h-4 transition-transform duration-200 ease-in-out',
      isActive ? 'rotate-180' : 'rotate-0',
      disabled ? 'opacity-50' : ''
    )}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
)

/**
 * Collapse 组件 - 仿照 Ant Design 的折叠面板组件
 * 支持手风琴模式、自定义箭头、多种样式变体
 * 
 * @example
 * ```tsx
 * // 基础用法
 * <Collapse>
 *   <Collapse.Panel header="面板 1" key="1">
 *     这是面板 1 的内容
 *   </Collapse.Panel>
 *   <Collapse.Panel header="面板 2" key="2">
 *     这是面板 2 的内容
 *   </Collapse.Panel>
 * </Collapse>
 * 
 * // 手风琴模式
 * <Collapse accordion>
 *   <Collapse.Panel header="面板 1" key="1">内容 1</Collapse.Panel>
 *   <Collapse.Panel header="面板 2" key="2">内容 2</Collapse.Panel>
 * </Collapse>
 * 
 * // 默认展开
 * <Collapse defaultActiveKey={["1"]}>
 *   <Collapse.Panel header="面板 1" key="1">内容 1</Collapse.Panel>
 * </Collapse>
 * 
 * // 不同样式
 * <Collapse variant="bordered" size="lg">
 *   <Collapse.Panel header="面板" key="1">内容</Collapse.Panel>
 * </Collapse>
 * ```
 */
export const Collapse = forwardRef<CollapseRef, CollapseProps>(
  (
    {
      activeKey,
      defaultActiveKey,
      collapsible = 'header',
      accordion = false,
      bordered = false,
      ghost = false,
      size = 'md',
      variant = 'default',
      className,
      children,
      onChange,
      onExpand,
      onCollapse,
      ...props
    },
    ref
  ) => {
    // 内部状态管理
    const [internalActiveKey, setInternalActiveKey] = useState<string[]>(() => {
      const initialKey = activeKey || defaultActiveKey
      if (Array.isArray(initialKey)) return initialKey
      return initialKey ? [initialKey] : []
    })

    // 当前激活的面板
    const currentActiveKey = useMemo(() => {
      return activeKey !== undefined ? 
        (Array.isArray(activeKey) ? activeKey : [activeKey]) : 
        internalActiveKey
    }, [activeKey, internalActiveKey])

    // 处理面板切换
    const handlePanelToggle = useCallback((key: string) => {
      if (collapsible === 'disabled') return

      let newActiveKey: string[]
      
      if (accordion) {
        // 手风琴模式：同时只能展开一个面板
        newActiveKey = currentActiveKey.includes(key) ? [] : [key]
      } else {
        // 普通模式：可以同时展开多个面板
        if (currentActiveKey.includes(key)) {
          newActiveKey = currentActiveKey.filter(k => k !== key)
        } else {
          newActiveKey = [...currentActiveKey, key]
        }
      }

      // 更新状态
      if (activeKey === undefined) {
        setInternalActiveKey(newActiveKey)
      }

      // 触发回调
      onChange?.(accordion ? newActiveKey[0] || '' : newActiveKey)
      
      if (newActiveKey.includes(key)) {
        onExpand?.(key)
      } else {
        onCollapse?.(key)
      }
    }, [activeKey, currentActiveKey, accordion, collapsible, onChange, onExpand, onCollapse])

    // 获取样式类名
    const collapseStyles = getCollapseStyles(size, variant, bordered, ghost, className)

    // 渲染子组件
    const renderChildren = useMemo(() => {
      if (!children) return null

      return Array.isArray(children) ? children.map((child, index) => {
        if (!isValidElement<CollapsePanelProps>(child)) return child

        const { ...childProps } = child.props
        const panelKey = child.key || String(index)
        const isActive = currentActiveKey.includes(panelKey)

        return cloneElement(child, {
          ...childProps,
          isActive,
          onToggle: () => handlePanelToggle(panelKey),
          collapsible,
        })
      }      ) : (
        isValidElement<CollapsePanelProps>(children) ? 
          cloneElement(children, {
            ...children.props,
            isActive: currentActiveKey.includes(children.key || 'filter'),
            onToggle: () => handlePanelToggle(children.key || 'filter'),
            collapsible,
          }) : 
          children
      )
    }, [children, currentActiveKey, handlePanelToggle, collapsible])

    return (
      <div
        ref={ref}
        className={cn(collapseStyles)}
        {...props}
      >
        {renderChildren}
      </div>
    )
  }
)

Collapse.displayName = 'Collapse'

/**
 * Collapse.Panel 子组件
 */
export const CollapsePanel = forwardRef<HTMLDivElement, CollapsePanelProps & {
  isActive?: boolean
  onToggle?: () => void
  collapsible?: 'header' | 'icon' | 'disabled'
}>(
  (
    {
      key,
      header,
      children,
      disabled = false,
      showArrow = true,
      arrow,
      className,
      headerContainerClassName,
      headerContentClassName,
      contentClassName,
      onHeaderClick,
      isActive = false,
      onToggle,
      collapsible = 'header',
      ...props
    },
    ref
  ) => {
    // 处理头部点击
    const handleHeaderClick = () => {
      if (disabled || collapsible === 'disabled') return
      
      onHeaderClick?.(key)
      onToggle?.()
    }

    // 处理箭头点击
    const handleArrowClick = (e: React.MouseEvent) => {
      if (collapsible === 'header') return
      
      e.stopPropagation()
      if (!disabled) {
        onToggle?.()
      }
    }

    // 渲染箭头图标
    const renderArrow = () => {
      if (!showArrow) return null

      if (arrow) {
        return (
          <span 
            className={cn(
              'flex-shrink-0 transition-transform duration-200 ease-in-out',
              isActive ? 'rotate-180' : 'rotate-0',
              disabled ? 'opacity-50' : '',
              collapsible === 'icon' ? 'cursor-pointer' : ''
            )}
            onClick={handleArrowClick}
          >
            {arrow}
          </span>
        )
      }

      return (
        <DefaultArrowIcon isActive={isActive} disabled={disabled} />
      )
    }

    return (
      <div
        ref={ref}
        className={cn(
          'border-b border-gray-200 last:border-b-0',
          className
        )}
        {...props}
      >
        {/* 面板头部容器 */}
        <div
          className={cn(
            'flex items-center justify-between w-full text-left font-medium transition-colors duration-200',
            'px-4 py-3',
            disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset',
            headerContainerClassName
          )}
          onClick={handleHeaderClick}
          tabIndex={disabled ? -1 : 0}
          role="button"
          aria-expanded={isActive}
          aria-disabled={disabled}
        >
          {/* 面板头部内容 */}
          <div className={cn('flex-1 pr-2', headerContentClassName)}>
            {header}
          </div>
          {renderArrow()}
        </div>

        {/* 面板内容 */}
        <div
          className={cn(
            'overflow-hidden transition-all duration-300 ease-in-out',
            isActive ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
          )}
        >
          <div
            className={cn(
              'px-4 pb-4 text-gray-700',
              contentClassName
            )}
          >
            {children}
          </div>
        </div>
      </div>
    )
  }
)

CollapsePanel.displayName = 'Collapse.Panel'

// 将 Panel 作为 Collapse 的静态属性
;(Collapse as typeof Collapse & { Panel: typeof CollapsePanel }).Panel = CollapsePanel

export default Collapse
