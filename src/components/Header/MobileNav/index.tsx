'use client'

import { useMemo, useState, useCallback } from 'react'
import { NavigationItem, SubmenuItem } from '@/constants'
import { Link, Tree } from '@/ui'
import type { TreeNode } from '@/ui'
import { ChevronRightIcon } from '@/assets/icons'
import { useTranslations } from 'next-intl'
import { cn } from '@/utils'

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
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  // 切换展开/收起状态
  const toggleExpand = useCallback((itemType: string) => {
    setExpandedItems(prev => 
      prev.includes(itemType) 
        ? prev.filter(id => id !== itemType)
        : [...prev, itemType]
    )
  }, [])

  // 渲染子菜单项
  const renderSubmenuItem = (item: SubmenuItem, depth: number = 0) => {
    const hasChildren = item.items && item.items.length > 0
    const isExpanded = expandedItems.includes(item.href)

    if (hasChildren) {
      return (
        <div key={item.href} className={cn('mb-2', depth > 0 && 'ml-4')}>
          <button
            onClick={() => toggleExpand(item.href)}
            className={cn(
              'w-full flex items-center justify-between px-4 py-3 text-left rounded-lg transition-all duration-200',
              'hover:bg-gray-100 active:bg-gray-200',
              isExpanded && 'bg-gray-50'
            )}
          >
            <div className="flex-1">
              <div className="font-medium text-gray-900">{t(item.label)}</div>
              {item.description && (
                <div className="text-sm text-gray-600 mt-1">{t(item.description)}</div>
              )}
            </div>
            <ChevronRightIcon 
              className={cn(
                'w-5 h-5 text-gray-400 transition-transform duration-200',
                isExpanded && 'rotate-90'
              )}
            />
          </button>
          {isExpanded && item.items && (
            <div className="mt-2 space-y-1">
              {item.items.map(child => renderSubmenuItem(child, depth + 1))}
            </div>
          )}
        </div>
      )
    }

    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={onItemClick}
        className={cn(
          'block px-4 py-3 rounded-lg transition-all duration-200',
          'hover:bg-gray-100 active:bg-gray-200',
          depth > 0 && 'ml-4'
        )}
      >
        <div className="font-medium text-gray-900">{t(item.label)}</div>
        {item.description && (
          <div className="text-sm text-gray-600 mt-1">{t(item.description)}</div>
        )}
      </Link>
    )
  }

  // 渲染导航项
  const renderNavigationItem = (navItem: NavigationItem) => {
    const hasSubmenu = navItem.submenu && navItem.submenu.items && navItem.submenu.items.length > 0
    const isExpanded = expandedItems.includes(navItem.type)

    return (
      <div key={navItem.type} className="mb-2">
        {hasSubmenu ? (
          <>
            <button
              onClick={() => toggleExpand(navItem.type)}
              className={cn(
                'w-full flex items-center justify-between px-4 py-3 text-left rounded-lg transition-all duration-200',
                'hover:bg-gray-100 active:bg-gray-200',
                'text-lg font-semibold text-gray-900',
                isExpanded && 'bg-gray-50'
              )}
            >
              <span>{t(navItem.label)}</span>
              <ChevronRightIcon 
                className={cn(
                  'w-5 h-5 text-gray-400 transition-transform duration-200',
                  isExpanded && 'rotate-90'
                )}
              />
            </button>
            {isExpanded && navItem?.submenu?.items && (
              <div className="mt-2 space-y-1 pl-2">
                {navItem.submenu.items.map(item => renderSubmenuItem(item))}
              </div>
            )}
          </>
        ) : (
          <Link
            href={navItem.href}
            onClick={onItemClick}
            className="block px-4 py-3 rounded-lg text-lg font-semibold text-gray-900 hover:bg-gray-100 active:bg-gray-200 transition-all duration-200"
          >
            {t(navItem.label)}
          </Link>
        )}
      </div>
    )
  }

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


