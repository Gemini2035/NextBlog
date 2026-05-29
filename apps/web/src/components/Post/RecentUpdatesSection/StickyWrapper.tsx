'use client'

import { PostCard } from '../PostCard'
import { Slider } from '@/ui'
import { useAnchorScroll } from '@/hooks'
import { useTranslations } from 'next-intl'
import type { BlogPostListItem } from '@/types/blog'

interface StickyWrapperProps {
  recentPosts: BlogPostListItem[]
  title: string
}

export function StickyWrapper({ recentPosts, title }: StickyWrapperProps) {
  const t = useTranslations('Posts')
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
              <PostCard key={post.id} post={post} />
            ))}
            itemsPerPage={3}
            slidePerPage={1}
            gap={24}
            showNavigation={recentPosts.length > 3}
            showIndicators={false}
            className="h-auto"
            itemContainerClassName="py-1"
            previousPageLabel={t('previousPage')}
            nextPageLabel={t('nextPage')}
            goToPageLabel={t('goToPage', { page: '{page}' })}
          />
        </div>
    </div>
  )
}
