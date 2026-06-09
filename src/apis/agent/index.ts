import { getApiBaseUrl, httpRequest } from '@/apis/http'
import type {
  AgentMessage,
  AgentMessageCreatePayload,
  AgentMessageStreamPayload,
  AgentSession,
  AgentType,
} from '@/types/agent'

interface CreateAgentSessionRequest {
  deviceKey: string
  question?: string
  targetPostId?: string | null
}

interface CreateAgentMessageRequest {
  content: string
  deviceKey: string
}

interface StreamAgentMessageOptions {
  onUserMessage?: (message: AgentMessage) => void
  onAssistantMessage?: (message: AgentMessage) => void
  onDelta?: (delta: string) => void
  onDone?: () => void
  onError?: (error: Error) => void
}

const getAgentBasePath = (agentType: AgentType) => {
  return agentType === 'chat' ? '/agent/chat' : '/agent/article-support'
}

export const createAgentSession = (
  agentType: AgentType,
  data: CreateAgentSessionRequest,
  siteLanguage?: string
) => {
  return httpRequest<AgentSession, CreateAgentSessionRequest>({
    url: `${getAgentBasePath(agentType)}/sessions`,
    method: 'POST',
    data,
    headers: siteLanguage ? { 'X-Locale': siteLanguage } : undefined,
  })
}

export const createAgentMessage = (
  agentType: AgentType,
  sessionId: number,
  data: CreateAgentMessageRequest,
  siteLanguage?: string
) => {
  return httpRequest<AgentMessageCreatePayload, CreateAgentMessageRequest>({
    url: `${getAgentBasePath(agentType)}/sessions/${sessionId}/messages`,
    method: 'POST',
    data,
    headers: siteLanguage ? { 'X-Locale': siteLanguage } : undefined,
  })
}

const createAgentStreamUrl = (
  agentType: AgentType,
  sessionId: number,
  data: CreateAgentMessageRequest,
  siteLanguage?: string
) => {
  const searchParams = new URLSearchParams({
    content: data.content,
    deviceKey: data.deviceKey,
  })

  if (siteLanguage) {
    searchParams.set('locale', siteLanguage)
  }

  return `${getApiBaseUrl()}${getAgentBasePath(agentType)}/sessions/${sessionId}/messages/stream?${searchParams.toString()}`
}

const isStreamPayload = (value: unknown): value is AgentMessageStreamPayload => {
  return typeof value === 'object' && value !== null
}

const parseStreamPayload = (data: string): AgentMessageStreamPayload => {
  if (!data || data === '[DONE]') {
    return {
      done: true,
    }
  }

  const parsed = JSON.parse(data) as unknown

  if (typeof parsed === 'string') {
    return {
      delta: parsed,
    }
  }

  if (!isStreamPayload(parsed)) {
    return {}
  }

  return parsed
}

const applyStreamPayload = (payload: AgentMessageStreamPayload, options: StreamAgentMessageOptions) => {
  if (payload.error) {
    options.onError?.(new Error(payload.error))
    return
  }

  if (payload.userMessage) {
    options.onUserMessage?.(payload.userMessage)
  }

  if (payload.assistantMessage) {
    options.onAssistantMessage?.(payload.assistantMessage)
  }

  const delta = payload.delta ?? payload.content
  if (delta) {
    options.onDelta?.(delta)
  }

  if (payload.done) {
    options.onDone?.()
  }
}

export const streamAgentMessage = (
  agentType: AgentType,
  sessionId: number,
  data: CreateAgentMessageRequest,
  siteLanguage: string | undefined,
  options: StreamAgentMessageOptions
) => {
  const eventSource = new EventSource(createAgentStreamUrl(agentType, sessionId, data, siteLanguage))
  let finished = false

  const finish = () => {
    if (finished) return
    finished = true
    eventSource.close()
    options.onDone?.()
  }

  const handleMessage = (event: MessageEvent<string>) => {
    try {
      const payload = parseStreamPayload(event.data)
      applyStreamPayload(payload, {
        ...options,
        onDone: finish,
      })
    } catch (error) {
      finished = true
      eventSource.close()
      options.onError?.(error instanceof Error ? error : new Error('Failed to parse agent stream'))
    }
  }

  eventSource.onmessage = handleMessage
  eventSource.addEventListener('delta', handleMessage)
  eventSource.addEventListener('message_delta', handleMessage)
  eventSource.addEventListener('user_message', handleMessage)
  eventSource.addEventListener('assistant_message', handleMessage)
  eventSource.addEventListener('done', finish)
  eventSource.addEventListener('error_message', handleMessage)
  eventSource.onerror = () => {
    if (finished) return
    finished = true
    eventSource.close()
    options.onError?.(new Error('Agent stream disconnected'))
  }

  return () => {
    finished = true
    eventSource.close()
  }
}
