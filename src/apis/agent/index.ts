import { httpRequest } from '@/apis/http'
import type {
  AgentMessage,
  AgentMessageCreatePayload,
  AgentMessageStreamPayload,
  AgentSession,
  AgentStreamTimelineEvent,
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
  onTimelineEvent?: (event: AgentStreamTimelineEvent) => void
  onDone?: () => void
  onError?: (error: Error) => void
}

const getAgentQueryType = (agentType: AgentType) => {
  return agentType === 'chat' ? 'chat' : 'article-support'
}

export const createAgentSession = (
  agentType: AgentType,
  data: CreateAgentSessionRequest,
  siteLanguage?: string
) => {
  return httpRequest<AgentSession, CreateAgentSessionRequest>({
    url: `/agent/sessions?type=${getAgentQueryType(agentType)}`,
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
    url: `/agent/sessions/${sessionId}/messages?type=${getAgentQueryType(agentType)}`,
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
    type: getAgentQueryType(agentType),
    content: data.content,
    deviceKey: data.deviceKey,
  })

  if (siteLanguage) {
    searchParams.set('locale', siteLanguage)
  }

  return `/agent-stream/sessions/${sessionId}/messages/stream?${searchParams.toString()}`
}

const isStreamPayload = (value: unknown): value is AgentMessageStreamPayload => {
  return typeof value === 'object' && value !== null
}

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null
}

const parseStreamPayload = (data: string, eventType?: string): AgentMessageStreamPayload => {
  if (!data || data === '[DONE]') {
    return {
      done: true,
    }
  }

  let parsed: unknown

  try {
    parsed = JSON.parse(data) as unknown
  } catch {
    return {
      delta: data,
    }
  }

  if (typeof parsed === 'string') {
    return {
      delta: parsed,
    }
  }

  if (!isStreamPayload(parsed)) {
    return {}
  }

  const parsedRecord = parsed as Record<string, unknown>
  const envelopeType = typeof parsedRecord.type === 'string' ? parsedRecord.type : undefined
  const resolvedEventType = envelopeType ?? eventType
  const payloadData = envelopeType && 'data' in parsedRecord ? parsedRecord.data : parsed

  if (resolvedEventType === 'ready') {
    return {}
  }

  if (
    resolvedEventType === 'proxy_stage' ||
    resolvedEventType === 'stage' ||
    resolvedEventType === 'run_started' ||
    resolvedEventType === 'step_started' ||
    resolvedEventType === 'step_finished' ||
    resolvedEventType === 'step_failed' ||
    resolvedEventType === 'run_finished'
  ) {
    const eventPayload = isRecord(payloadData) ? payloadData : {}
    return {
      timelineEvent: {
        ...eventPayload,
        type: resolvedEventType === 'proxy_stage' ? 'stage' : resolvedEventType,
      } as AgentStreamTimelineEvent,
    }
  }

  if (resolvedEventType === 'error_message') {
    if (isRecord(payloadData)) {
      const message = payloadData.message ?? payloadData.error
      return {
        error: typeof message === 'string' ? message : 'Agent stream failed',
        retryAfterSeconds: typeof payloadData.retryAfterSeconds === 'number'
          ? payloadData.retryAfterSeconds
          : undefined,
      }
    }
    return {
      error: typeof payloadData === 'string' ? payloadData : 'Agent stream failed',
    }
  }

  if (resolvedEventType === 'done') {
    return {
      done: true,
    }
  }

  if (resolvedEventType === 'user_message') {
    return {
      userMessage: payloadData as AgentMessage,
    }
  }

  if (resolvedEventType === 'assistant_message') {
    return {
      assistantMessage: payloadData as AgentMessage,
    }
  }

  if (resolvedEventType === 'delta' || resolvedEventType === 'message_delta') {
    return {
      delta: isRecord(payloadData) && typeof payloadData.content === 'string'
        ? payloadData.content
        : typeof payloadData === 'string'
          ? payloadData
          : data,
    }
  }

  return parsed
}

const applyStreamPayload = (payload: AgentMessageStreamPayload, options: StreamAgentMessageOptions) => {
  if (payload.error) {
    const error = new Error(payload.error) as Error & { retryAfterSeconds?: number }
    error.retryAfterSeconds = payload.retryAfterSeconds
    options.onError?.(error)
    return
  }

  if (payload.userMessage) {
    options.onUserMessage?.(payload.userMessage)
  }

  if (payload.assistantMessage) {
    options.onAssistantMessage?.(payload.assistantMessage)
  }

  if (payload.timelineEvent) {
    options.onTimelineEvent?.(payload.timelineEvent)
  }

  const delta = payload.delta ?? payload.content
  if (delta) {
    options.onDelta?.(delta)
  }

  if (payload.done) {
    options.onDone?.()
  }
}

const parseSseChunk = (chunk: string): Array<{ eventType?: string; data: string }> => {
  return chunk
    .split(/\r?\n\r?\n+/)
    .map((eventText) => {
      let eventType: string | undefined
      const dataLines: string[] = []

      for (const line of eventText.split(/\r?\n/)) {
        if (!line || line.startsWith(':')) continue
        if (line.startsWith('event:')) {
          eventType = line.slice('event:'.length).trim()
          continue
        }
        if (line.startsWith('data:')) {
          dataLines.push(line.slice('data:'.length).trimStart())
        }
      }

      return {
        eventType,
        data: dataLines.join('\n'),
      }
    })
    .filter((event) => event.data)
}

export const streamAgentMessage = (
  agentType: AgentType,
  sessionId: number,
  data: CreateAgentMessageRequest,
  siteLanguage: string | undefined,
  options: StreamAgentMessageOptions
) => {
  const abortController = new AbortController()
  let finished = false

  const finish = () => {
    if (finished) return
    finished = true
    abortController.abort()
    options.onDone?.()
  }

  const handlePayload = (eventData: string, eventType?: string) => {
    try {
      const payload = parseStreamPayload(eventData, eventType)
      applyStreamPayload(payload, {
        ...options,
        onDone: finish,
        onError: (error) => {
          finished = true
          abortController.abort()
          options.onError?.(error)
        },
      })
    } catch (error) {
      finished = true
      abortController.abort()
      options.onError?.(error instanceof Error ? error : new Error('Failed to parse agent stream'))
    }
  }

  void (async () => {
    try {
      const response = await fetch(createAgentStreamUrl(agentType, sessionId, data, siteLanguage), {
        method: 'GET',
        headers: {
          Accept: 'text/event-stream',
        },
        signal: abortController.signal,
      })

      if (!response.ok) {
        const errorPayload = await response.json().catch(() => null) as unknown
        if (isRecord(errorPayload)) {
          const message = errorPayload.message ?? errorPayload.error
          if (typeof message === 'string') {
            throw new Error(message)
          }
        }
        throw new Error(`Agent stream failed with status ${response.status}`)
      }

      if (!response.body) {
        throw new Error('Agent stream response body is empty')
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (!finished) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const eventBoundaryMatch = /\r?\n\r?\n(?![\s\S]*\r?\n\r?\n)/.exec(buffer)
        const eventBoundary = eventBoundaryMatch?.index ?? -1
        if (eventBoundary < 0) continue

        const completeEvents = buffer.slice(0, eventBoundary)
        buffer = buffer.slice(eventBoundary + (eventBoundaryMatch?.[0].length ?? 2))

        for (const event of parseSseChunk(completeEvents)) {
          handlePayload(event.data, event.eventType)
        }
      }

      const trailing = `${buffer}${decoder.decode()}`
      for (const event of parseSseChunk(trailing)) {
        handlePayload(event.data, event.eventType)
      }

      finish()
    } catch (error) {
      if (finished || abortController.signal.aborted) return
      finished = true
      options.onError?.(error instanceof Error ? error : new Error('Agent stream disconnected'))
    }
  })()

  return () => {
    finished = true
    abortController.abort()
  }
}
