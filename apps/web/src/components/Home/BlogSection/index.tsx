'use client'

import HomeSectionSkeleton from '../HomeSectionSkeleton'
import { Link, Button } from '@/ui'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { cn } from '@/utils'
import { FloatingPost } from './FloatingPost'
import { StarFilledIcon, ClockIcon, FileTextIcon, TagIcon, ArrowRightIcon } from '@/assets/icons'
import { PostIcon } from '@/assets/icons/PostIcon'
import type { HomePostsPayload } from '@/types/home'
import type { SiteNavigationItem } from '@/types/site'

interface BlogSectionProps {
  index: number
  item: SiteNavigationItem
  posts: HomePostsPayload
}

const getNavigationIcon = (item: SiteNavigationItem) => {
  const { dynamicDataKey, href } = item

  if (dynamicDataKey === 'posts.featured' || href.includes('featured')) {
    return StarFilledIcon
  }
  if (dynamicDataKey === 'posts.recent' || href.includes('recent')) {
    return ClockIcon
  }
  return FileTextIcon
}

export default function BlogSection({ index, item, posts }: BlogSectionProps) {
  const t = useTranslations('HomePage')
  const { description, href, id, items } = item
  const { floating: floatingPosts, popularTags } = posts
  const blogDescription = description || 'Explore my latest technical insights and development experience'
  const navigationLinks = [
    ...items,
    {
      ...item,
      id: id * -1,
      label: t('allArticles', { default: '所有文章' }),
      description: null,
      items: [],
      dynamicDataKey: null,
    },
  ]
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <HomeSectionSkeleton index={index}>
      {/* Floating container that extends beyond the section padding. */}
      {floatingPosts.length > 0 && (
        <div className={cn(
          'absolute inset-y-0 left-0 right-0 w-full h-full overflow-hidden hidden lg:block pointer-events-none'
        )}>
          <div className="relative w-full h-full">
            {floatingPosts.map((post, idx) => (
              <FloatingPost
                key={post.id}
                post={post}
                index={idx}
                total={floatingPosts.length}
                hoveredIndex={hoveredIndex}
                onMouseEnter={setHoveredIndex}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Main content area that extends beyond the section padding. */}
      <div className="relative max-w-6xl mx-auto -ml-6 sm:-ml-10 lg:-ml-16">
        <div className="max-w-3xl pl-6 sm:pl-10 lg:pl-16">
          <h2 className={cn(
            'text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-blue-800'
          )}>
            {t('blogTitle', { default: '博客' })}
          </h2>
          <p className={cn(
            'mt-4 sm:mt-6 text-base sm:text-lg lg:text-xl text-blue-600'
          )}>
            {blogDescription}
          </p>

          {/* Blog category links */}
          <div className="mt-8 sm:mt-10">
            <div className="flex flex-wrap gap-3 mb-6">
              {navigationLinks.map((navigationItem) => {
                const { id, href, label } = navigationItem
                const Icon = getNavigationIcon(navigationItem)

                return (
                  <Link
                    key={`${id}-${href}`}
                    href={href}
                    className={cn(
                      'inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium',
                      'bg-blue-200 text-blue-800 hover:bg-blue-300 transition-colors',
                      'border border-blue-300 hover:border-blue-400'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{label}</span>
                  </Link>
                )
              })}
            </div>

            {/* Popular tag links */}
            {popularTags.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-blue-600 mb-3">
                  {t('popularTags', { default: '热门标签' })}:
                </p>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/posts?tag=${encodeURIComponent(tag)}`}
                      className={cn(
                        'inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-medium',
                        'bg-blue-100 text-blue-700 hover:bg-blue-200 hover:text-blue-800 transition-colors',
                        'border border-blue-200 hover:border-blue-300'
                      )}
                    >
                      <TagIcon className="w-3 h-3" />
                      <span>{tag}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Primary CTA */}
            <div className="mt-8">
              <Link href={href}>
                <Button
                  type="primary"
                  size="sm"
                  rounded={true}
                  className="inline-flex items-center gap-2 bg-blue-800 text-white hover:bg-blue-900 focus-visible:outline-blue-800 border border-blue-600 hover:border-blue-700"
                >
                  <span>{t('viewMore', { default: '了解更多' })}</span>
                  <ArrowRightIcon className="w-4 h-4" strokeWidth={1.8} />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile post previews */}
        {floatingPosts.length > 0 && (
          <div className="mt-8 lg:hidden">
            <div className={cn(
              'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2'
            )}>
              {floatingPosts.slice(0, 6).map(({ id, title }) => (
                <div key={id} className={cn(
                  'bg-blue-50/90 backdrop-blur-sm rounded-lg shadow-lg',
                  'border border-blue-200/60 p-2.5'
                )}>
                  <Link href={`/posts/${id}`} className="block">
                    <div className="flex items-center gap-2">
                      <div className="flex-shrink-0 w-4 h-4 flex items-center justify-center">
                        <PostIcon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0 flex items-center">
                        <h3 className="text-xs font-semibold text-blue-800 line-clamp-2 leading-tight">
                          {title}
                        </h3>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </HomeSectionSkeleton>
  )
}

 
