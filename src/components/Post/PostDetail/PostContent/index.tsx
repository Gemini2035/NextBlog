'use client'

import DOMPurify from 'dompurify'
import parse, {
  attributesToProps,
  domToReact,
  Element as ParserElement,
  Text as ParserText,
  type HTMLReactParserOptions,
} from 'html-react-parser'
import { useEffect, useMemo, useState, type AnchorHTMLAttributes, type ReactNode } from 'react'
import { resolveResourceUrl } from '@/apis/resources'
import { isExternalWebHref, mergeLinkRel } from '@/utils/link'
import { PostContentCodeBlock } from './PostContentCodeBlock'
import { PostContentImage } from './PostContentImage'
import styles from './PostContent.module.css'

interface PostContentProps {
  content: string
  frameless?: boolean
}

const sanitizePostContent = (content: string) => {
  return DOMPurify.sanitize(content, {
    ADD_ATTR: ['decoding', 'loading'],
    FORBID_ATTR: ['style'],
  })
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

export function PostContent({ content, frameless = false }: PostContentProps) {
  const [nodes, setNodes] = useState<ReactNode>(null)
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
    setNodes(parse(sanitizePostContent(content), options))
  }, [content, options])

  return (
    <article
      className={frameless ? `${styles.article} ${styles.framelessArticle}` : styles.article}
      data-article-content
    >
      <div className={styles.content}>{nodes}</div>
    </article>
  )
}
