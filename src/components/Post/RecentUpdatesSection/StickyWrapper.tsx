'use client'

import { PostCard } from '../PostCard'
import { Slider } from '@/ui'
import { useAnchorScroll } from '@/hooks'
import type { Post } from '../../../../.contentlayer/generated'

interface StickyWrapperProps {
  recentPosts: Post[]
  title: string
}

export function StickyWrapper({ recentPosts, title }: StickyWrapperProps) {
  // 使用通用锚点滚动hook
  useAnchorScroll({ anchorId: 'recent' })

  return (
    <div className="mb-12">
      <h2 id="recent" className="text-2xl font-bold text-gray-900 mb-6">
        {title}
      </h2>
      <div className="relative">
          <Slider
            items={recentPosts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
            itemsPerPage={3}
            slidePerPage={1}
            gap={24}
            showNavigation={recentPosts.length > 3}
            showIndicators={false}
            className="h-auto"
            itemContainerClassName="py-1"
          />
        </div>
    </div>
  )
}
