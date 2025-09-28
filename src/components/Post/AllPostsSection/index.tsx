import { StickyWrapper } from './StickyWrapper'
import type { Post } from '../../../../.contentlayer/generated'

interface AllPostsSectionProps {
  posts: Post[] | null | undefined
  title: string
  prevText?: string
  nextText?: string
}

export function AllPostsSection({ posts, title, prevText, nextText }: AllPostsSectionProps) {
  if (!posts || posts.length === 0) {
    return null
  }

  return (
    <StickyWrapper 
      posts={posts}
      title={title}
      prevText={prevText}
      nextText={nextText}
    />
  )
}
