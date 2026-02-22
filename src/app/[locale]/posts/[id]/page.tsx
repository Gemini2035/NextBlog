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

export async function generateMetadata({ params }: PostPageProps) {
  const { id } = await params
  const post = await getPostById(id)
  if (!post) {
    return { title: '文章未找到' }
  }
  return {
    title: post.title,
    description: post.description ?? undefined,
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const { id } = await params
  const post = await getPostById(id)

  if (!post) {
    notFound()
  }

  const MDXContent = post.bodyCode
    ? getMDXComponent(post.bodyCode)
    : () => <pre className="whitespace-pre-wrap">{post.bodyRaw}</pre>

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

        <RelatedPosts post={post} limit={3} />
      </div>
    </>
  )
}
