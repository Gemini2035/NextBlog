import { ReactNode } from 'react'

/**
 * Slider组件的属性接口
 */
export interface SliderProps {
  /** 传入的节点列表 */
  items: ReactNode[]
  /** 每页显示的item个数 */
  itemsPerPage: number
  /** 每次滑动移动的item个数 */
  slidePerPage: number
  /** 第一个元素距离视窗最左边的距离 */
  paddingLeft?: number
  /** 是否显示导航按钮 */
  showNavigation?: boolean
  /** 是否显示指示器 */
  showIndicators?: boolean
  /** 是否自动播放 */
  autoPlay?: boolean
  /** 自动播放间隔时间（毫秒） */
  autoPlayInterval?: number
  /** 是否循环播放 */
  loop?: boolean
  /** 自定义类名 */
  className?: string
  /** 自定义样式 */
  style?: React.CSSProperties
  /** 导航按钮点击事件 */
  onSlideChange?: (currentIndex: number) => void
}

/**
 * Slider组件的引用类型
 */
export interface SliderRef {
  /** 滑动到指定索引 */
  slideTo: (index: number) => void
  /** 滑动到下一页 */
  slideNext: () => void
  /** 滑动到上一页 */
  slidePrev: () => void
  /** 获取当前索引 */
  getCurrentIndex: () => number
  /** 获取总页数 */
  getTotalPages: () => number
}

/**
 * 导航按钮的方向
 */
export type NavigationDirection = 'left' | 'right'

/**
 * 导航按钮的样式变体
 */
export type NavigationVariant = 'default' | 'outline' | 'ghost'

/**
 * 指示器的样式变体
 */
export type IndicatorVariant = 'dot' | 'number' | 'line'
