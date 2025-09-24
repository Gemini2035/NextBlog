import { ReactNode, ButtonHTMLAttributes, forwardRef } from 'react'

/**
 * Button组件的变体类型
 */
export type ButtonVariant = 
  | 'primary'     // 主要按钮
  | 'secondary'   // 次要按钮
  | 'outline'     // 轮廓按钮
  | 'ghost'       // 幽灵按钮
  | 'link'        // 链接按钮
  | 'danger'      // 危险按钮

/**
 * Button组件的尺寸类型
 */
export type ButtonSize = 
  | 'xs'          // 超小尺寸
  | 'sm'          // 小尺寸
  | 'md'          // 中等尺寸
  | 'lg'          // 大尺寸
  | 'xl'          // 超大尺寸

/**
 * Button组件的形状类型
 */
export type ButtonShape = 
  | 'default'     // 默认圆角
  | 'rounded'     // 圆角
  | 'pill'        // 胶囊形状
  | 'square'      // 方形

/**
 * Button组件的状态类型
 */
export type ButtonState = 
  | 'default'     // 默认状态
  | 'loading'     // 加载状态
  | 'disabled'    // 禁用状态
  | 'success'     // 成功状态
  | 'error'       // 错误状态

/**
 * Button组件的基础属性接口
 */
export interface ButtonBaseProps {
  /** 按钮变体 */
  variant?: ButtonVariant
  /** 按钮尺寸 */
  size?: ButtonSize
  /** 按钮形状 */
  shape?: ButtonShape
  /** 按钮状态 */
  state?: ButtonState
  /** 是否全宽 */
  fullWidth?: boolean
  /** 是否显示加载状态 */
  loading?: boolean
  /** 加载状态下的文本 */
  loadingText?: string
  /** 左侧图标 */
  leftIcon?: ReactNode
  /** 右侧图标 */
  rightIcon?: ReactNode
  /** 自定义类名 */
  className?: string
  /** 子元素 */
  children?: ReactNode
}

/**
 * Button组件的完整属性接口
 */
export interface ButtonProps 
  extends ButtonBaseProps, 
          Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'size' | 'children'> {
  /** 按钮类型 */
  type?: 'button' | 'submit' | 'reset'
  /** 点击事件处理器 */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
}

/**
 * Button组件的ref类型
 */
export type ButtonRef = HTMLButtonElement

/**
 * Button组件的主题配置接口
 */
export interface ButtonTheme {
  /** 基础样式 */
  base: string
  /** 变体样式 */
  variants: Record<ButtonVariant, string>
  /** 尺寸样式 */
  sizes: Record<ButtonSize, string>
  /** 形状样式 */
  shapes: Record<ButtonShape, string>
  /** 状态样式 */
  states: Record<ButtonState, string>
  /** 禁用状态样式 */
  disabled: string
  /** 加载状态样式 */
  loading: string
}
