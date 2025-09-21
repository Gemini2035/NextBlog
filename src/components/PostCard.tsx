import Link from 'next/link'
import type { Post } from '../../.contentlayer/generated'
import { formatDate, truncateText } from '@/utils'

interface PostCardProps {
  post: Post
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <article className="bg-white  rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6">
      <div className="flex flex-col h-full">
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-900  mb-2">
            <Link 
              href={post.url}
              className="hover:text-blue-600  transition-colors"
            >
              {post.title}
            </Link>
          </h2>
          
          {post.description && (
            <p className="text-gray-600  mb-4 line-clamp-3">
              {truncateText(post.description, 120)}
            </p>
          )}
          
          <div className="flex items-center text-sm text-gray-500  mb-4">
            <time dateTime={post.date}>
              {formatDate(post.date)}
            </time>
          </div>
        </div>
        
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {post.tags.map((tag: string) => (
              <span
                key={tag}
                className="px-2 py-1 bg-blue-100  text-blue-800  text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  )
}
