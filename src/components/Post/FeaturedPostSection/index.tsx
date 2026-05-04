import { StickyWrapper } from './StickyWrapper'
import type { IBlogPost } from '@/types'

interface FeaturedPostSectionProps {
  featuredPosts: IBlogPost[] | null | undefined
  title: string
}

export function FeaturedPostSection({ featuredPosts, title }: FeaturedPostSectionProps) {
  if (!featuredPosts?.length) {
    return null
  }

  return (
    <StickyWrapper 
      featuredPosts={featuredPosts}
      title={title}
    />
  )
}
