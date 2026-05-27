import { notFound } from 'next/navigation'
import { serverHttpData } from '@/apis/server-http'
import { PostInfoCard, RelatedPostsClient, ContactButton } from '@/components/Post'
import { POSTS_PER_PAGE } from '@/constants'
import type { BlogPostDetailPayload, BlogPostsPayload } from '@/types/blog'

interface PostPageProps {
  params: Promise<{
    locale: string
    id: string
  }>
}

export async function generateMetadata({ params }: PostPageProps) {
  const { id, locale } = await params

  try {
    const payload = await serverHttpData<BlogPostDetailPayload>(`/post/${id}`, {
      headers: { 'X-Site-Language': locale },
    })
    const post = payload.post

    return {
      title: post.title,
      description: post.description,
    }
  } catch {
    return {
      title: '文章未找到',
    }
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const { id, locale } = await params
  const [payload, postsPayload] = await Promise.all([
    serverHttpData<BlogPostDetailPayload>(`/post/${id}`, {
      headers: { 'X-Site-Language': locale },
    }).catch(() => null),
    serverHttpData<BlogPostsPayload>('/post', {
      headers: { 'X-Site-Language': locale },
      params: { pageSize: POSTS_PER_PAGE },
    }).catch(() => null),
  ])
  const post = payload?.post
  
  if (!post) {
    notFound()
  }

  return (
    <>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 文章信息卡片 - 初始显示在顶部 */}
        <PostInfoCard post={post} />
        
        {/* 文章内容 */}
        <article className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8 mt-8">
          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
        
        {/* 联系按钮 - 移动端显示在这里，桌面端固定显示 */}
        <ContactButton />
        
        {/* 相关文章 */}
        <RelatedPostsClient post={post} posts={postsPayload?.posts ?? []} limit={3} />
      </div>
    </>
  )
}
