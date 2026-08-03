import { Suspense } from 'react'
import { BlogPostsPageClient } from '@/components/Post/BlogPostsPageClient'
import { serverHttpData } from '@/apis/http'
import { getSiteInit } from '@/apis/site/server'
import { RouteLoadingMask } from '@/components/RouteLoadingMask'
import type { BlogPostsPayload } from '@/types/blog'

interface PostsPageProps {
  params: Promise<{
    locale: string
  }>
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

const getSearchParam = (
  searchParams: Record<string, string | string[] | undefined>,
  key: string,
) => {
  const value = searchParams[key]
  return Array.isArray(value) ? value[0] : value
}

const getPostQueryParams = (
  searchParams: Record<string, string | string[] | undefined>,
  pageSize: number,
) => {
  const keyword = getSearchParam(searchParams, 'keyword') ?? getSearchParam(searchParams, 'search')
  const tag = getSearchParam(searchParams, 'tag')
  const featured = getSearchParam(searchParams, 'featured')
  const sort = getSearchParam(searchParams, 'sort')

  return {
    keyword,
    tag,
    featured: featured === undefined ? undefined : featured === 'true',
    sort,
    page: 1,
    pageSize,
  }
}

async function PostsPageContent({ params, searchParams }: PostsPageProps) {
  const { locale } = await params
  const resolvedSearchParams = await searchParams
  const siteInit = await getSiteInit(locale)
  const pageSize = siteInit.siteConfig.postsPerPage ?? 6
  const payload = await serverHttpData<BlogPostsPayload>('/post', {
    headers: { 'X-Locale': locale },
    params: getPostQueryParams(resolvedSearchParams ?? {}, pageSize),
  })

  return <BlogPostsPageClient payload={payload} />
}

export default function PostsPage({ params, searchParams }: PostsPageProps) {
  return (
    <Suspense fallback={<RouteLoadingMask />}>
      <PostsPageContent params={params} searchParams={searchParams} />
    </Suspense>
  )
}
