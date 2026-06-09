import { AgentChatPage } from '@/components/Agent'

interface ChatAgentPageProps {
  searchParams: Promise<{
    question?: string
  }>
}

export default async function ChatAgentPage({ searchParams }: ChatAgentPageProps) {
  const { question } = await searchParams

  return <AgentChatPage agentType="chat" initialQuestion={question} />
}
