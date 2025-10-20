import type { HTMLAttributes, ReactNode } from 'react'

export interface TreeNode {
  key: string
  title: ReactNode
  href?: string
  children?: TreeNode[]
}

export interface TreeProps extends Omit<HTMLAttributes<HTMLUListElement>, 'onSelect'> {
  data: TreeNode[]
  expandedKeys?: string[]
  defaultExpandedKeys?: string[]
  onExpand?: (keys: string[]) => void
  onSelect?: (key: string) => void
  /** 是否允许展开/收起，false 时默认全部展开且禁用切换 */
  collapsible?: boolean
  /**
   * 展示展开指示元素：
   * - true: 使用内置默认箭头
   * - false: 不展示任何指示元素
   * - ReactNode: 使用自定义指示元素
   */
  indicator?: boolean | ReactNode
}


