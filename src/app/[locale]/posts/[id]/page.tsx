import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { serverHttpData } from '@/apis/http'
import { RouteLoadingMask } from '@/components/RouteLoadingMask'
import { PostDetailLayout } from '@/components/Post'
import type { BlogPostDetailPayload, BlogPostRecommendationsPayload } from '@/types/blog'

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
  const postPayloadPromise = serverHttpData<BlogPostDetailPayload>(`/post/${id}`, {
    headers: { 'X-Locale': locale },
  }).catch(() => null)

  const [payload, recommendationsPayload] = await Promise.all([
    postPayloadPromise,
    serverHttpData<BlogPostRecommendationsPayload>(`/post/${id}/recommendations`, {
      headers: { 'X-Locale': locale },
      params: { limit: 3 },
    }).catch(() => null),
  ])
  const post = payload?.post
  
  if (!post) {
    notFound()
  }

  return (
    <PostDetailLayout
      post={post}
      postId={id}
      recommendations={recommendationsPayload?.items ?? []}
      recommendationCursor={recommendationsPayload?.cursor ?? null}
    />
  )
}

export default function PostPage({ params }: PostPageProps) {
  return (
    <Suspense fallback={<RouteLoadingMask />}>
      <PostPageContent params={params} />
    </Suspense>
  )
}
