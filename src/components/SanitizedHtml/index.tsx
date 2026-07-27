'use client'

import DOMPurify from 'dompurify'
import { useMemo, type HTMLAttributes } from 'react'
import { cn } from '@/utils'
import styles from './SanitizedHtml.module.css'

interface SanitizedHtmlProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'dangerouslySetInnerHTML'> {
  html?: string | null
}

export function SanitizedHtml({ html, className, ...props }: SanitizedHtmlProps) {
  const sanitizedHtml = useMemo(() => {
    const value = html ?? ''
    const sanitize = typeof DOMPurify?.sanitize === 'function' ? DOMPurify.sanitize.bind(DOMPurify) : null

    return sanitize ? sanitize(value) : value
  }, [html])

  return (
    <div
      {...props}
      className={cn(
        className?.split(/\s+/).some((token) => token === 'prose' || token.startsWith('prose-')) && styles.prose,
        className
      )}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  )
}
