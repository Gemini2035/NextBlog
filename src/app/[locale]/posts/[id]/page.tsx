import { notFound } from 'next/navigation'
import { getPostById } from '@/services'
import { getMDXComponent } from 'next-contentlayer2/hooks'
import { PostInfoCard, RelatedPosts, ContactButton } from '@/components/Post'

interface PostPageProps {
  params: Promise<{
    locale: string
    id: string
  }>
}

export default async function PostPage({ params }: PostPageProps) {
  const { id, locale } = await params
  const post = await getPostById(id)

  if (!post) {
    notFound()
  }

  const content = post.content as { raw?: string; code?: string } | null
  const hasCode = content?.code && typeof content.code === 'string'
  const MDXContent = hasCode
    ? getMDXComponent(content!.code!)
    : () => (
        <pre className="whitespace-pre-wrap font-sans text-inherit">
          {content?.raw ?? ''}
        </pre>
      )

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
          postId={post.id}
          locale={locale}
          displayCount={3}
        />
      </div>
    </>
  )
}
