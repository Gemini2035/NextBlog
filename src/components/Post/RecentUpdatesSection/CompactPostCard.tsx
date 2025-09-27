import { Link, Card, Tag } from '@/ui'
import type { Post } from '../../../../.contentlayer/generated'
import { formatDate } from '@/utils'

interface CompactPostCardProps {
  post: Post
  featured?: boolean
}

export default function CompactPostCard({ post, featured = false }: CompactPostCardProps) {
  return (
    <Card 
      shadow="sm" 
      rounded 
    >
      <Link 
        href={post.url}
        className="block h-full"
      >
        <div className="flex flex-col h-full p-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
              {post.title}
            </h3>
            
            <div className="text-xs text-gray-500 mb-3">
              <time dateTime={post.date}>
                {formatDate(post.date)}
              </time>
              {post.updatedAt && post.updatedAt !== post.date && (
                <div className="text-xs text-gray-400 mt-1">
                  更新于 {formatDate(post.updatedAt)}
                </div>
              )}
            </div>
          </div>
          
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {post.tags.slice(0, 2).map((tag: string) => (
                <Tag key={tag} size="sm" className="text-xs px-2 py-1">
                  {tag}
                </Tag>
              ))}
              {post.tags.length > 2 && (
                <span className="text-xs text-gray-400 px-2 py-1">
                  +{post.tags.length - 2}
                </span>
              )}
            </div>
          )}
        </div>
      </Link>
    </Card>
  )
}
