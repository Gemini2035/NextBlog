import { ReactNode, HTMLAttributes } from 'react'

/**
 * 卡片阴影级别类型
 */
export type CardShadow = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

/**
 * 卡片边框粗细类型
 */
export type CardBorder = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

/**
 * Card组件的基础属性接口
 */
export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** 是否显示圆角，默认为false（直角） */
  rounded?: boolean
  /** 卡片阴影级别，默认为none（无阴影） */
  shadow?: CardShadow
  /** 卡片边框粗细，默认为none（无边框） */
  border?: CardBorder
  /** 是否禁用hover特效，默认为false（启用hover） */
  disabledHover?: boolean
  /** 自定义CSS类名 */
  className?: string
  /** 卡片内容 */
  children?: ReactNode
}

/**
 * Card组件的ref类型
 */
export type CardRef = HTMLDivElement
