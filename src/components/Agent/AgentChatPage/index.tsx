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
import { Link } from '@/ui'
import type { AgentMessage, AgentSession, AgentType } from '@/types/agent'

interface AgentChatPageProps {
  agentType: AgentType
  initialQuestion?: string
  targetPostId?: string
}

const MAX_VISIBLE_SOURCES = 3

type AgentRequestError = Error & {
  retryAfterSeconds?: number
  details?: unknown
}

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null
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
    <div className="min-h-[calc(100vh-8rem)] bg-gray-50">
      <div className="mx-auto flex max-w-5xl flex-col px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-6 rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-600">
              {agentType === 'chat' ? <SearchIcon className="h-5 w-5" /> : <OpenAIIcon className="h-5 w-5" />}
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-semibold text-gray-900">{t(`${copyKey}.title`)}</h1>
              <p className="mt-1 text-sm leading-6 text-gray-600">{t(`${copyKey}.subtitle`)}</p>
              {targetLabel ? (
                <div className="mt-3 inline-flex rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                  {targetLabel}
                </div>
              ) : null}
            </div>
          </div>
        </header>

        <section className="min-h-[480px] rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="h-[min(62vh,620px)] overflow-y-auto px-4 py-5 sm:px-6">
            {messages.length === 0 && !loading ? (
              <div className="grid h-full place-items-center text-center">
                <div>
                  <OpenAIIcon className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                  <p className="text-sm text-gray-500">{t(`${copyKey}.empty`)}</p>
                  {initialQuestion ? (
                    <button
                      className="mt-4 rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
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
                        ? 'max-w-[82%] rounded-lg bg-gray-900 px-4 py-3 text-sm leading-6 text-white'
                        : 'max-w-[88%] rounded-lg border border-gray-100 bg-gray-50 px-4 py-3 text-sm leading-6 text-gray-800'
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
                    {agentType === 'chat' && message.role === 'assistant' && message.sources.length > 0 ? (
                      <div className="mt-4 space-y-2 border-t border-gray-200 pt-3">
                        <div className="text-xs font-semibold text-gray-500">{t('sourcesTitle')}</div>
                        {message.sources.slice(0, MAX_VISIBLE_SOURCES).map((source) => (
                          <Link
                            key={`${source.type}-${source.id}`}
                            href={source.href}
                            className="group flex items-center justify-between gap-3 rounded-md bg-white px-3 py-2 text-gray-800 ring-1 ring-gray-100 transition-colors hover:bg-gray-50"
                          >
                            <span className="min-w-0 truncate text-xs font-medium">{source.title}</span>
                            <ArrowRightIcon className="h-4 w-4 shrink-0 text-gray-400 group-hover:text-gray-600" />
                          </Link>
                        ))}
                      </div>
                    ) : null}
                    {message.handoff ? (
                      <button
                        className="mt-4 inline-flex items-center rounded-full bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-blue-700"
                        onClick={() => goHandoff(message)}
                      >
                        {t('continueIn', {
                          agent: t(message.handoff.targetAgent === 'chat' ? 'chat.title' : 'articleSupport.title'),
                        })}
                        <ArrowRightIcon className="ml-1 h-3.5 w-3.5" />
                      </button>
                    ) : null}
                  </div>
                </div>
              ))}
              {loading ? (
                <div className="flex justify-start">
                  <div className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-500">
                    {t('thinking')}
                  </div>
                </div>
              ) : null}
              <div ref={bottomRef} />
            </div>
          </div>

          <form className="border-t border-gray-100 p-4" onSubmit={sendMessage}>
            {error ? <div className="mb-3 text-sm text-red-600">{error}</div> : null}
            <div className="flex gap-3">
              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder={t(`${copyKey}.placeholder`)}
                rows={2}
                className="min-h-12 flex-1 resize-none rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-gray-400"
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
                className="h-12 rounded-lg bg-gray-900 px-5 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
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
