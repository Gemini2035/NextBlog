'use client'

import { useMemo } from 'react'
import { Tree } from '@/ui'
import type { TreeNode } from '@/ui'
import type { SiteNavigationItem } from '@/types/site'

interface MobileNavProps {
  navigationItems: SiteNavigationItem[]
  onItemClick?: () => void
}

/**
 * 移动端导航菜单组件
 * 用于在 Drawer 中展示导航树结构
 */
export default function MobileNav({ navigationItems, onItemClick }: MobileNavProps) {
  // 转换为 Tree 数据结构
  const { treeData, allKeys } = useMemo((): { treeData: TreeNode[]; allKeys: string[] } => {
    const collected: string[] = []
    const collect = (k: string) => collected.push(k)

    const mapSub = (item: SiteNavigationItem): TreeNode => {
      const hasChildren = Array.isArray(item.items) && item.items.length > 0
      const node: TreeNode = {
        key: item.href,
        title: item.label,
        href: item.href,
        children: hasChildren ? item.items.map(child => mapSub(child)) : undefined,
      }
      collect(node.key)
      if (node.children) (node.children as TreeNode[]).forEach((c) => collect(c.key))
      return node
    }
    const data: TreeNode[] = navigationItems.map(nav => {
      const children = nav.items.map(item => mapSub(item))
      const node: TreeNode = {
        key: nav.key,
        title: nav.label,
        href: nav.href,
        children: children.length > 0 ? children : undefined
      }
      collect(node.key)
      if (children) (children as TreeNode[]).forEach((c) => collect(c.key))
      return node
    })
    return { treeData: data, allKeys: Array.from(new Set(collected)) }
  }, [navigationItems])

  return (
    <nav className="space-y-2">
      <Tree data={treeData} defaultExpandedKeys={allKeys} onSelect={onItemClick} collapsible />
    </nav>
  )
}
