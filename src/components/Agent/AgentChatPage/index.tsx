'use client'

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'
import { createAgentSession, streamAgentMessage } from '@/apis/agent'
import { getBlogPostDetail } from '@/apis/blog'
import { ArrowRightIcon, EditIcon, OpenAIIcon, SearchIcon } from '@/assets/icons'
import {
  MarkdownRenderer,
  type MarkdownAutoLinkTarget,
} from '@/components/MarkdownRenderer'
import { Link, Progressing } from '@/ui'
import type {
  AgentMessage,
  AgentSession,
  AgentStreamTimelineEvent,
  AgentType,
} from '@/types/agent'

interface AgentChatPageProps {
  agentType: AgentType
  initialQuestion?: string
  targetPostId?: string
}

const MAX_VISIBLE_SOURCES = 3
const TYPING_INTERVAL_MS = 12

interface TimelineItem {
  key: string
  runId?: number
  stepId?: number
  order?: number
  name: string
  label: string
  labelKey?: string
  status: 'running' | 'succeeded' | 'failed'
  input?: Record<string, unknown>
  output?: Record<string, unknown>
  error?: string
}

interface RunSummary {
  route?: string | null
  model?: string | null
  promptCode?: string | null
  promptVersion?: number | null
  sourceCount?: number
  durationMs?: number
  rag?: {
    resultCount?: number
    topScore?: number | null
    hit?: boolean
    effectiveHit?: boolean
    targetPostHit?: boolean | null
  }
}

const asRecord = (value: unknown): Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value) ? value as Record<string, unknown> : {}
}

const getContextUsagePercent = (message: AgentMessage) => {
  const contextBudget = asRecord(asRecord(message.meta).contextBudget)
  const percent = contextBudget.conversationPercentOfLimit ?? contextBudget.usedPromptPercentOfLimit
  return typeof percent === 'number' && Number.isFinite(percent) ? percent : null
}

const getLatestContextUsagePercent = (messages: AgentMessage[]) => {
  for (const message of [...messages].reverse()) {
    const percent = getContextUsagePercent(message)
    if (percent !== null) return percent
  }
  return 0
}

type AgentRequestError = Error & {
  retryAfterSeconds?: number
  details?: unknown
}

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null
}

type AgentTranslator = ReturnType<typeof useTranslations>

const translateIfExists = (t: AgentTranslator, key: string, fallback: string) => {
  return t.has(key) ? t(key) : fallback
}

const toAgentTranslationKey = (dictionaryKey?: string) => {
  if (!dictionaryKey?.startsWith('agent.')) return null
  return dictionaryKey.replace(/^agent\./, '')
}

const getRouteTranslationKey = (route?: string | null) => {
  if (!route?.startsWith('agent.')) return null
  return `routes.${route.replace(/^agent\./, '').replaceAll('.', '_')}`
}

const formatDuration = (durationMs: number) => `${durationMs}ms`

const getDeviceKey = () => {
  if (typeof window === 'undefined') {
    return 'server-device'
  }

  const storageKey = 'nextblog.agent.device_key'
  const existing = window.localStorage.getItem(storageKey)
  if (existing) {
    return existing
  }

  const nextKey = `device_${crypto.randomUUID()}`
  window.localStorage.setItem(storageKey, nextKey)
  return nextKey
}

function useTypewriterText(
  target: string,
  {
    enabled = true,
    speedMs = TYPING_INTERVAL_MS,
    step = 2,
  }: {
    enabled?: boolean
    speedMs?: number
    step?: number
  } = {}
) {
  const [visible, setVisible] = useState(enabled ? '' : target)

  useEffect(() => {
    if (!enabled) {
      setVisible(target)
      return undefined
    }

    setVisible((current) => (target.startsWith(current) ? current : ''))
    return undefined
  }, [enabled, target])

  useEffect(() => {
    if (!enabled) return undefined
    if (visible.length >= target.length) return undefined

    const timer = window.setTimeout(() => {
      setVisible(target.slice(0, visible.length + step))
    }, speedMs)

    return () => window.clearTimeout(timer)
  }, [enabled, speedMs, step, target, visible])

  return visible
}

interface TypingMarkdownRendererProps {
  content: string
  autoLinkTargets: MarkdownAutoLinkTarget[]
  enabled: boolean
  onTypingDone?: () => void
}

function TypingMarkdownRenderer({
  autoLinkTargets,
  content,
  enabled,
  onTypingDone,
}: TypingMarkdownRendererProps) {
  const visibleContent = useTypewriterText(content, { enabled })

  useEffect(() => {
    if (!enabled || visibleContent.length < content.length) return
    onTypingDone?.()
  }, [content.length, enabled, onTypingDone, visibleContent.length])

  return (
    <MarkdownRenderer
      autoLinkTargets={autoLinkTargets}
      content={visibleContent}
      linkTarget="_blank"
    />
  )
}

const toRunSummary = (value: unknown): RunSummary | null => {
  return isRecord(value) ? value as RunSummary : null
}

const getStageBaseName = (name: string) => {
  if (name.endsWith('_start')) return name.slice(0, -'_start'.length)
  if (name.endsWith('_done')) return name.slice(0, -'_done'.length)
  return name
}

const getStageStatus = (name: string) => {
  if (name.endsWith('_start')) return 'running'
  if (name.endsWith('_done')) return 'succeeded'
  return 'succeeded'
}

const getTimelineKey = (event: AgentStreamTimelineEvent) => {
  if (event.type === 'stage') {
    const name = String(event.step ?? event.name ?? event.type)
    return `${event.runId ?? 'run'}-stage-${getStageBaseName(name)}`
  }
  return event.stepId ? `step-${event.stepId}` : `${event.runId ?? 'run'}-${event.name ?? event.type}`
}

const timelineItemFromEvent = (event: AgentStreamTimelineEvent): TimelineItem | null => {
  if (!event.name && event.type !== 'stage') return null

  const name = event.name ?? String(event.step ?? event.type)
  const stageBaseName = getStageBaseName(name)
  const labelKey = event.labelKey ?? (event.type === 'stage' ? `agent.stage.${stageBaseName}.label` : undefined)
  const status = event.type === 'stage'
    ? getStageStatus(name)
    : event.type === 'step_failed'
      ? 'failed'
      : event.status === 'failed'
        ? 'failed'
        : event.status === 'running'
          ? 'running'
          : 'succeeded'
  return {
    key: getTimelineKey(event),
    runId: event.runId,
    stepId: event.stepId,
    order: event.order,
    name,
    labelKey,
    label: event.label ?? name.replaceAll('_', ' '),
    status,
    input: event.input,
    output: event.output,
    error: event.error,
  }
}

function ThinkingTimeline({
  items,
  loading,
  t,
}: {
  items: TimelineItem[]
  loading: boolean
  t: AgentTranslator
}) {
  if (!items.length && !loading) return null

  return (
    <div className="mb-4 rounded-[var(--site-radius-card)] border border-[var(--site-border)] bg-[var(--site-surface)] px-4 py-3">
      <div className="mb-2 text-xs font-semibold text-[var(--site-text-tertiary)]">{t('timeline.title')}</div>
      <div className="space-y-2">
        {items.map((item) => {
          const count = typeof item.output?.count === 'number' ? item.output.count : null
          const duration = typeof item.output?.durationMs === 'number' ? item.output.durationMs : null
          const localLabelKey = toAgentTranslationKey(item.labelKey)
          const label = localLabelKey ? translateIfExists(t, localLabelKey, item.label) : item.label
          const route = typeof item.output?.route === 'string' ? item.output.route : null
          const routeLabelKey = getRouteTranslationKey(route)
          return (
            <div key={item.key} className="flex items-start gap-2 text-sm">
              <span className={item.status === 'failed' ? 'mt-0.5 w-4 shrink-0 text-red-500' : 'mt-0.5 w-4 shrink-0 text-[var(--site-action)]'}>
                {item.status === 'running' ? '' : item.status === 'failed' ? '!' : '✓'}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-3 text-[var(--site-text-muted)]">
                  <span>{label}</span>
                  {item.status === 'running' ? (
                    <span className="shrink-0 animate-pulse text-xs text-[var(--site-action)]">{t('timeline.running')}</span>
                  ) : null}
                </div>
                <div className="mt-0.5 flex flex-wrap gap-x-3 gap-y-1 text-xs text-[var(--site-text-tertiary)]">
                  {count !== null ? <span>{t('timeline.hits', { count })}</span> : null}
                  {typeof item.output?.topScore === 'number' ? <span>{t('timeline.topScore', { score: item.output.topScore.toFixed(2) })}</span> : null}
                  {typeof item.output?.sourceCount === 'number' ? <span>{t('timeline.sources', { count: item.output.sourceCount })}</span> : null}
                  {route ? <span>{routeLabelKey ? translateIfExists(t, routeLabelKey, route) : route}</span> : null}
                  {duration !== null ? <span>{formatDuration(duration)}</span> : null}
                  {item.error ? <span className="text-red-500">{item.error}</span> : null}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function RunSummaryPanel({ summary, t }: { summary: RunSummary | null; t: AgentTranslator }) {
  if (!summary) return null
  const routeLabelKey = getRouteTranslationKey(summary.route)
  const routeLabel = summary.route && routeLabelKey
    ? translateIfExists(t, routeLabelKey, summary.route)
    : summary.route

  return (
    <div className="mt-4 rounded-[var(--site-radius-control)] border border-[var(--site-border-subtle)] bg-[var(--site-surface)] px-3 py-2 text-xs text-[var(--site-text-tertiary)]">
      <div className="mb-1 font-semibold text-[var(--site-text-muted)]">{t('summary.title')}</div>
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        {routeLabel ? <span>{t('summary.route', { route: routeLabel })}</span> : null}
        {summary.rag ? (
          <span>
            {t(summary.rag.hit ? 'summary.ragHit' : 'summary.ragMiss', { count: summary.rag.resultCount ?? 0 })}
            {summary.rag.effectiveHit ? ` / ${t('summary.effective')}` : ''}
          </span>
        ) : null}
        {typeof summary.sourceCount === 'number' ? <span>{t('summary.sources', { count: summary.sourceCount })}</span> : null}
        {typeof summary.durationMs === 'number' ? <span>{formatDuration(summary.durationMs)}</span> : null}
      </div>
    </div>
  )
}

export function AgentChatPage({ agentType, initialQuestion, targetPostId }: AgentChatPageProps) {
  const t = useTranslations('Agent')
  const locale = useLocale()
  const router = useRouter()
  const [session, setSession] = useState<AgentSession | null>(null)
  const [messages, setMessages] = useState<AgentMessage[]>([])
  const [input, setInput] = useState(initialQuestion ?? '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([])
  const [runSummary, setRunSummary] = useState<RunSummary | null>(null)
  const [streamingMessageId, setStreamingMessageId] = useState<number | null>(null)
  const [typingMessageId, setTypingMessageId] = useState<number | null>(null)
  const [targetPost, setTargetPost] = useState<{
    href: string
    title: string
  } | null>(null)
  const didCreateRef = useRef(false)
  const bottomRef = useRef<HTMLDivElement | null>(null)
  const streamCleanupRef = useRef<(() => void) | null>(null)
  const pendingUserMessageIdRef = useRef<number | null>(null)
  const assistantDraftMessageIdRef = useRef<number | null>(null)
  const editedContextMessagesRef = useRef<AgentMessage[] | null>(null)
  const copyKey = agentType === 'chat' ? 'chat' : 'articleSupport'

  const targetLabel = useMemo(() => {
    if (agentType !== 'article_support') return null
    if (targetPost) return t('targetArticle', { title: targetPost.title })
    return targetPostId ? t('targetArticleLoading') : t('targetArticleRequired')
  }, [agentType, targetPost, targetPostId, t])
  const targetSourceIds = useMemo(() => {
    return new Set(
      [targetPostId, session?.targetPostId].filter((sourceId): sourceId is string =>
        Boolean(sourceId)
      )
    )
  }, [session?.targetPostId, targetPostId])
  const currentContextUsagePercent = useMemo(() => {
    return getLatestContextUsagePercent(messages)
  }, [messages])

  const cancelActiveStream = useCallback(() => {
    streamCleanupRef.current?.()
    streamCleanupRef.current = null
    pendingUserMessageIdRef.current = null
    assistantDraftMessageIdRef.current = null
  }, [])

  const stopStreaming = useCallback(() => {
    cancelActiveStream()
    setStreamingMessageId(null)
    setLoading(false)
  }, [cancelActiveStream])

  const formatAgentError = useCallback((error: unknown, fallback: string) => {
    const requestError = error as AgentRequestError
    const details = requestError.details
    const detail = isRecord(details) && isRecord(details.detail) ? details.detail : null
    const retryAfterSeconds =
      typeof requestError.retryAfterSeconds === 'number'
        ? requestError.retryAfterSeconds
        : detail && typeof detail.retryAfterSeconds === 'number'
          ? detail.retryAfterSeconds
          : undefined

    if (retryAfterSeconds !== undefined) {
      const minutes = Math.max(1, Math.ceil(retryAfterSeconds / 60))
      return t('rateLimit.exceeded', { minutes })
    }

    return requestError instanceof Error && requestError.message ? requestError.message : fallback
  }, [t])

  useEffect(() => {
    if (didCreateRef.current) return
    didCreateRef.current = true
    setLoading(true)
    createAgentSession(
      agentType,
      {
        deviceKey: getDeviceKey(),
        targetPostId,
      },
      locale
    )
      .then((response) => {
        setSession(response.data)
        setMessages(response.data.messages)
      })
      .catch((requestError) => {
        setError(formatAgentError(requestError, t('failedToStart')))
      })
      .finally(() => setLoading(false))
  }, [agentType, formatAgentError, locale, t, targetPostId])

  useEffect(() => {
    if (agentType !== 'article_support' || !targetPostId) {
      setTargetPost(null)
      return
    }

    let ignore = false
    getBlogPostDetail(targetPostId, locale)
      .then((response) => {
        if (ignore) return
        setTargetPost({
          href: `/posts/${response.data.post.id}`,
          title: response.data.post.title,
        })
      })
      .catch(() => {
        if (ignore) return
        setTargetPost({
          href: `/posts/${targetPostId}`,
          title: targetPostId,
        })
      })

    return () => {
      ignore = true
    }
  }, [agentType, locale, targetPostId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, loading])

  useEffect(() => {
    return () => {
      cancelActiveStream()
    }
  }, [cancelActiveStream])

  const upsertMessage = (message: AgentMessage, replaceId?: number | null) => {
    setMessages((current) => {
      const targetId = replaceId ?? message.id
      const existingIndex = current.findIndex((item) => item.id === targetId)

      if (existingIndex === -1) {
        return [...current, message]
      }

      return current.map((item, index) => (index === existingIndex ? message : item))
    })
  }

  const appendAssistantDelta = (delta: string) => {
    const draftId = assistantDraftMessageIdRef.current ?? -Date.now()
    assistantDraftMessageIdRef.current = draftId
    setStreamingMessageId(draftId)
    setTypingMessageId(draftId)

    setMessages((current) => {
      const existingMessage = current.find((message) => message.id === draftId)
      if (!existingMessage) {
        return [
          ...current,
          {
            id: draftId,
            role: 'assistant',
            content: delta,
            sources: [],
            createdAt: new Date().toISOString(),
          },
        ]
      }

      return current.map((message) =>
        message.id === draftId
          ? {
              ...message,
              content: `${message.content}${delta}`,
            }
          : message
      )
    })
  }

  const handleTimelineEvent = (event: AgentStreamTimelineEvent) => {
    if (event.type === 'run_started') {
      setTimelineItems([])
      setRunSummary(null)
      return
    }

    if (event.type === 'run_finished') {
      setRunSummary(toRunSummary(event.summary))
      setTimelineItems((current) =>
        current.map((item) => item.status === 'running' ? { ...item, status: 'succeeded' } : item)
      )
      return
    }

    const item = timelineItemFromEvent(event)
    if (!item) return

    setTimelineItems((current) => {
      const existingIndex = current.findIndex((existing) => existing.key === item.key)
      if (existingIndex === -1) {
        return [...current, item].sort((first, second) => (first.order ?? 999) - (second.order ?? 999))
      }
      return current.map((existing, index) => (index === existingIndex ? { ...existing, ...item } : existing))
    })
  }

  const sendMessage = (event?: FormEvent) => {
    event?.preventDefault()
    const content = input.trim()
    if (!content || !session || loading) return

    cancelActiveStream()
    setInput('')
    setError('')
    setLoading(true)
    setTimelineItems([])
    setRunSummary(null)
    setStreamingMessageId(null)
    setTypingMessageId(null)
    pendingUserMessageIdRef.current = -Date.now()
    assistantDraftMessageIdRef.current = null

    const pendingUserMessage: AgentMessage = {
      id: pendingUserMessageIdRef.current,
      role: 'user',
      content,
      sources: [],
      createdAt: new Date().toISOString(),
    }
    const baseMessages = editedContextMessagesRef.current ?? messages
    editedContextMessagesRef.current = null
    const contextMessages = baseMessages.map((message) => ({
      role: message.role,
      content: message.content,
    }))

    setMessages([...baseMessages, pendingUserMessage])
    streamCleanupRef.current = streamAgentMessage(
      agentType,
      session.id,
      {
        content,
        deviceKey: getDeviceKey(),
        messages: contextMessages,
      },
      locale,
      {
        onUserMessage: (message) => {
          upsertMessage(message, pendingUserMessageIdRef.current)
          pendingUserMessageIdRef.current = null
        },
        onAssistantMessage: (message) => {
          upsertMessage(message, assistantDraftMessageIdRef.current)
          setTypingMessageId(message.id)
          setStreamingMessageId(null)
          assistantDraftMessageIdRef.current = null
        },
        onDelta: appendAssistantDelta,
        onTimelineEvent: handleTimelineEvent,
        onDone: () => {
          streamCleanupRef.current = null
          pendingUserMessageIdRef.current = null
          assistantDraftMessageIdRef.current = null
          setStreamingMessageId(null)
          setLoading(false)
        },
        onError: (streamError) => {
          streamCleanupRef.current = null
          pendingUserMessageIdRef.current = null
          assistantDraftMessageIdRef.current = null
          setStreamingMessageId(null)
          setTypingMessageId(null)
          setInput(content)
          setError(formatAgentError(streamError, t('failedToSend')))
          setLoading(false)
        },
      }
    )
  }

  const editMessage = (message: AgentMessage) => {
    if (message.role !== 'user') return
    cancelActiveStream()
    setLoading(false)
    setStreamingMessageId(null)
    setTypingMessageId(null)
    setTimelineItems([])
    setRunSummary(null)
    setError('')
    setInput(message.content)
    setMessages((current) => {
      const messageIndex = current.findIndex((item) => item.id === message.id)
      const baseMessages = messageIndex === -1 ? current : current.slice(0, messageIndex)
      editedContextMessagesRef.current = baseMessages
      return baseMessages
    })
  }

  const sendInitialQuestion = () => {
    sendMessage()
  }

  const goHandoff = (message: AgentMessage) => {
    const handoff = message.handoff
    if (!handoff) return

    const params = new URLSearchParams()
    if (handoff.question) params.set('question', handoff.question)
    if (handoff.postId) params.set('postId', handoff.postId)
    const path = handoff.targetAgent === 'chat' ? '/agent/chat' : '/agent/article-support'
    router.push(`${path}?${params.toString()}`)
  }

  const getArticleSupportLinkTargets = (message: AgentMessage): MarkdownAutoLinkTarget[] => {
    if (agentType !== 'article_support') {
      return []
    }

    return message.sources
      .filter((source) => !(source.type === 'post' && targetSourceIds.has(source.id)))
      .map((source) => ({
        label: source.title,
        href: source.href,
      }))
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-[var(--site-canvas)]">
      <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-4xl flex-col px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-6">
          <div className="flex items-start gap-4">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-[var(--site-radius-control)] border border-[var(--site-border)] bg-[var(--site-surface)] text-[var(--site-action)]">
              {agentType === 'chat' ? <SearchIcon className="h-5 w-5" /> : <OpenAIIcon className="h-5 w-5" />}
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-semibold text-[var(--site-text)]">{t(`${copyKey}.title`)}</h1>
              <p className="mt-1 text-sm leading-6 text-[var(--site-text-muted)]">{t(`${copyKey}.subtitle`)}</p>
              {targetLabel && targetPost ? (
                <Link
                  href={targetPost.href}
                  className="mt-3 inline-flex max-w-full rounded-[var(--site-radius-chip)] border border-[var(--site-border)] bg-[var(--site-surface)] px-3 py-1 text-left text-xs font-medium text-[var(--site-text-muted)] transition-colors hover:border-[var(--site-action)] hover:text-[var(--site-action)]"
                  rel="noreferrer"
                  target="_blank"
                  title={targetPost.title}
                >
                  {targetLabel}
                </Link>
              ) : targetLabel ? (
                <span className="mt-3 inline-flex max-w-full rounded-[var(--site-radius-chip)] border border-[var(--site-border)] bg-[var(--site-surface)] px-3 py-1 text-left text-xs font-medium text-[var(--site-text-muted)]">
                  {targetLabel}
                </span>
              ) : null}
            </div>
          </div>
        </header>

        <section className="flex min-h-[520px] flex-1 flex-col">
          <div className="flex flex-1 flex-col py-5">
            {messages.length === 0 && !loading ? (
              <div className="grid flex-1 place-items-center text-center">
                <div>
                  <OpenAIIcon className="mx-auto mb-4 h-12 w-12 text-[var(--site-text-tertiary)]" />
                  <p className="text-sm text-[var(--site-text-tertiary)]">{t(`${copyKey}.empty`)}</p>
                  {initialQuestion ? (
                    <button
                      className="mt-4 rounded-[var(--site-radius-chip)] bg-[var(--site-action)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--site-action-hover)]"
                      onClick={sendInitialQuestion}
                    >
                      {t('sendPreparedQuestion')}
                    </button>
                  ) : null}
                </div>
              </div>
            ) : null}

            <div className="space-y-5">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={
                    message.role === 'user'
                      ? 'group flex flex-col items-end gap-1'
                      : 'flex justify-start'
                  }
                >
                  <div
                    className={
                      message.role === 'user'
                        ? 'max-w-[82%] rounded-[var(--site-radius-card)] bg-[var(--site-text)] px-4 py-3 text-sm leading-6 text-white'
                        : 'w-full max-w-none text-sm leading-6 text-[var(--site-text)]'
                    }
                  >
                    {message.role === 'assistant' && message.id === streamingMessageId ? (
                      <ThinkingTimeline items={timelineItems} loading={loading} t={t} />
                    ) : null}
                    {message.role === 'assistant' ? (
                      <TypingMarkdownRenderer
                        autoLinkTargets={getArticleSupportLinkTargets(message)}
                        content={message.content}
                        enabled={message.id === streamingMessageId || message.id === typingMessageId}
                        onTypingDone={() => {
                          setTypingMessageId((current) => current === message.id ? null : current)
                        }}
                      />
                    ) : (
                      <div className="whitespace-pre-wrap">{message.content}</div>
                    )}
                    {agentType === 'chat' && message.role === 'assistant' && message.sources.length > 0 ? (
                      <div className="mt-4 space-y-2 border-t border-[var(--site-border)] pt-3">
                        <div className="text-xs font-semibold text-[var(--site-text-tertiary)]">{t('sourcesTitle')}</div>
                        {message.sources.slice(0, MAX_VISIBLE_SOURCES).map((source) => (
	                          <Link
	                            key={`${source.type}-${source.id}`}
	                            href={source.href}
	                            className="group flex items-center justify-between gap-3 rounded-[var(--site-radius-control)] border border-[var(--site-border)] bg-[var(--site-canvas)] px-3 py-2 text-[var(--site-text)] transition-colors hover:border-[var(--site-action)]"
	                            rel="noreferrer"
	                            target="_blank"
	                          >
                            <span className="min-w-0 truncate text-xs font-medium">{source.title}</span>
                            <ArrowRightIcon className="h-4 w-4 shrink-0 text-[var(--site-text-tertiary)] group-hover:text-[var(--site-action)]" />
                          </Link>
                        ))}
                      </div>
                    ) : null}
                    {message.handoff ? (
                      <button
                        className="mt-4 inline-flex items-center rounded-[var(--site-radius-chip)] bg-[var(--site-action)] px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-[var(--site-action-hover)]"
                        onClick={() => goHandoff(message)}
                      >
                        {t('continueIn', {
                          agent: t(message.handoff.targetAgent === 'chat' ? 'chat.title' : 'articleSupport.title'),
                        })}
                        <ArrowRightIcon className="ml-1 h-3.5 w-3.5" />
                      </button>
                    ) : null}
                    {message.role === 'assistant' && message.id !== streamingMessageId && messages.at(-1)?.id === message.id ? (
                      <RunSummaryPanel summary={runSummary} t={t} />
                    ) : null}
                  </div>
                  {message.role === 'user' ? (
                    <button
                      type="button"
                      className="mr-1 grid h-7 w-7 place-items-center rounded-full border border-transparent text-[var(--site-text-tertiary)] opacity-0 transition hover:border-[var(--site-border)] hover:bg-[var(--site-surface)] hover:text-[var(--site-text)] group-hover:opacity-100"
                      aria-label={t('editMessage')}
                      title={t('editMessage')}
                      onClick={() => editMessage(message)}
                    >
                      <EditIcon className="h-3.5 w-3.5" />
                    </button>
                  ) : null}
                </div>
              ))}
              {loading && streamingMessageId === null ? (
                <div className="flex justify-start">
                  <ThinkingTimeline items={timelineItems} loading={loading} t={t} />
                </div>
              ) : null}
              <div ref={bottomRef} />
            </div>
          </div>

          <form className="sticky bottom-4 mt-4 rounded-[28px] border border-[var(--site-border)] bg-[var(--site-canvas)] px-5 py-4 shadow-[0_12px_32px_rgba(0,0,0,0.06)]" onSubmit={sendMessage}>
            {error ? <div className="mb-3 text-sm text-red-600">{error}</div> : null}
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={t(`${copyKey}.placeholder`)}
              rows={2}
              className="min-h-16 w-full resize-none border-0 bg-transparent px-1 py-1 text-base text-[var(--site-text)] outline-none placeholder:text-[var(--site-text-tertiary)]"
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault()
                  sendMessage()
                }
              }}
            />
            <div className="mt-3 flex items-center justify-between gap-3">
              <Progressing
                aria-label={t('currentContextUsage', {
                  percent: currentContextUsagePercent.toFixed(1),
                })}
                className="cursor-pointer"
                format={(percent) => `${percent.toFixed(0)}%`}
                percent={currentContextUsagePercent}
                size={34}
                status={currentContextUsagePercent > 100 ? 'exception' : 'normal'}
                strokeWidth={4}
                title={t('currentContextUsage', {
                  percent: currentContextUsagePercent.toFixed(1),
                })}
                type="circle"
              />
              {loading ? (
                <button
                  type="button"
                  className="grid h-11 w-11 place-items-center rounded-full border border-[var(--site-border)] bg-[var(--site-surface)] text-[var(--site-text)] transition-colors hover:border-[var(--site-text)]"
                  aria-label={t('stop')}
                  title={t('stop')}
                  onClick={stopStreaming}
                >
                  <span className="h-3.5 w-3.5 rounded-[3px] bg-current" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!input.trim() || !session}
                  className="grid h-11 w-11 place-items-center rounded-full bg-[var(--site-text)] text-white transition-colors hover:bg-[var(--site-action)] disabled:cursor-not-allowed disabled:bg-[var(--site-border)]"
                  aria-label={t('send')}
                >
                  <span className="text-2xl leading-none">↑</span>
                </button>
              )}
            </div>
          </form>
        </section>
      </div>
    </div>
  )
}
