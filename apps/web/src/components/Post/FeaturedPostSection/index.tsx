

import { StickyWrapper } from './StickyWrapper'
import type { BlogPostListItem } from '@/types/blog'

interface FeaturedPostSectionProps {
  featuredPosts: BlogPostListItem[] | null | undefined
  title: string
}

export function FeaturedPostSection({ featuredPosts, title }: FeaturedPostSectionProps) {
  if (!featuredPosts || featuredPosts.length === 0) {
    return null
  }

  return (
    <StickyWrapper 
      featuredPosts={featuredPosts}
      title={title}
    />
  )
}
