import { PostCard } from '../PostCard'
import { Slider } from '@/ui'
import type { Post } from '../../../../.contentlayer/generated'

interface StickyWrapperProps {
  recentPosts: Post[]
  title: string
}

export function StickyWrapper({ recentPosts, title }: StickyWrapperProps) {

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        {title}
      </h2>
      {recentPosts.length === 1 ? (
        <PostCard post={recentPosts[0]} />
      ) : (
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
      )}
    </div>
  )
}
