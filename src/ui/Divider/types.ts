import { HTMLAttributes } from 'react'

/**
 * Divider组件的方向类型
 */
export type DividerOrientation = 
  | 'horizontal'    // 水平分割线
  | 'vertical'      // 垂直分割线

/**
 * Divider组件的粗细类型
 */
export type DividerThickness = 
  | 'thin'          // 细线 (1px)
  | 'medium'        // 中等 (2px)
  | 'thick'         // 粗线 (4px)
  | 'extra-thick'   // 超粗 (6px)

/**
 * Divider组件的基础属性接口
 */
export interface DividerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** 分割线方向 */
  orientation?: DividerOrientation
  /** 分割线粗细 */
  thickness?: DividerThickness
  /** 分割线圆角 */
  rounded?: boolean
  /** 分割线颜色 */
  color?: string
  /** 自定义类名 */
  className?: string
  /** 是否显示为虚线 */
  dashed?: boolean
  /** 分割线长度（百分比，仅对水平分割线有效） */
  length?: number
}

/**
 * Divider组件的ref类型
 */
export type DividerRef = HTMLDivElement
