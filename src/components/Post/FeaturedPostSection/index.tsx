

import { StickyWrapper } from './StickyWrapper'
import type { Post } from '../../../../.contentlayer/generated'

interface FeaturedPostSectionProps {
  featuredPosts: Post[] | null | undefined
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
