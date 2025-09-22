import Link from 'next/link'
import { getAllPosts } from '@/lib/posts'
import PostCard from '@/components/PostCard'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function Home() {
  const posts = getAllPosts().slice(0, 3) // 只显示最新的3篇文章

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            欢迎来到我的博客
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            分享技术见解、开发经验和生活感悟。使用 Next.js + Contentlayer + MDX + Tailwind 构建。
          </p>
        </div>

        {/* Latest Posts */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            最新文章
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              查看更多文章
            </h3>
            <p className="text-gray-600 mb-6">
              探索更多技术文章和开发经验分享
            </p>
            <Link
              href="/posts"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              浏览所有文章
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
