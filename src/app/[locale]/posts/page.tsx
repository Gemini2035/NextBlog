'use client'

import { useEffect, useState, use } from 'react'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { getAllPosts, getFeaturedPosts, getRecentPosts } from '@/services/posts'
import { FeaturedPostSection, RecentUpdatesSection, AllPostsSection } from '@/components/Post'
import type { Post } from '.contentlayer/generated'
import { IBlogPost } from '@/types'

interface PostsPageProps {
  params: Promise<{
    locale: string
  }>
}

export default function PostsPage({ params }: PostsPageProps) {
  const { locale } = use(params)
  const searchParams = useSearchParams()
  const t = useTranslations('Posts')
  
  const [posts, setPosts] = useState<IBlogPost[]>([])
  const [featuredPosts, setFeaturedPosts] = useState<IBlogPost[]>([])
  const [recentPosts, setRecentPosts] = useState<IBlogPost[]>([])
  const [initialTag, setInitialTag] = useState<string | null>(null)
  
  // 初始化数据
  useEffect(() => {
    const [allPosts, featuredPosts, recentPosts] = await Promise.all([
      getAllPosts(locale),
      getFeaturedPosts(locale),
      getRecentPosts(locale),
    ])
    
    setPosts(allPosts)
    setFeaturedPosts(featuredPosts)
    setRecentPosts(recentPosts)
    
    // 从URL参数中获取tag
    const tagParam = searchParams.get('tag')
    if (tagParam) {
      setInitialTag(tagParam) // Next.js的useSearchParams已经自动解码
    }
  }, [locale, searchParams])

  // 当有URL参数时，自动滚动到筛选器位置
  useEffect(() => {
    const hasParams = searchParams.toString().length > 0
    if (hasParams) {
      setTimeout(() => {
        const allPostsElement = document.getElementById('all-posts')
        if (allPostsElement) {
          const rect = allPostsElement.getBoundingClientRect()
          const scrollTop = window.scrollY + rect.top - 100 // 预留100px空间
          window.scrollTo({ top: Math.max(0, scrollTop), behavior: 'smooth' })
        }
      }, 300)
    }
  }, [searchParams])

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-baseline gap-3 mb-4">
            <h1 className="text-3xl font-bold text-gray-900">
              {t('allPosts')}
            </h1>
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {t('totalPosts', { count: posts.length })}
            </span>
          </div>
        </div>

        {/* 置顶文章 */}
        <FeaturedPostSection 
          featuredPosts={featuredPosts.length > 0 ? featuredPosts : null} 
          title={t('featuredPost')} 
        />

        {/* 最近更新文章 */}
        <RecentUpdatesSection 
          recentPosts={recentPosts.length > 0 ? recentPosts : null} 
          title={`${t('recentPosts')} (${t('updatedThisMonth', { count: recentPosts.length })})`} 
        />

        {/* 所有文章 */}
        <AllPostsSection 
          posts={posts.length > 0 ? posts : null} 
          title={t('articleList')}
          prevText={t('prevPage')}
          nextText={t('nextPage')}
          locale={locale}
          initialTag={initialTag}
        />

        {posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {t('noPosts')}
            </p>
          </div>
        )}
    </div>
  )
}
