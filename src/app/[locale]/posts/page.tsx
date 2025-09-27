import { getAllPosts, getAllTags, getFeaturedPosts, getRecentPosts } from '@/lib/posts-adapter'
import { PostCard, FeaturedPostSection } from '@/components/Post'
import { getTranslations } from 'next-intl/server'

interface PostsPageProps {
  params: Promise<{
    locale: string
  }>
}

export default async function PostsPage({ params }: PostsPageProps) {
  const { locale } = await params
  const posts = getAllPosts(locale)
  const tags = getAllTags(locale)
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
              共 {posts.length} 篇文章
            </span>
          </div>
        </div>

        {/* 置顶文章 */}
        <FeaturedPostSection 
          featuredPosts={featuredPosts.length > 0 ? featuredPosts : null} 
          title={t('featuredPost')} 
        />

        {/* 最新文章 */}
        {recentPosts.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              {t('recentPosts')}
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({t('updatedThisWeek', { count: recentPosts.length })})
              </span>
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {recentPosts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          </div>
        )}


        {/* 所有标签 */}
        {tags.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900  mb-4">
              {t('allTags')}
            </h2>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-blue-100  text-blue-800  text-sm rounded-full hover:bg-blue-200  transition-colors cursor-pointer"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 所有文章 */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="mr-2">📖</span>
            {t('allPosts')}
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        </div>

        {posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500  text-lg">
              {t('noPosts')}
            </p>
          </div>
        )}
    </div>
  )
}
