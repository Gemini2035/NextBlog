'use client'

import { useCallback, useState } from 'react'
import { FileTextIcon } from '@/assets/icons'
import { Button, Drawer } from '@/ui'
import type { BlogPostDetail, BlogPostListItem } from '@/types/blog'
import { ContactButton } from './ContactButton'
import { PostContent, type PostHeading } from './PostContent'
import { PostInfoCard } from './PostInfoCard'
import { PostTableOfContents } from './PostTableOfContents'
import { RelatedPostsClient } from './RelatedPostsClient'

interface PostDetailLayoutProps {
  post: BlogPostDetail
  postId: string
  recommendations: BlogPostListItem[]
  recommendationCursor: number | null
}

export function PostDetailLayout({
  post,
  postId,
  recommendations,
  recommendationCursor,
}: PostDetailLayoutProps) {
  const [headings, setHeadings] = useState<PostHeading[]>([])
  const [tocOpen, setTocOpen] = useState(false)
  const hasHeadings = headings.length > 0
  const handleHeadingsChange = useCallback((nextHeadings: PostHeading[]) => {
    setHeadings(nextHeadings)
  }, [])

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <main className="min-w-0">
        <PostInfoCard post={post} />

        <PostContent content={post.content} onHeadingsChange={handleHeadingsChange} />

        <ContactButton postId={postId} title={post.title} />

        <RelatedPostsClient
          postId={postId}
          initialPosts={recommendations}
          initialCursor={recommendationCursor}
          limit={3}
        />
      </main>

      {hasHeadings && (
        <aside className="fixed left-[max(1.5rem,calc((100vw-56rem)/2-18rem))] top-1/2 z-30 hidden w-64 -translate-y-1/2 2xl:block">
          <PostTableOfContents headings={headings} variant="floating" />
        </aside>
      )}

      {hasHeadings && (
        <>
          <Button
            type="secondary"
            size="sm"
            className="fixed bottom-5 right-4 z-40 inline-flex items-center gap-2 rounded-[var(--site-radius-control)] border border-[var(--site-border)] bg-[var(--site-canvas)] px-4 py-2 shadow-[0_4px_12px_rgb(0_0_0_/_0.08)] 2xl:hidden"
            aria-label="打开文章目录"
            onClick={() => setTocOpen(true)}
          >
            <FileTextIcon className="h-4 w-4" />
            <span>目录</span>
          </Button>

          <Drawer
            open={tocOpen}
            onClose={() => setTocOpen(false)}
            placement="bottom"
            size="md"
            title="目录"
            className="2xl:hidden"
            bodyClassName="px-5 pb-6 pt-2"
            destroyOnClose
          >
            <PostTableOfContents
              headings={headings}
              onItemClick={() => setTocOpen(false)}
            />
          </Drawer>
        </>
      )}
    </div>
  )
}
