'use client'

import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import xml from 'highlight.js/lib/languages/xml'
import { useEffect, useState } from 'react'
import { CopyIcon } from '@/assets/icons/CopyIcon'
import { message } from '@/ui'
import styles from './PostContent.module.css'

interface PostContentCodeBlockProps {
  code: string
  language?: string
}

const supportedLanguages = new Set(['html', 'xml', 'javascript', 'js', 'typescript', 'ts', 'jsx', 'tsx'])

hljs.registerLanguage('html', xml)
hljs.registerLanguage('xml', xml)
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('js', javascript)
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('ts', typescript)
hljs.registerLanguage('jsx', javascript)
hljs.registerLanguage('tsx', typescript)

const escapeHtml = (value: string) => {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

const trimTrailingNewline = (value: string) => {
  return value.endsWith('\n') ? value.slice(0, -1) : value
}

const normalizeLanguage = (language?: string) => {
  const normalizedLanguage = language
    ?.replace(/^language-/, '')
    .trim()
    .toLowerCase()

  if (!normalizedLanguage) {
    return 'html'
  }

  return supportedLanguages.has(normalizedLanguage) ? normalizedLanguage : 'html'
}

const highlightCode = (code: string, language?: string) => {
  const normalizedLanguage = normalizeLanguage(language)

  try {
    return hljs.highlight(code || ' ', {
      ignoreIllegals: true,
      language: normalizedLanguage,
    }).value
  } catch {
    return escapeHtml(code || ' ')
  }
}

const splitCodeLines = (code: string) => {
  return trimTrailingNewline(code).split('\n')
}

const copyText = async (value: string) => {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value)
    return
  }

  const textarea = document.createElement('textarea')
  textarea.value = value
  textarea.setAttribute('readonly', '')
  textarea.style.position = 'fixed'
  textarea.style.top = '-9999px'
  document.body.appendChild(textarea)
  textarea.select()
  document.execCommand('copy')
  document.body.removeChild(textarea)
}

export function PostContentCodeBlock({ code, language }: PostContentCodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const lines = splitCodeLines(code)
  const highlightedCode = highlightCode(trimTrailingNewline(code), language)

  useEffect(() => {
    if (!copied) {
      return
    }

    const timer = window.setTimeout(() => setCopied(false), 1600)
    return () => window.clearTimeout(timer)
  }, [copied])

  const handleCopy = async () => {
    try {
      await copyText(code)
      setCopied(true)
      message.success('复制成功')
    } catch {
      setCopied(false)
      message.error('复制失败')
    }
  }

  return (
    <figure className={styles.codeBlock}>
      <figcaption className={styles.codeBlockTitle}>代码块</figcaption>
      <button
        aria-label={copied ? '已复制代码' : '复制代码'}
        className={styles.codeCopyButton}
        onClick={handleCopy}
        title={copied ? '已复制' : '复制代码'}
        type="button"
      >
        <CopyIcon className={styles.codeCopyIcon} />
      </button>
      <pre className={styles.codeBlockPre}>
        <span aria-hidden="true" className={styles.codeLineNumbers}>
          {lines.map((_, index) => (
            <span className={styles.codeLineNumber} key={index}>
              {index + 1}
            </span>
          ))}
        </span>
        <code
          className={styles.codeBlockCode}
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
        />
      </pre>
    </figure>
  )
}
