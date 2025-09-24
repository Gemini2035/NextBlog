import { ReactNode, ButtonHTMLAttributes } from 'react'

/**
 * Button组件的变体类型 - 简化版
 */
export type ButtonType = 
  | 'primary'     // 主要按钮
  | 'secondary'   // 次要按钮
  | 'outline'     // 轮廓按钮
  | 'ghost'       // 幽灵按钮
  | 'text'        // 文本按钮
  | 'danger'      // 危险按钮

/**
 * Button组件的尺寸类型 - 简化版
 */
export type ButtonSize = 
  | 'xs'          // 超小尺寸
  | 'sm'          // 小尺寸
  | 'md'          // 中等尺寸
  | 'lg'          // 大尺寸
  | 'xl'          // 超大尺寸


/**
 * Button组件的基础属性接口 - 简化版
 */
export interface ButtonProps 
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'size' | 'children' | 'type'> {
  /** 按钮变体 */
  type?: ButtonType
  /** 按钮尺寸 */
  size?: ButtonSize
  /** 是否圆角 */
  rounded?: boolean
  /** 是否禁用 */
  disabled?: boolean
  /** 是否显示加载状态 */
  loading?: boolean
  /** 自定义类名 */
  className?: string
  /** 子元素 */
  children?: ReactNode
  /** 按钮类型 */
  htmlType?: ButtonHTMLAttributes<HTMLButtonElement>['type']
}

/**
 * Button组件的ref类型
 */
export type ButtonRef = HTMLButtonElement