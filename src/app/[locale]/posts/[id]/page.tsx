import { notFound } from 'next/navigation'
import { getMDXComponent } from 'next-contentlayer2/hooks'
import { PostInfoCard, RelatedPosts, ContactButton } from '@/components/Post'
import type { IBlogPost } from '@/types'
import { graphqlRequest } from '@/graphql/client'
import {
  POST_DETAIL_QUERY,
  RELATED_POSTS_QUERY,
  mapGqlPostToBlogPost,
  mapGqlRelatedPostToBlogPost,
  type PostDetailResult,
  type RelatedPostsResult,
} from '@/graphql/operations'

interface PostPageProps {
  params: Promise<{
    locale: string
    id: string
  }>
}

export default async function PostPage({ params }: PostPageProps) {
  const { id, locale } = await params

  const [detailResult, relatedResult] = await Promise.all([
    graphqlRequest<PostDetailResult>(POST_DETAIL_QUERY, { id }),
    graphqlRequest<RelatedPostsResult>(RELATED_POSTS_QUERY, {
      id,
      limit: 6,
    }, { locale }),
  ])

  const post: IBlogPost | null = detailResult.post ? mapGqlPostToBlogPost(detailResult.post) : null

  if (!post) {
    notFound()
  }

  const content = post.content
  const code = content?.code
  const hasCode = typeof code === 'string'
  const MDXContent = hasCode
    ? getMDXComponent(code)
    : () => (
        <pre className="whitespace-pre-wrap font-sans text-inherit">
          {content?.raw ?? ''}
        </pre>
      )

  const relatedPosts: IBlogPost[] = relatedResult.relatedPosts.map(mapGqlRelatedPostToBlogPost)

  return (
    <>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PostInfoCard post={post} />

        <article className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8 mt-8">
          <div className="prose prose-lg max-w-none">
            <MDXContent />
          </div>
        </article>

        <ContactButton />

        <RelatedPosts
          relatedPosts={relatedPosts}
          displayCount={3}
        />
      </div>
    </>
  )
}
