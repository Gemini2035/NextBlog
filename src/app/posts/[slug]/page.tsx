import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPostBySlug, getAllPosts } from '@/lib/posts'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useMDXComponent } from 'next-contentlayer2/hooks'
import { MDXProvider } from '@mdx-js/react'
import type { Post } from '../../../../.contentlayer/generated'

interface PostPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  return <PostContent post={post} />
}

function PostContent({ post }: { post: Post }) {
  const MDXContent = useMDXComponent(post.body.code)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <article className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          {/* Article Header */}
          <div className="p-8 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {post.title}
            </h1>
            
            {post.description && (
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
                {post.description}
              </p>
            )}
            
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString('zh-CN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
            </div>
            
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          
          {/* Article Content */}
          <div className="p-8">
            <div className="prose prose-lg max-w-none dark:prose-invert">
              <MDXProvider>
                <MDXContent />
              </MDXProvider>
            </div>
          </div>
        </article>
        
        {/* Navigation */}
        <div className="mt-8 flex justify-between">
          <Link
            href="/posts"
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            ← 返回文章列表
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}
