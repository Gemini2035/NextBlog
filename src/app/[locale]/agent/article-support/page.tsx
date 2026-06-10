import { AgentChatPage } from '@/components/Agent'

interface ArticleSupportAgentPageProps {
  searchParams: Promise<{
    postId?: string
    question?: string
  }>
}

export default async function ArticleSupportAgentPage({
  searchParams,
}: ArticleSupportAgentPageProps) {
  const { postId, question } = await searchParams

  return (
    <AgentChatPage
      agentType="article_support"
      initialQuestion={question}
      targetPostId={postId}
    />
  )
}
