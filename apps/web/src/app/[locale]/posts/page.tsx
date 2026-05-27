import { BlogPostsPageClient } from '@/components/Post/BlogPostsPageClient'
import { serverHttpData } from '@/apis/server-http'
import { POSTS_PER_PAGE } from '@/constants'
import type { BlogPostsPayload } from '@/types/blog'

interface PostsPageProps {
  params: Promise<{
    locale: string
  }>
}

export default async function PostsPage({ params }: PostsPageProps) {
  const { locale } = await params
  const payload = await serverHttpData<BlogPostsPayload>('/post', {
    headers: { 'X-Site-Language': locale },
    params: { pageSize: POSTS_PER_PAGE },
  })

  return <BlogPostsPageClient posts={payload.posts} />
}
