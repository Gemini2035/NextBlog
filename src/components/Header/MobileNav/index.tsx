'use client'

import { useMemo } from 'react'
import { NavigationItem, SubmenuItem } from '@/constants'
import { Tree } from '@/ui'
import type { TreeNode } from '@/ui'
import { useTranslations } from 'next-intl'

interface MobileNavProps {
  navigationItems: NavigationItem[]
  onItemClick?: () => void
}

/**
 * 移动端导航菜单组件
 * 用于在 Drawer 中展示导航树结构
 */
export default function MobileNav({ navigationItems, onItemClick }: MobileNavProps) {
  const t = useTranslations('Navigation')

  // 转换为 Tree 数据结构
  const { treeData, allKeys } = useMemo((): { treeData: TreeNode[]; allKeys: string[] } => {
    const collected: string[] = []
    const collect = (k: string) => collected.push(k)

    const mapSub = (item: SubmenuItem, parentIsFeatured: boolean = false): TreeNode => {
      const hasChildren = Array.isArray(item.items) && item.items.length > 0
      const isFeaturedGroup = item.label === 'Featured Articles'
      const isLeaf = !hasChildren
      const node: TreeNode = {
        key: item.href,
        // 仅当“父级”为 Featured Articles 时，叶子节点不翻译，直接展示原标题
        title: isLeaf
          ? (parentIsFeatured ? item.label : t(item.label, { defaultMessage: item.label }))
          : t(item.label, { defaultMessage: item.label }),
        href: item.href,
        children: hasChildren ? item.items!.map(child => mapSub(child, isFeaturedGroup || parentIsFeatured)) : undefined,
      }
      collect(node.key)
      if (node.children) (node.children as TreeNode[]).forEach((c) => collect(c.key))
      return node
    }
    const data: TreeNode[] = navigationItems.map(nav => {
      const children = nav.submenu?.items?.map(item => mapSub(item, false))
      const node: TreeNode = {
        key: nav.type,
        title: t(nav.label, { defaultMessage: nav.label }),
        href: nav.href,
        children
      }
      collect(node.key)
      if (children) (children as TreeNode[]).forEach((c) => collect(c.key))
      return node
    })
    return { treeData: data, allKeys: Array.from(new Set(collected)) }
  }, [navigationItems, t])

  return (
    <nav className="space-y-2">
      <Tree data={treeData} defaultExpandedKeys={allKeys} onSelect={onItemClick} collapsible />
    </nav>
  )
}


