'use client'

import { useMemo, useState, useCallback } from 'react'
import type { TreeNode, TreeProps } from './types'
import { ChevronRightIcon } from '@/assets/icons'
import clsx from 'clsx'
import { motion, AnimatePresence } from 'framer-motion'
import Link from '../Link'

function TreeItem({ node, level, expanded, toggle, onSelect, collapsible, indicator }: {
  node: TreeNode
  level: number
  expanded: Set<string>
  toggle: (key: string) => void
  onSelect?: (key: string) => void
  collapsible: boolean
  indicator: boolean | React.ReactNode
}) {
  const isExpanded = expanded.has(node.key)
  const hasChildren = !!(node.children && node.children.length)

  return (
    <motion.li
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.12, ease: 'easeInOut' }}
    >
      <div
        className={clsx('flex items-center select-none')}
        style={{ paddingLeft: level * 16 }}
      >
        {hasChildren && indicator !== false ? (
          <button
            onClick={() => collapsible && toggle(node.key)}
            className="p-2 -ml-2 rounded-md hover:bg-gray-100 active:bg-gray-200 transition-colors"
            aria-expanded={isExpanded}
            disabled={!collapsible}
          >
            {indicator === true || indicator === undefined ? (
              <ChevronRightIcon className={clsx('h-4 w-4 text-gray-500 transition-transform', isExpanded && 'rotate-90')} />
            ) : (
              indicator
            )}
          </button>
        ) : (
          <span className={indicator !== false ? 'w-6' : 'w-0'} />
        )}
        {node.href ? (
          <Link
            href={node.href}
            className="py-2 flex-1 text-gray-900 hover:text-gray-800"
            onClick={() => onSelect?.(node.key)}
          >
            {node.title}
          </Link>
        ) : (
          <span className="py-2 flex-1 text-gray-900">{node.title}</span>
        )}
      </div>

      <AnimatePresence initial={false}>
        {hasChildren && isExpanded && (
          <motion.ul
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18, ease: 'easeInOut' }}
            className={indicator !== false ? 'pl-4 border-l border-gray-100' : ''}
          >
            {node.children!.map(child => (
              <TreeItem
                key={child.key}
                node={child}
                level={level + 1}
                expanded={expanded}
                toggle={toggle}
                onSelect={onSelect}
                collapsible={collapsible}
                indicator={indicator}
              />
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.li>
  )
}

export default function Tree({ data, expandedKeys, defaultExpandedKeys, onExpand, onSelect, className, collapsible = true, indicator = true }: TreeProps) {
  const [internalExpanded, setInternalExpanded] = useState<Set<string>>(
    () => new Set(
      collapsible ? (defaultExpandedKeys ?? []) : collectAllKeys(data)
    )
  )

  const expanded = useMemo(() => {
    return expandedKeys ? new Set(expandedKeys) : internalExpanded
  }, [expandedKeys, internalExpanded])

  const toggle = useCallback((key: string) => {
    const next = new Set(expanded)
    if (next.has(key)) next.delete(key)
    else next.add(key)

    if (!expandedKeys && collapsible) setInternalExpanded(next)
    onExpand?.(Array.from(next))
  }, [expanded, expandedKeys, onExpand, collapsible])

  return (
    <motion.ul
      className={clsx('space-y-1', className)}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.04 } }
      }}
    >
      {data.map(node => (
        <TreeItem key={node.key} node={node} level={0} expanded={expanded} toggle={toggle} onSelect={onSelect} collapsible={collapsible} indicator={indicator} />
      ))}
    </motion.ul>
  )
}

function collectAllKeys(nodes: TreeNode[] = []): string[] {
  const keys: string[] = []
  const walk = (arr: TreeNode[]) => {
    for (const n of arr) {
      keys.push(n.key)
      if (n.children && n.children.length) walk(n.children)
    }
  }
  walk(nodes)
  return keys
}


