import { StickyWrapper } from './StickyWrapper'
import type { IBlogPost } from '@/types'

interface RecentUpdatesSectionProps {
  recentPosts: IBlogPost[] | null | undefined
  title: string
}

export function RecentUpdatesSection({ recentPosts, title }: RecentUpdatesSectionProps) {
  if (!recentPosts?.length) {
    return null
  }

  return (
    <StickyWrapper 
      recentPosts={recentPosts}
      title={title}
    />
  )
}
