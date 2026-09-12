import { httpRequest } from '@/apis/http'
import type {
  AgentCitation,
  AgentMessage,
  AgentMessageStreamPayload,
  AgentSession,
  AgentStreamEventType,
} from '@/types/agent'

interface CreateAgentMessageRequest {
  content: string
  clientMessageId: string
}

interface StreamAgentMessageOptions {
  onAssistantMessage?: (message: AgentMessage) => void
  onCitation?: (citation: AgentCitation) => void
  onDelta?: (delta: string) => void
  onToolStatus?: (tool: string, completed: boolean) => void
  onDone?: () => void
  onError?: (error: Error) => void
}

const isRecord = (value: unknown): value is Record<string, unknown> => (
  typeof value === 'object' && value !== null
)

const isAgentMessage = (value: unknown): value is AgentMessage => {
  if (!isRecord(value)) return false
  return (
    (typeof value.id === 'string' || typeof value.id === 'number')
    && (value.role === 'user' || value.role === 'assistant')
    && typeof value.content === 'string'
  )
}

const normalizeCitations = (value: unknown): AgentCitation[] => {
  if (!Array.isArray(value)) return []
  return value.flatMap((item) => {
    if (!isRecord(item) || typeof item.title !== 'string') return []
    const href = typeof item.href === 'string'
      ? item.href
      : typeof item.url === 'string'
        ? item.url
        : ''
    if (!href) return []
    return [{
      sourceType: typeof item.sourceType === 'string' ? item.sourceType : typeof item.type === 'string' ? item.type : 'post',
      sourceId: typeof item.sourceId === 'string' ? item.sourceId : typeof item.id === 'string' ? item.id : href,
      title: item.title,
      href,
      chunkId: typeof item.chunkId === 'string' || typeof item.chunkId === 'number' ? item.chunkId : undefined,
      excerpt: typeof item.excerpt === 'string' ? item.excerpt : typeof item.description === 'string' ? item.description : undefined,
    }]
  })
}

const parsePayload = (data: string): AgentMessageStreamPayload => {
  if (!data || data === '[DONE]') return {}
  try {
    const parsed: unknown = JSON.parse(data)
    if (typeof parsed === 'string') return { delta: parsed }
    if (!isRecord(parsed)) return { delta: data }
    const payload = isRecord(parsed.data) ? parsed.data : parsed
    const message = isRecord(payload.message) ? payload.message : undefined
    const citations = normalizeCitations(payload.citations ?? payload.sources ?? message?.citations ?? message?.sources)
    return {
      ...payload,
      message: isAgentMessage(message)
        ? { ...message, citations: citations.length > 0 ? citations : message.citations ?? message.sources ?? [] }
        : undefined,
      citations,
      sources: citations,
      content: typeof payload.content === 'string' ? payload.content : undefined,
      delta: typeof payload.delta === 'string' ? payload.delta : undefined,
      error: typeof payload.error === 'string' ? payload.error : undefined,
    }
  } catch {
    return { delta: data }
  }
}

const parseSseEvent = (eventText: string) => {
  let eventType: AgentStreamEventType | undefined
  const dataLines: string[] = []
  for (const line of eventText.split(/\r?\n/)) {
    if (!line || line.startsWith(':')) continue
    const separator = line.indexOf(':')
    const field = separator < 0 ? line : line.slice(0, separator)
    const value = separator < 0 ? '' : line.slice(separator + 1).replace(/^ /, '')
    if (field === 'event' && value) eventType = value as AgentStreamEventType
    if (field === 'data') dataLines.push(value)
  }
  return eventType && dataLines.length > 0
    ? { eventType, payload: parsePayload(dataLines.join('\n')) }
    : null
}

const emitPayload = (
  eventType: AgentStreamEventType,
  payload: AgentMessageStreamPayload,
  options: StreamAgentMessageOptions,
  finish: () => void,
) => {
  if (eventType === 'error' || payload.error) {
    options.onError?.(new Error(payload.error ?? 'Agent stream failed'))
    return
  }
  if (eventType === 'tool.started') options.onToolStatus?.(payload.tool ?? '', false)
  if (eventType === 'tool.completed') options.onToolStatus?.(payload.tool ?? '', true)
  if (eventType === 'message.delta' && (payload.delta ?? payload.content)) {
    options.onDelta?.(payload.delta ?? payload.content ?? '')
  }
  if (eventType === 'message.completed' && payload.message) {
    options.onAssistantMessage?.(payload.message)
  } else if (eventType === 'message.completed' && payload.content) {
    options.onAssistantMessage?.({
      id: `assistant-${Date.now()}`,
      role: 'assistant',
      content: payload.content,
      citations: payload.citations ?? payload.sources ?? [],
      createdAt: new Date().toISOString(),
    })
  }
  for (const citation of payload.citations ?? []) options.onCitation?.(citation)
  if (eventType === 'run.completed') finish()
}

export const createAgentSession = (deviceKey: string, siteLanguage?: string) => (
  httpRequest<AgentSession, Record<string, never>>({
    url: '/agent/sessions',
    method: 'POST',
    data: {},
    headers: {
      'X-Device-Key': deviceKey,
      ...(siteLanguage ? { 'X-Locale': siteLanguage } : {}),
    },
  })
)

export const streamUnifiedAgentMessage = (
  sessionId: string | number,
  data: CreateAgentMessageRequest,
  deviceKey: string,
  siteLanguage: string | undefined,
  options: StreamAgentMessageOptions,
) => {
  const abortController = new AbortController()
  let finished = false
  let reader: ReadableStreamDefaultReader<Uint8Array> | null = null

  const finish = () => {
    if (finished) return
    finished = true
    reader = null
    options.onDone?.()
  }

  void (async () => {
    try {
      const response = await fetch(`/agent-stream/sessions/${sessionId}/messages/stream`, {
        method: 'POST',
        headers: {
          Accept: 'text/event-stream',
          'Content-Type': 'application/json',
          'X-Device-Key': deviceKey,
          ...(siteLanguage ? { 'X-Locale': siteLanguage } : {}),
        },
        body: JSON.stringify(data),
        signal: abortController.signal,
      })
      if (!response.ok) throw new Error(`Agent stream failed with status ${response.status}`)
      if (!response.body) throw new Error('Agent stream response body is empty')

      reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      while (!finished) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const parts = buffer.split(/\r?\n\r?\n/)
        buffer = parts.pop() ?? ''
        for (const part of parts) {
          const event = parseSseEvent(part)
          if (event) emitPayload(event.eventType, event.payload, options, finish)
        }
      }
      buffer += decoder.decode()
      const trailingEvent = parseSseEvent(buffer)
      if (trailingEvent) emitPayload(trailingEvent.eventType, trailingEvent.payload, options, finish)
      if (!finished) finish()
    } catch (error) {
      if (abortController.signal.aborted) return
      finished = true
      options.onError?.(error instanceof Error ? error : new Error('Agent stream disconnected'))
    }
  })()

  return () => {
    if (finished) return
    finished = true
    abortController.abort()
    void reader?.cancel().catch(() => undefined)
  }
}
