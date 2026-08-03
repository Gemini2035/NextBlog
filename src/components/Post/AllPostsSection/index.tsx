import { StickyWrapper } from './StickyWrapper'
import type { BlogPostListItem } from '@/types/blog'

interface AllPostsSectionProps {
  posts: BlogPostListItem[] | null | undefined
  total?: number
  page?: number
  pageSize?: number
  totalPages?: number
  title: string
  prevText?: string
  nextText?: string
  locale?: string
  initialTag?: string | null
}

export function AllPostsSection({
  posts,
  total,
  page,
  pageSize,
  totalPages,
  title,
  prevText,
  nextText,
  locale,
  initialTag,
}: AllPostsSectionProps) {
  if (!posts || posts.length === 0) {
    return null
  }

  return (
    <StickyWrapper 
      posts={posts}
      initialTotal={total}
      initialPage={page}
      initialPageSize={pageSize}
      initialTotalPages={totalPages}
      title={title}
      prevText={prevText}
      nextText={nextText}
      locale={locale}
      initialTag={initialTag}
    />
  )
}
