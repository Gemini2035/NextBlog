export interface AgentCitation {
  sourceType: string
  sourceId: string
  title: string
  href: string
  chunkId?: string | number
  excerpt?: string
}

export interface AgentMessage {
  id: string | number
  role: 'user' | 'assistant'
  content: string
  citations: AgentCitation[]
  createdAt: string
}

export interface AgentSession {
  id: string | number
  messages: AgentMessage[]
  createdAt: string
  updatedAt: string
}

export interface AgentMessageStreamPayload {
  message?: AgentMessage
  citations?: AgentCitation[]
  content?: string
  delta?: string
  runId?: string | number
  sessionId?: string | number
  tool?: string
  error?: string
}

export type AgentStreamEventType =
  | 'run.started'
  | 'tool.started'
  | 'tool.completed'
  | 'message.delta'
  | 'message.completed'
  | 'run.completed'
  | 'error'
