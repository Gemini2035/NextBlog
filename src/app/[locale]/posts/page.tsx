import { graphqlRequest } from '@/graphql/client'
import {
  POST_LIST_QUERY,
  FEATURED_POSTS_QUERY,
  RECENT_POSTS_QUERY,
  mapGqlListPostToBlogPost,
  type PostListResult,
  type FeaturedPostsResult,
  type RecentPostsResult,
} from '@/graphql/operations'
import { PostsPageClient } from '@/components/Post'

interface PostsPageProps {
  params: Promise<{ locale: string }>
}

export default async function PostsPage({ params }: PostsPageProps) {
  const { locale } = await params

  const [listResult, featuredResult, recentResult] = await Promise.all([
    graphqlRequest<PostListResult>(POST_LIST_QUERY, {
      locale,
      page: 1,
      pageSize: 500,
    }),
    graphqlRequest<FeaturedPostsResult>(FEATURED_POSTS_QUERY, { locale }),
    graphqlRequest<RecentPostsResult>(RECENT_POSTS_QUERY, { locale, limit: 10 }),
  ])

  const posts = listResult.postsList.list.map(mapGqlListPostToBlogPost)
  const featuredPosts = featuredResult.featuredPosts.map(mapGqlListPostToBlogPost)
  const recentPosts = recentResult.recentPosts.map(mapGqlListPostToBlogPost)

  return (
    <PostsPageClient
      posts={posts}
      featuredPosts={featuredPosts}
      recentPosts={recentPosts}
      locale={locale}
    />
  )
}
