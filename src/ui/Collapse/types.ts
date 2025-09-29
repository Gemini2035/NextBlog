import { ReactNode, HTMLAttributes } from 'react'

/**
 * Collapse 组件的尺寸类型
 */
export type CollapseSize = 
  | 'sm'          // 小尺寸
  | 'md'          // 中等尺寸
  | 'lg'          // 大尺寸

/**
 * Collapse 组件的变体类型
 */
export type CollapseVariant = 
  | 'default'     // 默认样式
  | 'bordered'    // 带边框样式
  | 'ghost'       // 幽灵样式

/**
 * Collapse 组件的基础属性接口
 */
export interface CollapseProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onChange'> {
  /** 当前激活的面板 key */
  activeKey?: string | string[]
  /** 默认激活的面板 key */
  defaultActiveKey?: string | string[]
  /** 是否可折叠 */
  collapsible?: 'header' | 'icon' | 'disabled'
  /** 是否手风琴模式（同时只能展开一个面板） */
  accordion?: boolean
  /** 是否显示边框 */
  bordered?: boolean
  /** 是否显示幽灵样式 */
  ghost?: boolean
  /** 组件尺寸 */
  size?: CollapseSize
  /** 变体样式 */
  variant?: CollapseVariant
  /** 自定义类名 */
  className?: string
  /** 子元素 */
  children?: ReactNode
  /** 面板切换时的回调 */
  onChange?: (activeKey: string | string[]) => void
  /** 面板展开时的回调 */
  onExpand?: (key: string) => void
  /** 面板收起时的回调 */
  onCollapse?: (key: string) => void
}

/**
 * Collapse.Panel 组件的属性接口
 */
export interface CollapsePanelProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** 面板的唯一标识 */
  key: string
  /** 面板标题 */
  header?: ReactNode
  /** 面板内容 */
  children?: ReactNode
  /** 是否禁用 */
  disabled?: boolean
  /** 是否显示箭头图标 */
  showArrow?: boolean
  /** 自定义箭头图标 */
  arrow?: ReactNode
  /** 自定义类名 */
  className?: string
  /** 面板头部容器自定义类名 */
  headerContainerClassName?: string
  /** 面板头部内容自定义类名 */
  headerContentClassName?: string
  /** 面板内容自定义类名 */
  contentClassName?: string
  /** 面板头部点击时的回调 */
  onHeaderClick?: (key: string) => void
  /** 是否激活状态（内部使用） */
  isActive?: boolean
  /** 切换回调（内部使用） */
  onToggle?: () => void
  /** 是否可折叠（内部使用） */
  collapsible?: 'header' | 'icon' | 'disabled'
}

/**
 * Collapse 组件的 ref 类型
 */
export type CollapseRef = HTMLDivElement

/**
 * Collapse.Panel 组件的 ref 类型
 */
export type CollapsePanelRef = HTMLDivElement
