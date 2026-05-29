import { StickyWrapper } from './StickyWrapper'
import type { BlogPostListItem } from '@/types/blog'

interface AllPostsSectionProps {
  posts: BlogPostListItem[] | null | undefined
  title: string
  prevText?: string
  nextText?: string
  locale?: string
  initialTag?: string | null
}

export function AllPostsSection({ posts, title, prevText, nextText, locale, initialTag }: AllPostsSectionProps) {
  if (!posts || posts.length === 0) {
    return null
  }

  return (
    <StickyWrapper 
      posts={posts}
      title={title}
      prevText={prevText}
      nextText={nextText}
      locale={locale}
      initialTag={initialTag}
    />
  )
}
