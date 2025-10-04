import { ReactNode, HTMLAttributes } from 'react'

/**
 * Tooltip组件的触发方式类型
 */
export type TooltipTrigger = 
  | 'hover'        // 鼠标悬停触发
  | 'click'        // 点击触发
  | 'focus'        // 聚焦触发
  | 'contextMenu'  // 右键菜单触发

/**
 * Tooltip组件的显示位置类型
 */
export type TooltipPlacement = 
  | 'top'          // 上方
  | 'topLeft'      // 上方左侧
  | 'topRight'     // 上方右侧
  | 'bottom'       // 下方
  | 'bottomLeft'   // 下方左侧
  | 'bottomRight'  // 下方右侧
  | 'left'         // 左侧
  | 'leftTop'      // 左侧上方
  | 'leftBottom'   // 左侧下方
  | 'right'        // 右侧
  | 'rightTop'     // 右侧上方
  | 'rightBottom'  // 右侧下方

/**
 * Tooltip组件的主题类型
 */
export type TooltipTheme = 
  | 'light'        // 浅色主题

/**
 * Tooltip组件的基础属性接口
 */
export interface TooltipProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** 提示内容 */
  title?: ReactNode
  /** 触发方式 */
  trigger?: TooltipTrigger
  /** 显示位置 */
  placement?: TooltipPlacement
  /** 主题 */
  theme?: TooltipTheme
  /** 是否显示箭头 */
  arrow?: boolean
  /** 是否禁用 */
  disabled?: boolean
  /** 延迟显示时间（毫秒） */
  delay?: number
  /** 延迟隐藏时间（毫秒） */
  hideDelay?: number
  /** 是否可交互 */
  interactive?: boolean
  /** 自定义类名 */
  className?: string
  /** 自定义样式 */
  style?: React.CSSProperties
  /** 子元素 */
  children: ReactNode
  /** 是否默认显示 */
  defaultVisible?: boolean
  /** 是否显示（受控） */
  visible?: boolean
  /** 显示状态变化回调 */
  onVisibleChange?: (visible: boolean) => void
  /** 自定义偏移量 */
  offset?: [number, number]
  /** 是否跟随鼠标 */
  followCursor?: boolean
  /** 最大宽度 */
  maxWidth?: number | string
  /** 最小宽度 */
  minWidth?: number | string
  /** 自定义渲染容器 */
  getRenderContainer?: () => HTMLElement
}

/**
 * Tooltip组件的ref类型
 */
export type TooltipRef = HTMLDivElement

/**
 * Tooltip组件的内部状态类型
 */
export interface TooltipState {
  visible: boolean
  position: {
    top: number
    left: number
  }
  placement: TooltipPlacement
}

/**
 * Tooltip组件的动画类型
 */
export type TooltipAnimation = 
  | 'fade'         // 淡入淡出
  | 'zoom'         // 缩放
  | 'slide'        // 滑动
  | 'none'         // 无动画
