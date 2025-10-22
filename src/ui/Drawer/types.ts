import { ReactNode, HTMLAttributes } from 'react'

/**
 * Drawer 组件的位置类型
 */
export type DrawerPlacement = 
  | 'top'       // 从顶部展开
  | 'right'     // 从右侧展开
  | 'bottom'    // 从底部展开
  | 'left'      // 从左侧展开

/**
 * Drawer 组件的尺寸类型
 */
export type DrawerSize = 
  | 'sm'        // 小尺寸 (256px)
  | 'md'        // 中等尺寸 (378px)
  | 'lg'        // 大尺寸 (736px)
  | 'full'      // 全屏

/**
 * Drawer 组件的属性接口
 */
export interface DrawerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** 是否可见 */
  open?: boolean
  /** 标题 */
  title?: ReactNode
  /** 放置位置 */
  placement?: DrawerPlacement
  /** 尺寸 */
  size?: DrawerSize
  /** 是否显示遮罩 */
  mask?: boolean
  /** 点击遮罩是否关闭 */
  maskClosable?: boolean
  /** 是否显示关闭按钮 */
  closable?: boolean
  /** 关闭按钮文本 */
  closeIcon?: ReactNode
  /** 是否在关闭时销毁子元素 */
  destroyOnClose?: boolean
  /** 自定义类名 */
  className?: string
  /** 遮罩样式类名 */
  maskClassName?: string
  /** 内容区域类名 */
  bodyClassName?: string
  /** 头部区域类名 */
  headerClassName?: string
  /** 底部区域类名 */
  footerClassName?: string
  /** 子元素 */
  children?: ReactNode
  /** 底部内容 */
  footer?: ReactNode
  /** 额外的操作按钮 */
  extra?: ReactNode
  /** 关闭回调 */
  onClose?: () => void
  /** 打开后的回调 */
  afterOpenChange?: (open: boolean) => void
  /** z-index */
  zIndex?: number
}

/**
 * Drawer 组件的 ref 类型
 */
export type DrawerRef = HTMLDivElement


