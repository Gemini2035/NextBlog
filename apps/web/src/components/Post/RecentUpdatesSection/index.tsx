import { StickyWrapper } from './StickyWrapper'
import type { BlogPostListItem } from '@/types/blog'

interface RecentUpdatesSectionProps {
  recentPosts: BlogPostListItem[] | null | undefined
  title: string
}

export function RecentUpdatesSection({ recentPosts, title }: RecentUpdatesSectionProps) {
  if (!recentPosts || recentPosts.length === 0) {
    return null
  }

  return (
    <StickyWrapper 
      recentPosts={recentPosts}
      title={title}
    />
  )
}
