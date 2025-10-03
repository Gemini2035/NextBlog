'use client'

import HomeSectionSkeleton from '../HomeSectionSkeleton'
import { Link } from '@/ui'
import { useTranslations } from 'next-intl'
import { usePosts } from '@/hooks/usePosts'
import { useEffect, useState } from 'react'
import { cn } from '@/utils'
import { FloatingPost } from './FloatingPost'
import { PostIcon } from '@/assets/icons/PostIcon'
import type { Post } from '.contentlayer/generated'

interface BlogSectionProps {
  index: number
  href: string
}

export default function BlogSection({ index, href }: BlogSectionProps) {
  const t = useTranslations('HomePage')
  const { getRecentPosts, getAllPosts } = usePosts()
  const [floatingPosts, setFloatingPosts] = useState<Post[]>([])
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  useEffect(() => {
    const recentPosts = getRecentPosts()
    const allPosts = getAllPosts()
    
    // 优先显示最近更新的文章，如果不足6篇则补充最新的文章
    let postsToShow = recentPosts.slice(0, 6)
    
    if (postsToShow.length < 6) {
      const remainingCount = 6 - postsToShow.length
      const usedSlugs = new Set(postsToShow.map(post => post.slug))
      const additionalPosts = allPosts
        .filter(post => !usedSlugs.has(post.slug))
        .slice(0, remainingCount)
      postsToShow = [...postsToShow, ...additionalPosts]
    }
    
    // 确保总是显示6篇文章（如果总文章数足够的话）
    if (postsToShow.length < 6 && allPosts.length >= 6) {
      postsToShow = allPosts.slice(0, 6)
    }
    
    setFloatingPosts(postsToShow)
  }, [getRecentPosts, getAllPosts])

  return (
    <HomeSectionSkeleton index={index}>
      {/* 突破padding限制的飘动容器 */}
      {floatingPosts.length > 0 && (
        <div className={cn(
          'absolute inset-0 w-full h-full overflow-hidden hidden lg:block pointer-events-none'
        )}>
          <div className="relative w-full h-full">
            {floatingPosts.map((post, idx) => (
              <FloatingPost
                key={post.slug}
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

      {/* 主要内容区域 */}
      <div className="relative max-w-6xl mx-auto">
        <div className="max-w-3xl">
          <h2 className={cn(
            'text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight'
          )}>
            {t('blogTitle', { default: '博客' })}
          </h2>
          <p className={cn(
            'mt-4 sm:mt-6 text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300/90'
          )}>
            {t('blogIntro', { default: '我的文章，分享我学习的技术与见解' })}
          </p>

          <div className="mt-8 sm:mt-10">
            <Link
              href={href}
              className={cn(
                'inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold',
                'shadow-sm focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2',
                'bg-gray-900 text-white hover:bg-black focus-visible:outline-gray-900'
              )}
            >
              <span>{t('viewMore', { default: '了解更多' })}</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M7 17L17 7M17 7H8M17 7V16" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>

        {/* 移动端显示的文章预览 */}
        {floatingPosts.length > 0 && (
          <div className="mt-8 lg:hidden">
            <div className={cn(
              'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2'
            )}>
              {floatingPosts.slice(0, 6).map((post) => (
                <div key={post.slug} className={cn(
                  'bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-lg',
                  'border border-gray-200/50 dark:border-gray-700/50 p-2.5'
                )}>
                  <Link href={post.url} className="block">
                    <div className="flex items-center gap-2">
                      <div className="flex-shrink-0 w-4 h-4">
                        <PostIcon />
                      </div>
                      <h3 className="text-xs font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 leading-tight">
                        {post.title}
                      </h3>
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

 