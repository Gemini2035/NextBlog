import { serverHttpData } from '@/apis/http'
import { AgentChatPage } from '@/components/Agent'
import type { BlogPostDetailPayload } from '@/types/blog'

interface ArticleSupportAgentPageProps {
  params: Promise<{
    locale: string
  }>
  searchParams: Promise<{
    postId?: string
    targetPostId?: string
    target_post?: string
    question?: string
  }>
}

export default async function ArticleSupportAgentPage({
  params,
  searchParams,
}: ArticleSupportAgentPageProps) {
  const [{ locale }, { postId, targetPostId, target_post, question }] = await Promise.all([
    params,
    searchParams,
  ])
  const resolvedTargetPost = target_post ?? targetPostId ?? postId
  const targetPostPayload = resolvedTargetPost
    ? await serverHttpData<BlogPostDetailPayload>(`/post/${resolvedTargetPost}`, {
        headers: { 'X-Locale': locale },
      }).catch(() => null)
    : null

  return (
    <AgentChatPage
      agentType="article_support"
      initialQuestion={question}
      targetPostId={resolvedTargetPost}
      targetPostTitle={targetPostPayload?.post.title}
    />
  )
}
