'use client'

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'
import { createAgentSession, streamAgentMessage } from '@/apis/agent'
import { ArrowRightIcon, OpenAIIcon, SearchIcon } from '@/assets/icons'
import {
  MarkdownRenderer,
  type MarkdownAutoLinkTarget,
} from '@/components/MarkdownRenderer'
import type { AgentMessage, AgentSession, AgentType } from '@/types/agent'
import type { AgentStreamTimelineEvent } from '@/types/agent'

interface AgentChatPageProps {
  agentType: AgentType
  initialQuestion?: string
  targetPostId?: string
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

const getRouteTranslationKey = (route?: string | null) => {
  if (!route?.startsWith('agent.')) return null
  return `routes.${route.replace(/^agent\./, '').replaceAll('.', '_')}`
}

const toRunSummary = (value: unknown): RunSummary | null => {
  return isRecord(value) ? value as RunSummary : null
}

const formatDuration = (durationMs: number) => `${durationMs}ms`

function RunSummaryPanel({ summary, t }: { summary: RunSummary | null; t: AgentTranslator }) {
  if (!summary) return null
  const routeLabelKey = getRouteTranslationKey(summary.route)
  const routeLabel = summary.route && routeLabelKey
    ? translateIfExists(t, routeLabelKey, summary.route)
    : summary.route

  return (
    <div className="mt-4 rounded-[var(--site-radius-control)] border border-[var(--site-border)] bg-[var(--site-canvas)] px-3 py-2 text-xs text-[var(--site-text-tertiary)]">
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

export function AgentChatPage({ agentType, initialQuestion, targetPostId }: AgentChatPageProps) {
  const t = useTranslations('Agent')
  const locale = useLocale()
  const router = useRouter()
  const [session, setSession] = useState<AgentSession | null>(null)
  const [messages, setMessages] = useState<AgentMessage[]>([])
  const [input, setInput] = useState(initialQuestion ?? '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [runSummary, setRunSummary] = useState<RunSummary | null>(null)
  const didCreateRef = useRef(false)
  const bottomRef = useRef<HTMLDivElement | null>(null)
  const streamCleanupRef = useRef<(() => void) | null>(null)
  const pendingUserMessageIdRef = useRef<number | null>(null)
  const assistantDraftMessageIdRef = useRef<number | null>(null)
  const copyKey = agentType === 'chat' ? 'chat' : 'articleSupport'

  const targetLabel = useMemo(() => {
    if (agentType !== 'article_support') return null
    return targetPostId ? t('targetArticle', { postId: targetPostId }) : t('targetArticleRequired')
  }, [agentType, targetPostId, t])
  const targetSourceIds = useMemo(() => {
    return new Set(
      [targetPostId, session?.targetPostId].filter((sourceId): sourceId is string =>
        Boolean(sourceId)
      )
    )
  }, [session?.targetPostId, targetPostId])

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
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, loading])

  useEffect(() => {
    return () => {
      streamCleanupRef.current?.()
    }
  }, [])

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

  const sendMessage = (event?: FormEvent) => {
    event?.preventDefault()
    const content = input.trim()
    if (!content || !session || loading) return

    streamCleanupRef.current?.()
    setInput('')
    setError('')
    setLoading(true)
    setRunSummary(null)
    pendingUserMessageIdRef.current = -Date.now()
    assistantDraftMessageIdRef.current = null

    const pendingUserMessage: AgentMessage = {
      id: pendingUserMessageIdRef.current,
      role: 'user',
      content,
      sources: [],
      createdAt: new Date().toISOString(),
    }

    setMessages((current) => [...current, pendingUserMessage])
    streamCleanupRef.current = streamAgentMessage(
      agentType,
      session.id,
      {
        content,
        deviceKey: getDeviceKey(),
      },
      locale,
      {
        onUserMessage: (message) => {
          upsertMessage(message, pendingUserMessageIdRef.current)
          pendingUserMessageIdRef.current = null
        },
        onAssistantMessage: (message) => {
          upsertMessage(message, assistantDraftMessageIdRef.current)
          assistantDraftMessageIdRef.current = null
        },
        onDelta: appendAssistantDelta,
        onTimelineEvent: (timelineEvent: AgentStreamTimelineEvent) => {
          if (timelineEvent.type === 'run_started') {
            setRunSummary(null)
            return
          }
          if (timelineEvent.type === 'run_finished') {
            setRunSummary(toRunSummary(timelineEvent.summary))
          }
        },
        onDone: () => {
          streamCleanupRef.current = null
          pendingUserMessageIdRef.current = null
          assistantDraftMessageIdRef.current = null
          setLoading(false)
        },
        onError: (streamError) => {
          streamCleanupRef.current = null
          pendingUserMessageIdRef.current = null
          assistantDraftMessageIdRef.current = null
          setInput(content)
          setError(formatAgentError(streamError, t('failedToSend')))
          setLoading(false)
        },
      }
    )
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
    <div className="min-h-[calc(100vh-8rem)] bg-[var(--site-canvas-muted)]">
      <div className="mx-auto flex max-w-5xl flex-col px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-6 rounded-[var(--site-radius-card)] border border-[var(--site-border)] bg-[var(--site-canvas)] p-5 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-[var(--site-radius-control)] border border-[var(--site-border-subtle)] bg-[var(--site-surface)] text-[var(--site-action)]">
              {agentType === 'chat' ? <SearchIcon className="h-5 w-5" /> : <OpenAIIcon className="h-5 w-5" />}
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-semibold text-[var(--site-text)]">{t(`${copyKey}.title`)}</h1>
              <p className="mt-1 text-sm leading-6 text-[var(--site-text-muted)]">{t(`${copyKey}.subtitle`)}</p>
              {targetLabel ? (
                <div className="mt-3 inline-flex rounded-[var(--site-radius-chip)] border border-[var(--site-action)] bg-[var(--site-surface)] px-3 py-1 text-xs font-medium text-[var(--site-action)]">
                  {targetLabel}
                </div>
              ) : null}
            </div>
          </div>
        </header>

        <section className="rounded-[var(--site-radius-card)] border border-[var(--site-border)] bg-[var(--site-canvas)] shadow-sm">
          <div className="min-h-[480px] px-4 py-5 sm:px-6">
            {messages.length === 0 && !loading ? (
              <div className="grid h-full place-items-center text-center">
                <div>
                  <OpenAIIcon className="mx-auto mb-4 h-12 w-12 text-[var(--site-text-tertiary)]" />
                  <p className="text-sm text-[var(--site-text-tertiary)]">{t(`${copyKey}.empty`)}</p>
                  {initialQuestion ? (
                    <button
                      className="mt-4 rounded-[var(--site-radius-chip)] bg-[var(--site-text)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--site-text)]"
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
                  className={message.role === 'user' ? 'flex justify-end' : 'flex justify-start'}
                >
                  <div
                    className={
                      message.role === 'user'
                        ? 'max-w-[82%] rounded-[var(--site-radius-control)] bg-[var(--site-text)] px-4 py-3 text-sm leading-6 text-white'
                        : 'max-w-[88%] rounded-[var(--site-radius-control)] border border-[var(--site-border-subtle)] bg-[var(--site-surface)] px-4 py-3 text-sm leading-6 text-[var(--site-text)]'
                    }
                  >
                    {message.role === 'assistant' ? (
                      <MarkdownRenderer
                        autoLinkTargets={getArticleSupportLinkTargets(message)}
                        content={message.content}
                      />
                    ) : (
                      <div className="whitespace-pre-wrap">{message.content}</div>
                    )}
                    {message.handoff ? (
                      <button
                        className="mt-4 inline-flex items-center rounded-[var(--site-radius-chip)] bg-[var(--site-action)] px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-[var(--site-action)]"
                        onClick={() => goHandoff(message)}
                      >
                        {t('continueIn', {
                          agent: t(message.handoff.targetAgent === 'chat' ? 'chat.title' : 'articleSupport.title'),
                        })}
                        <ArrowRightIcon className="ml-1 h-3.5 w-3.5" />
                      </button>
                    ) : null}
                    {message.role === 'assistant' && messages.at(-1)?.id === message.id ? (
                      <RunSummaryPanel summary={runSummary} t={t} />
                    ) : null}
                  </div>
                </div>
              ))}
              {loading ? (
                <div className="flex justify-start">
                  <div className="rounded-[var(--site-radius-control)] border border-[var(--site-border-subtle)] bg-[var(--site-surface)] px-4 py-3 text-sm text-[var(--site-text-tertiary)]">
                    {t('thinking')}
                  </div>
                </div>
              ) : null}
              <div ref={bottomRef} />
            </div>
          </div>

          <form className="sticky bottom-0 z-10 rounded-b-[var(--site-radius-card)] border-t border-[var(--site-border-subtle)] bg-[var(--site-canvas)]/95 p-4 shadow-[0_-1px_2px_rgba(0,0,0,0.04)] backdrop-blur supports-[backdrop-filter]:bg-[var(--site-canvas)]/85" onSubmit={sendMessage}>
            {error ? <div className="mb-3 text-sm text-red-600">{error}</div> : null}
            <div className="flex gap-3">
              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder={t(`${copyKey}.placeholder`)}
                rows={2}
                className="min-h-12 flex-1 resize-none rounded-[var(--site-radius-control)] border border-[var(--site-border)] bg-[var(--site-canvas)] px-4 py-3 text-sm text-[var(--site-text)] outline-none transition-colors placeholder:text-[var(--site-text-tertiary)] focus:border-[var(--site-focus-ring)]"
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault()
                    sendMessage()
                  }
                }}
              />
              <button
                type="submit"
                disabled={!input.trim() || loading || !session}
                className="h-12 rounded-[var(--site-radius-control)] bg-[var(--site-text)] px-5 text-sm font-medium text-white transition-colors hover:bg-[var(--site-text)] disabled:cursor-not-allowed disabled:bg-[var(--site-border)]"
              >
                {t('send')}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  )
}
