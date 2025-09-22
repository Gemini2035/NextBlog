import { getAllPosts, getAllTags, getFeaturedPost, getRecentPosts, getPostsByCategory, getCategories } from '@/lib/posts'
import PostCard from '@/components/PostCard'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function PostsPage() {
  const posts = getAllPosts()
  const tags = getAllTags()
  const featuredPost = getFeaturedPost()
  const recentPosts = getRecentPosts()
  const categories = getCategories()

  return (
    <div className="min-h-screen bg-gray-50 ">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900  mb-4">
            所有文章
          </h1>
          <p className="text-gray-600 ">
            共 {posts.length} 篇文章
          </p>
        </div>

        {/* 置顶文章 */}
        {featuredPost && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              置顶文章
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
              最新文章
              <span className="ml-2 text-sm font-normal text-gray-500">
                (最近一周更新，共 {recentPosts.length} 篇)
              </span>
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {recentPosts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          </div>
        )}

        {/* 技术分类 */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            技术分类
          </h2>
          <div className="space-y-8">
            {categories.map((category) => {
              const categoryPosts = getPostsByCategory(category)
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
                      ({categoryPosts.length} 篇)
                    </span>
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {categoryPosts.slice(0, 3).map((post) => (
                      <PostCard key={post.slug} post={post} />
                    ))}
                  </div>
                  {categoryPosts.length > 3 && (
                    <div className="mt-4 text-center">
                      <span className="text-sm text-gray-500">
                        还有 {categoryPosts.length - 3} 篇文章...
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
              所有标签
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
            所有文章
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </div>

        {posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500  text-lg">
              暂无文章
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
