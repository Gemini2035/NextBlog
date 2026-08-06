'use client'

import DOMPurify from 'dompurify'
import parse, {
  attributesToProps,
  domToReact,
  Element as ParserElement,
  Text as ParserText,
  type HTMLReactParserOptions,
} from 'html-react-parser'
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type AnchorHTMLAttributes,
  type ReactNode,
} from 'react'
import { resolveResourceUrl } from '@/apis/resources'
import { useLayoutHeights } from '@/hooks'
import { smoothScrollToElement } from '@/utils'
import { isExternalWebHref, mergeLinkRel } from '@/utils/link'
import { PostContentCodeBlock } from './PostContentCodeBlock'
import { PostContentImage } from './PostContentImage'
import styles from './PostContent.module.css'

export interface PostHeading {
  id: string
  title: string
  level: 2 | 3 | 4
}

interface PostContentProps {
  content: string
  frameless?: boolean
  onHeadingsChange?: (headings: PostHeading[]) => void
}

const sanitizePostContent = (content: string) => {
  return DOMPurify.sanitize(content, {
    ADD_ATTR: ['decoding', 'loading'],
    FORBID_ATTR: ['style'],
  })
}

const headingSelector = 'h2, h3, h4'

const createHeadingId = (text: string, index: number) => {
  const slug = text
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/[^\p{L}\p{N}-]/gu, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')

  return slug || `section-${index + 1}`
}

const createUniqueHeadingId = (baseId: string, usedIds: Map<string, number>) => {
  const count = usedIds.get(baseId) ?? 0
  usedIds.set(baseId, count + 1)

  if (count === 0) {
    return baseId
  }

  return `${baseId}-${count + 1}`
}

const preparePostContent = (content: string) => {
  const sanitizedContent = sanitizePostContent(content)
  const document = new DOMParser().parseFromString(sanitizedContent, 'text/html')
  const usedIds = new Map<string, number>()
  const headings: PostHeading[] = []

  document.querySelectorAll<HTMLHeadingElement>(headingSelector).forEach((heading, index) => {
    const title = heading.textContent?.trim().replace(/\s+/g, ' ') ?? ''

    if (!title) {
      return
    }

    const existingId = heading.id.trim()
    const baseId = existingId || createHeadingId(title, index)
    const id = createUniqueHeadingId(baseId, usedIds)
    const level = Number(heading.tagName.slice(1)) as PostHeading['level']

    heading.id = id
    headings.push({ id, title, level })
  })

  return {
    html: document.body.innerHTML,
    headings,
  }
}

const getCurrentHashId = () => {
  const hash = window.location.hash.slice(1)

  if (!hash) {
    return ''
  }

  try {
    return decodeURIComponent(hash)
  } catch {
    return hash
  }
}

const isParserElement = (node: unknown): node is ParserElement => {
  return node instanceof ParserElement
}

const isParserText = (node: unknown): node is ParserText => {
  return node instanceof ParserText
}

const getTextContent = (node: unknown): string => {
  if (isParserText(node)) {
    return node.data
  }

  if (!isParserElement(node)) {
    return ''
  }

  return node.children.map((child) => getTextContent(child)).join('')
}

const getCodeElement = (node: ParserElement) => {
  return node.children.find((child): child is ParserElement => {
    return isParserElement(child) && child.name === 'code'
  })
}

const getCodeLanguage = (codeElement?: ParserElement) => {
  return codeElement?.attribs.class
    ?.split(/\s+/)
    .find((className) => className.startsWith('language-'))
}

export function PostContent({ content, frameless = false, onHeadingsChange }: PostContentProps) {
  const [nodes, setNodes] = useState<ReactNode>(null)
  const { headerHeight } = useLayoutHeights()
  const headerHeightRef = useRef(headerHeight)
  const options = useMemo<HTMLReactParserOptions>(() => {
    const parserOptions: HTMLReactParserOptions = {
      replace: (node) => {
        if (!isParserElement(node)) {
          return undefined
        }

        if (node.name === 'pre') {
          const codeElement = getCodeElement(node)
          return (
            <PostContentCodeBlock
              code={getTextContent(codeElement ?? node)}
              language={getCodeLanguage(codeElement)}
            />
          )
        }

        if (node.name === 'a') {
          const props = attributesToProps(node.attribs) as AnchorHTMLAttributes<HTMLAnchorElement>
          const href = typeof props.href === 'string' ? props.href : undefined
          const target = isExternalWebHref(href) ? '_blank' : props.target
          const rel = target === '_blank' ? mergeLinkRel(props.rel, 'noopener', 'noreferrer') : props.rel

          return (
            <a {...props} href={href} rel={rel} target={target}>
              {domToReact(node.children as Parameters<typeof domToReact>[0], parserOptions)}
            </a>
          )
        }

        if (node.name !== 'img') {
          return undefined
        }

        const {
          alt = '',
          class: className,
          decoding = 'async',
          height,
          loading = 'lazy',
          src = '',
          title,
          width,
        } = node.attribs

        return (
          <PostContentImage
            alt={alt}
            className={className}
            decoding={decoding}
            height={height}
            loading={loading}
            src={resolveResourceUrl(src)}
            title={title}
            width={width}
          />
        )
      },
    }

    return parserOptions
  }, [])

  useEffect(() => {
    headerHeightRef.current = headerHeight
  }, [headerHeight])

  useEffect(() => {
    const { html, headings } = preparePostContent(content)
    const hashId = getCurrentHashId()

    setNodes(parse(html, options))
    onHeadingsChange?.(headings)

    const timeoutId = window.setTimeout(() => {
      const element = hashId ? document.getElementById(hashId) : null

      if (element) {
        smoothScrollToElement(element, headerHeightRef.current + 16, 'auto')
      }
    }, 100)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [content, onHeadingsChange, options])

  return (
    <article
      className={frameless ? `${styles.article} ${styles.framelessArticle}` : styles.article}
      data-article-content
    >
      <div className={styles.content}>{nodes}</div>
    </article>
  )
}
