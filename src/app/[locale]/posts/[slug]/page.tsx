import { notFound } from 'next/navigation'
import { getPostBySlugAndLocale, getAllPosts } from '@/lib/posts-adapter'
import { getMDXComponent } from 'next-contentlayer2/hooks'
import { PostInfoCard, RelatedPosts } from '@/components/Post'

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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 文章信息卡片 - 初始显示在顶部 */}
      <PostInfoCard post={post} />
      
      {/* 文章内容 */}
      <article className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mt-8">
        <div className="prose prose-lg max-w-none">
          <MDXContent />
        </div>
      </article>
      
      {/* 相关文章 */}
      <RelatedPosts post={post} limit={3} />
    </div>
  )
}
