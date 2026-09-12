import { UnifiedAgentPage } from '@/components/Agent'

interface AgentPageProps {
  searchParams: Promise<{
    question?: string
  }>
}

export default async function AgentPage({ searchParams }: AgentPageProps) {
  const { question } = await searchParams
  return <UnifiedAgentPage initialQuestion={question} />
}
