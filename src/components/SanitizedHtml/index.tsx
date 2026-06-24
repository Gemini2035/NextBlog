'use client'

import DOMPurify from 'dompurify'
import { useMemo, type HTMLAttributes } from 'react'

interface SanitizedHtmlProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'dangerouslySetInnerHTML'> {
  html?: string | null
}

export function SanitizedHtml({ html, ...props }: SanitizedHtmlProps) {
  const sanitizedHtml = useMemo(() => {
    const value = html ?? ''
    const sanitize = typeof DOMPurify?.sanitize === 'function' ? DOMPurify.sanitize.bind(DOMPurify) : null

    return sanitize ? sanitize(value) : value
  }, [html])

  return (
    <div
      {...props}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  )
}
