import { Link } from '@/ui'
import { getAllPosts } from '@/lib/posts-adapter'
import { PostCard } from '@/components/Post'
import { useTranslations } from 'next-intl'

export default function Home() {
  const posts = getAllPosts().slice(0, 3) // 只显示最新的3篇文章
  const t = useTranslations('HomePage')

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('welcome')}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('description')}
          </p>
        </div>

        {/* Latest Posts */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {t('latestPosts')}
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              {t('viewMorePosts')}
            </h3>
            <p className="text-gray-600 mb-6">
              {t('exploreMore')}
            </p>
            <Link
              href="/posts"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              {t('browseAllPosts')}
            </Link>
          </div>
        </section>
    </div>
  )
}
