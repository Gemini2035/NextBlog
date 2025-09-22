import { notFound } from 'next/navigation'
import { getPostBySlugAndLocale, getAllPosts } from '@/lib/posts'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { getMDXComponent } from 'next-contentlayer2/hooks'

interface PostPageProps {
  params: Promise<{
    locale: string
    slug: string
  }>
}

export async function generateStaticParams() {
  const posts = getAllPosts()
  
  const params = []
  const locales = ['zh', 'en', 'ja']
  
  for (const locale of locales) {
    for (const post of posts) {
      params.push({
        locale,
        slug: post.slug,
      })
    }
  }
  
  return params
}

export async function generateMetadata({ params }: PostPageProps) {
  const { locale, slug } = await params
  const post = getPostBySlugAndLocale(slug, locale)
  
  if (!post) {
    return {
      title: '文章未找到',
    }
  }

  return {
    title: post.title,
    description: post.description,
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const { locale, slug } = await params
  const post = getPostBySlugAndLocale(slug, locale)
  
  if (!post) {
    notFound()
  }

  const MDXContent = getMDXComponent(post.body.code)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <article className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          {/* 文章头部 */}
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString('zh-CN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
              
              {post.updatedAt && (
                <span>
                  更新于 {new Date(post.updatedAt).toLocaleDateString('zh-CN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              )}
            </div>
            
            {post.description && (
              <p className="text-lg text-gray-700 mb-6">
                {post.description}
              </p>
            )}
            
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </header>
          
          {/* 文章内容 */}
          <div className="prose prose-lg max-w-none">
            <MDXContent />
          </div>
        </article>
      </main>
      
      <Footer />
    </div>
  )
}
