import { StickyWrapper } from './StickyWrapper'
import type { IBlogPost } from '@/types'

interface AllPostsSectionProps {
  posts: IBlogPost[] | null | undefined
  title: string
  prevText?: string
  nextText?: string
  locale?: string
  initialTag?: string | null
}

export function AllPostsSection({ posts, title, prevText, nextText, locale, initialTag }: AllPostsSectionProps) {
  if (!posts?.length) {
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
