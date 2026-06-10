'use client'

import { useMemo } from 'react'
import ReactMarkdown, { type Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import clsx from 'clsx'
import styles from './MarkdownRenderer.module.css'

export interface MarkdownAutoLinkTarget {
  label: string
  href: string
}

interface MarkdownRendererProps {
  content: string
  className?: string
  autoLinkTargets?: MarkdownAutoLinkTarget[]
}

const markdownComponents: Components = {
  a: ({ href, children }) => {
    const isExternalLink = typeof href === 'string' && /^https?:\/\//.test(href)

    return (
      <a
        href={href}
        rel={isExternalLink ? 'noreferrer' : undefined}
        target={isExternalLink ? '_blank' : undefined}
      >
        {children}
      </a>
    )
  },
}

const fencedCodeBlockPattern = /(^|\n)(`{3,}|~{3,})[^\n]*\n[\s\S]*?\n\2(?=\n|$)/g
const inlineProtectedPattern = /(!?\[[^\]\n]+\]\([^)]+\)|`+[^`]*`+)/g

const escapeMarkdownLinkText = (text: string) => {
  return text.replace(/([\\[\]])/g, '\\$1')
}

const escapeMarkdownHref = (href: string) => {
  return href.replace(/\s/g, '%20').replace(/\)/g, '%29')
}

const normalizeAutoLinkTargets = (targets: MarkdownAutoLinkTarget[]) => {
  const seenLabels = new Set<string>()

  return targets
    .map((target) => ({
      label: target.label.trim(),
      href: target.href.trim(),
    }))
    .filter((target) => target.label && target.href)
    .sort((left, right) => right.label.length - left.label.length)
    .filter((target) => {
      if (seenLabels.has(target.label)) {
        return false
      }

      seenLabels.add(target.label)
      return true
    })
}

const findNextTarget = (
  value: string,
  startIndex: number,
  targets: MarkdownAutoLinkTarget[]
) => {
  return targets.reduce<{
    index: number
    target: MarkdownAutoLinkTarget
  } | null>((current, target) => {
    const index = value.indexOf(target.label, startIndex)
    if (index === -1) {
      return current
    }

    if (!current || index < current.index) {
      return {
        index,
        target,
      }
    }

    return current
  }, null)
}

const linkPlainMarkdownText = (value: string, targets: MarkdownAutoLinkTarget[]) => {
  let result = ''
  let cursor = 0

  while (cursor < value.length) {
    const nextTarget = findNextTarget(value, cursor, targets)
    if (!nextTarget) {
      result += value.slice(cursor)
      break
    }

    const { index, target } = nextTarget
    result += value.slice(cursor, index)
    result += `[${escapeMarkdownLinkText(target.label)}](${escapeMarkdownHref(target.href)})`
    cursor = index + target.label.length
  }

  return result
}

const linkMarkdownInlineText = (value: string, targets: MarkdownAutoLinkTarget[]) => {
  let result = ''
  let cursor = 0

  for (const match of value.matchAll(inlineProtectedPattern)) {
    const index = match.index ?? 0
    result += linkPlainMarkdownText(value.slice(cursor, index), targets)
    result += match[0]
    cursor = index + match[0].length
  }

  result += linkPlainMarkdownText(value.slice(cursor), targets)
  return result
}

const applyMarkdownAutoLinks = (value: string, targets: MarkdownAutoLinkTarget[]) => {
  const normalizedTargets = normalizeAutoLinkTargets(targets)
  if (normalizedTargets.length === 0) {
    return value
  }

  let result = ''
  let cursor = 0

  for (const match of value.matchAll(fencedCodeBlockPattern)) {
    const index = match.index ?? 0
    result += linkMarkdownInlineText(value.slice(cursor, index), normalizedTargets)
    result += match[0]
    cursor = index + match[0].length
  }

  result += linkMarkdownInlineText(value.slice(cursor), normalizedTargets)
  return result
}

export function MarkdownRenderer({
  content,
  className,
  autoLinkTargets = [],
}: MarkdownRendererProps) {
  const markdownContent = useMemo(() => {
    return applyMarkdownAutoLinks(content, autoLinkTargets)
  }, [autoLinkTargets, content])

  return (
    <div className={clsx(styles.root, className)}>
      <ReactMarkdown components={markdownComponents} remarkPlugins={[remarkGfm]}>
        {markdownContent}
      </ReactMarkdown>
    </div>
  )
}
