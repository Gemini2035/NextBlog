import { StickyWrapper } from './StickyWrapper'
import type { Post } from '../../../../.contentlayer/generated'

interface RecentUpdatesSectionProps {
  recentPosts: Post[] | null | undefined
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
