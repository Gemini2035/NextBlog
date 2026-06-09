import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { serverHttpData } from '@/apis/http'
import { getSiteInit } from '@/apis/site/server'
import { RouteLoadingMask } from '@/components/RouteLoadingMask'
import { PostInfoCard, RelatedPostsClient, ContactButton } from '@/components/Post'
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
      headers: { 'X-Locale': locale },
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

async function PostPageContent({ params }: PostPageProps) {
  const { id, locale } = await params
  const siteInitPromise = getSiteInit(locale)
  const postPayloadPromise = serverHttpData<BlogPostDetailPayload>(`/post/${id}`, {
    headers: { 'X-Locale': locale },
  }).catch(() => null)

  const siteInit = await siteInitPromise
  const [payload, postsPayload] = await Promise.all([
    postPayloadPromise,
    serverHttpData<BlogPostsPayload>('/post', {
      headers: { 'X-Locale': locale },
      params: { pageSize: siteInit.siteConfig.postsPerPage ?? 6 },
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
        
        {/* AI article support entry */}
        <ContactButton postId={id} title={post.title} />
        
        {/* 相关文章 */}
        <RelatedPostsClient post={post} posts={postsPayload?.posts ?? []} limit={3} />
      </div>
    </>
  )
}

export default function PostPage({ params }: PostPageProps) {
  return (
    <Suspense fallback={<RouteLoadingMask />}>
      <PostPageContent params={params} />
    </Suspense>
  )
}
