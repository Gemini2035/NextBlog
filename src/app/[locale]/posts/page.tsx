import { getAllPosts, getFeaturedPosts, getRecentPosts } from '@/lib/posts-adapter'
import { FeaturedPostSection, RecentUpdatesSection, AllPostsSection } from '@/components/Post'
import { getTranslations } from 'next-intl/server'

interface PostsPageProps {
  params: Promise<{
    locale: string
  }>
}

export default async function PostsPage({ params }: PostsPageProps) {
  const { locale } = await params
  
  const posts = getAllPosts(locale)
  const featuredPosts = getFeaturedPosts(locale)
  const recentPosts = getRecentPosts(locale)
  
  const t = await getTranslations('Posts')

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
          title={`${t('recentPosts')} (${t('updatedThisWeek', { count: recentPosts.length })})`} 
        />

        {/* 所有文章 */}
        <AllPostsSection 
          posts={posts.length > 0 ? posts : null} 
          title={t('articleList')}
          prevText={t('prevPage')}
          nextText={t('nextPage')}
          locale={locale}
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
