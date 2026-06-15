export type AgentType = 'chat' | 'article_support'
export type AgentHandoffTarget = AgentType

export interface AgentSource {
  type: string
  id: string
  title: string
  description?: string | null
  href: string
  score?: number | null
}

export interface AgentHandoff {
  targetAgent: AgentHandoffTarget
  reason: string
  question: string
  postId?: string | null
}

export interface AgentMessage {
  id: number
  role: 'user' | 'assistant'
  content: string
  sources: AgentSource[]
  handoff?: AgentHandoff | null
  meta?: Record<string, unknown>
  createdAt: string
}

export interface AgentSession {
  id: number
  agentType: AgentType
  targetPostId?: string | null
  messages: AgentMessage[]
  createdAt: string
  updatedAt: string
}

export interface AgentMessageCreatePayload {
  userMessage: AgentMessage
  assistantMessage: AgentMessage
}

export interface AgentMessageStreamPayload {
  userMessage?: AgentMessage
  assistantMessage?: AgentMessage
  timelineEvent?: AgentStreamTimelineEvent
  delta?: string
  content?: string
  done?: boolean
  error?: string
  retryAfterSeconds?: number
}

export interface AgentStreamTimelineEvent {
  type:
    | 'run_started'
    | 'step_started'
    | 'step_finished'
    | 'step_failed'
    | 'run_finished'
    | 'stage'
  runId?: number
  sessionId?: number
  agentType?: AgentType
  question?: string
  step?: string
  stepId?: number
  order?: number
  name?: string
  labelKey?: string
  label?: string
  status?: string
  input?: Record<string, unknown>
  output?: Record<string, unknown>
  summary?: Record<string, unknown>
  error?: string
}
