import { PostCard } from '../PostCard'
import type { Post } from '../../../../.contentlayer/generated'

interface FeaturedPostSectionProps {
  featuredPost: Post | null | undefined
  title: string
}

export function FeaturedPostSection({ featuredPost, title }: FeaturedPostSectionProps) {
  if (!featuredPost) {
    return null
  }

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        {title}
      </h2>
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
        <PostCard post={featuredPost} featured={true} />
      </div>
    </div>
  )
}
