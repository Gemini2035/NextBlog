import { getAllPosts, getAllTags, getFeaturedPost, getRecentPosts, getPostsByCategory, getCategories } from '@/lib/posts-adapter'
import { PostCard } from '@/components/Post'
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
  const featuredPost = getFeaturedPost(locale)
  const recentPosts = getRecentPosts(locale)
  const categories = getCategories()
  
  const t = await getTranslations('posts')

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900  mb-4">
            {t('allPosts')}
          </h1>
          <p className="text-gray-600 ">
            {t('totalPosts', { count: posts.length })}
          </p>
        </div>

        {/* 置顶文章 */}
        {featuredPost && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              {t('featuredPost')}
            </h2>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
              <PostCard post={featuredPost} featured={true} />
            </div>
          </div>
        )}

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

        {/* 技术分类 */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            {t('techCategories')}
          </h2>
          <div className="space-y-8">
            {categories.map((category) => {
              const categoryPosts = getPostsByCategory(category, locale)
              if (categoryPosts.length === 0) return null
              
              return (
                <div key={category} className="border border-gray-200 rounded-lg p-6 bg-white">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="mr-2">
                      {category === 'TypeScript' && '🔷'}
                      {category === 'Javascript' && '🟨'}
                      {category === 'NodeJs' && '🟢'}
                      {category === 'ReactJs' && '🔵'}
                      {category === 'VueJS' && '🟩'}
                      {category === '其它' && '📚'}
                    </span>
                    {category}
                    <span className="ml-2 text-sm font-normal text-gray-500">
                      ({t('postCount', { count: categoryPosts.length })})
                    </span>
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {categoryPosts.slice(0, 3).map((post) => (
                      <PostCard key={post._id} post={post} />
                    ))}
                  </div>
                  {categoryPosts.length > 3 && (
                    <div className="mt-4 text-center">
                      <span className="text-sm text-gray-500">
                        {t('morePosts', { count: categoryPosts.length - 3 })}
                      </span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

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
