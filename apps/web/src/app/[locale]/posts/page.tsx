import { BlogPostsPageClient } from '@/components/Post/BlogPostsPageClient'
import { serverHttpData } from '@/apis/server-http'
import { getSiteInit } from '@/apis/site/server'
import type { BlogPostsPayload } from '@/types/blog'

interface PostsPageProps {
  params: Promise<{
    locale: string
  }>
}

export default async function PostsPage({ params }: PostsPageProps) {
  const { locale } = await params
  const siteInit = await getSiteInit(locale)
  const payload = await serverHttpData<BlogPostsPayload>('/post', {
    headers: { 'X-Locale': locale },
    params: { pageSize: siteInit.siteConfig.postsPerPage ?? 6 },
  })

  return <BlogPostsPageClient posts={payload.posts} />
}
