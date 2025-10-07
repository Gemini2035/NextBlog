import { ReactNode, HTMLAttributes } from 'react'

/**
 * Timeline 组件的模式类型
 */
export type TimelineMode = 
  | 'left'      // 左侧模式
  | 'right'     // 右侧模式
  | 'alternate' // 交替模式

/**
 * Timeline 组件的尺寸类型
 */
export type TimelineSize = 
  | 'sm'        // 小尺寸
  | 'md'        // 中等尺寸
  | 'lg'        // 大尺寸

/**
 * Timeline 组件的颜色类型
 */
export type TimelineColor = 
  | 'blue'      // 蓝色
  | 'green'     // 绿色
  | 'red'       // 红色
  | 'orange'    // 橙色
  | 'purple'    // 紫色
  | 'gray'      // 灰色

/**
 * Timeline 组件的状态类型
 */
export type TimelineStatus = 
  | 'pending'   // 待处理
  | 'process'   // 进行中
  | 'finish'    // 已完成
  | 'error'     // 错误

/**
 * Timeline 组件的基础属性接口
 */
export interface TimelineProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** 时间轴模式 */
  mode?: TimelineMode
  /** 时间轴尺寸 */
  size?: TimelineSize
  /** 是否显示连接线 */
  showLine?: boolean
  /** 连接线颜色 */
  lineColor?: string
  /** 自定义类名 */
  className?: string
  /** 子元素 */
  children?: ReactNode
}

/**
 * TimelineItem 组件的属性接口
 */
export interface TimelineItemProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** 时间标签 */
  label?: ReactNode
  /** 时间轴点的颜色 */
  color?: TimelineColor
  /** 时间轴点的状态 */
  status?: TimelineStatus
  /** 自定义时间轴点 */
  dot?: ReactNode
  /** 是否显示连接线 */
  showLine?: boolean
  /** 连接线颜色 */
  lineColor?: string
  /** 自定义类名 */
  className?: string
  /** 子元素 */
  children?: ReactNode
}

/**
 * Timeline 组件的 ref 类型
 */
export type TimelineRef = HTMLDivElement

/**
 * TimelineItem 组件的 ref 类型
 */
export type TimelineItemRef = HTMLDivElement
