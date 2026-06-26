'use client'

import { SanitizedHtml } from '@/components/SanitizedHtml'
import { resolveResourceUrl } from '@/apis/resources'
import type { BlogPostImage } from '@/types/blog'
import styles from './PostContent.module.css'

interface PostContentProps {
  content: string
  images?: Record<string, BlogPostImage>
}

const IMAGE_TOKEN_PATTERN = /\[(post_image_[a-zA-Z0-9_-]+)\]/g

const escapeHtml = (value: string) => {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

const renderImageHtml = (slotKey: string, image?: BlogPostImage) => {
  if (!image) {
    return `<span class="${styles.postImageFallback}">${escapeHtml(slotKey)}</span>`
  }

  const src = resolveResourceUrl(image.url)
  if (!src) {
    return `<span class="${styles.postImageFallback}">${escapeHtml(slotKey)}</span>`
  }

  const width = image.width ? ` width="${image.width}"` : ''
  const height = image.height ? ` height="${image.height}"` : ''
  const title = image.caption || image.alt

  return [
    `<span class="${styles.postImage}" data-slot-key="${escapeHtml(slotKey)}">`,
    `<span class="${styles.postImageCard}">`,
    `<span class="${styles.postImagePreview}">`,
    `<img class="${styles.postImagePreviewImage}" src="${escapeHtml(src)}" alt="${escapeHtml(image.alt ?? '')}"${title ? ` title="${escapeHtml(title)}"` : ''}${width}${height} loading="lazy" decoding="async" />`,
    '</span>',
    '</span>',
    '</span>',
  ].join('')
}

export function PostContent({ content, images = {} }: PostContentProps) {
  const renderedContent = content.replace(IMAGE_TOKEN_PATTERN, (_, slotKey: string) => renderImageHtml(slotKey, images[slotKey]))

  return (
    <article className={styles.article} data-article-content>
      <SanitizedHtml className={styles.content} html={renderedContent} />
    </article>
  )
}
