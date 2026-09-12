'use client'

import { FormEvent, useEffect, useRef, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { createAgentSession, streamUnifiedAgentMessage } from '@/apis/agent'
import { OpenAIIcon } from '@/assets/icons'
import { MarkdownRenderer } from '@/components/MarkdownRenderer'
import type { AgentMessage, AgentSession } from '@/types/agent'

interface UnifiedAgentPageProps {
  initialQuestion?: string
}

const getDeviceKey = () => {
  const storageKey = 'nextblog.agent.device_key'
  const existing = window.localStorage.getItem(storageKey)
  if (existing) return existing
  const key = `device_${crypto.randomUUID()}`
  window.localStorage.setItem(storageKey, key)
  return key
}

const getToolLabel = (tool: string, t: ReturnType<typeof useTranslations>) => {
  if (tool.includes('post')) return t('tool.searchPosts')
  if (tool.includes('article')) return t('tool.readArticle')
  return t('tool.searchSite')
}

export function UnifiedAgentPage({ initialQuestion }: UnifiedAgentPageProps) {
  const t = useTranslations('Agent')
  const locale = useLocale()
  const [session, setSession] = useState<AgentSession | null>(null)
  const [messages, setMessages] = useState<AgentMessage[]>([])
  const [input, setInput] = useState(initialQuestion ?? '')
  const [loading, setLoading] = useState(false)
  const [messageErrors, setMessageErrors] = useState<Record<string, string>>({})
  const [toolStatus, setToolStatus] = useState('')
  const cleanupRef = useRef<(() => void) | null>(null)
  const messageListRef = useRef<HTMLDivElement | null>(null)
  const bottomRef = useRef<HTMLDivElement | null>(null)
  const draftIdRef = useRef<string | number | null>(null)
  const deltaBufferRef = useRef('')
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const streamFinishedRef = useRef(false)
  const finalMessageRef = useRef<AgentMessage | null>(null)

  useEffect(() => {
    let active = true
    setLoading(true)
    createAgentSession(getDeviceKey(), locale)
      .then((response) => {
        if (!active) return
        setSession(response.data)
        setMessages(response.data.messages ?? [])
      })
      .catch(() => undefined)
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
      cleanupRef.current?.()
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current)
    }
  }, [locale])

  const finishDisplayedMessage = () => {
    if (!streamFinishedRef.current || deltaBufferRef.current) return
    const finalMessage = finalMessageRef.current
    if (finalMessage && draftIdRef.current) {
      setMessages((current) => current.map((item) => (
        item.id === draftIdRef.current ? finalMessage : item
      )))
    }
    finalMessageRef.current = null
    draftIdRef.current = null
    streamFinishedRef.current = false
    setLoading(false)
    setToolStatus('')
  }

  const flushTypingBuffer = () => {
    typingTimerRef.current = null
    if (deltaBufferRef.current) {
      const visibleLength = Math.max(1, Math.min(4, Math.ceil(deltaBufferRef.current.length / 12)))
      const visibleDelta = deltaBufferRef.current.slice(0, visibleLength)
      deltaBufferRef.current = deltaBufferRef.current.slice(visibleLength)
      const draftId = draftIdRef.current ?? `draft-${Date.now()}`
      draftIdRef.current = draftId
      setMessages((current) => {
        const existing = current.find((message) => message.id === draftId)
        if (!existing) {
          return [...current, {
            id: draftId,
            role: 'assistant',
            content: visibleDelta,
            citations: [],
            createdAt: new Date().toISOString(),
          }]
        }
        return current.map((message) => message.id === draftId
          ? { ...message, content: `${message.content}${visibleDelta}` }
          : message)
      })
    }
    if (deltaBufferRef.current) {
      typingTimerRef.current = setTimeout(flushTypingBuffer, 30)
    } else {
      finishDisplayedMessage()
    }
  }

  const scheduleTyping = () => {
    if (typingTimerRef.current) return
    typingTimerRef.current = setTimeout(flushTypingBuffer, 30)
  }

  const appendDelta = (delta: string) => {
    deltaBufferRef.current += delta
    scheduleTyping()
  }

  const resetStreamDisplay = () => {
    deltaBufferRef.current = ''
    streamFinishedRef.current = false
    finalMessageRef.current = null
    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current)
      typingTimerRef.current = null
    }
  }

  const sendMessage = (event?: FormEvent) => {
    event?.preventDefault()
    const content = input.trim()
    if (!content || !session || loading) return
    cleanupRef.current?.()
    const pendingId = `pending-${Date.now()}`
    resetStreamDisplay()
    draftIdRef.current = null
    setMessages((current) => [...current, { id: pendingId, role: 'user', content, citations: [], createdAt: new Date().toISOString() }])
    setTimeout(() => {
      const messageList = messageListRef.current
      if (messageList) messageList.scrollTop = messageList.scrollHeight
    }, 0)
    setInput('')
    setMessageErrors((current) => {
      const next = { ...current }
      delete next[String(pendingId)]
      return next
    })
    setToolStatus('')
    setLoading(true)
    cleanupRef.current = streamUnifiedAgentMessage(
      session.id,
      { content, clientMessageId: crypto.randomUUID() },
      getDeviceKey(),
      locale,
      {
        onDelta: appendDelta,
        onToolStatus: (tool, completed) => setToolStatus(completed ? '' : getToolLabel(tool, t)),
        onAssistantMessage: (message) => {
          finalMessageRef.current = message
          if (!deltaBufferRef.current && !typingTimerRef.current) {
            setMessages((current) => {
              const draftId = draftIdRef.current
              const finalMessage = finalMessageRef.current ?? message
              if (draftId) return current.map((item) => item.id === draftId ? finalMessage : item)
              const lastAssistantIndex = current.findLastIndex((item) => item.role === 'assistant')
              const lastAssistant = lastAssistantIndex >= 0 ? current[lastAssistantIndex] : undefined
              if (lastAssistant?.content === finalMessage.content) return current
              return [...current, finalMessage]
            })
            draftIdRef.current = null
          }
        },
        onDone: () => {
          cleanupRef.current = null
          streamFinishedRef.current = true
          if (deltaBufferRef.current) {
            scheduleTyping()
          } else {
            finishDisplayedMessage()
          }
        },
        onError: (streamError) => {
          cleanupRef.current = null
          resetStreamDisplay()
          setLoading(false)
          setToolStatus('')
          setInput(content)
          setMessageErrors((current) => ({ ...current, [String(pendingId)]: streamError.message }))
        },
      },
    )
  }

  const stopGeneration = () => {
    cleanupRef.current?.()
    cleanupRef.current = null
    setLoading(false)
    setToolStatus('')
  }

  return (
    <div className="min-h-[calc(100dvh-4rem)] bg-[var(--site-canvas-muted)]">
      <div className="mx-auto flex min-h-[calc(100dvh-4rem)] max-w-5xl flex-col px-4 py-4 sm:px-6 lg:px-8">
        <header className="mb-4 rounded-[var(--site-radius-card)] border border-[var(--site-border)] bg-[var(--site-canvas)] p-5 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-[var(--site-radius-control)] border border-[var(--site-border-subtle)] bg-[var(--site-surface)] text-[var(--site-action)]"><OpenAIIcon className="h-5 w-5" /></div>
            <div><h1 className="text-2xl font-semibold text-[var(--site-text)]">{t('title')}</h1><p className="mt-1 text-sm leading-6 text-[var(--site-text-muted)]">{t('subtitle')}</p></div>
          </div>
        </header>
        <section className="relative flex h-[calc(100dvh-13rem)] min-h-0 flex-col rounded-[var(--site-radius-card)] border border-[var(--site-border)] bg-[var(--site-canvas)] shadow-sm">
          <div ref={messageListRef} className="min-h-0 flex-1 overflow-y-auto overscroll-contain [overflow-anchor:none] px-4 py-5 sm:px-6">
            {messages.length === 0 && !loading ? <div className="grid h-full min-h-48 place-items-center text-sm text-[var(--site-text-tertiary)]">{t('empty')}</div> : null}
            <div className="space-y-5">
              {messages.map((message) => (
                <div key={message.id} className={message.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
                  <div className="flex w-full flex-col">
                  <div className={message.role === 'user' ? 'max-w-[88%] self-end rounded-[var(--site-radius-control)] bg-[var(--site-text)] px-4 py-3 text-sm leading-6 text-white' : 'max-w-[88%] rounded-[var(--site-radius-control)] border border-[var(--site-border-subtle)] bg-[var(--site-surface)] px-4 py-3 text-sm leading-6 text-[var(--site-text)]'}>
                    {message.role === 'assistant' ? <MarkdownRenderer content={message.content} linkTarget="_blank" /> : <div className="whitespace-pre-wrap">{message.content}</div>}
                  </div>
                  {message.role === 'user' && messageErrors[String(message.id)] ? <div className="mt-2 self-end text-right text-sm text-red-600">{messageErrors[String(message.id)]}</div> : null}
                  </div>
                </div>
              ))}
              {loading ? <div className="text-sm text-[var(--site-text-tertiary)]">{toolStatus || t('thinking')}</div> : null}
              <div ref={bottomRef} className="h-px" />
            </div>
          </div>
          <form className="sticky bottom-0 z-10 rounded-b-[var(--site-radius-card)] bg-[var(--site-canvas)]/95 p-4 backdrop-blur" onSubmit={sendMessage}>
            <div className="border-t border-[var(--site-border-subtle)] pt-4">
              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder={t('placeholder')}
                rows={2}
                className="block min-h-20 w-full resize-none rounded-xl border-0 bg-transparent px-4 py-3 text-base leading-7 text-[var(--site-text)] outline-none placeholder:text-[var(--site-text-tertiary)]"
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault()
                    sendMessage()
                  }
                }}
              />
              <div className="mt-2 flex justify-end">
                {loading ? (
                  <button type="button" onClick={stopGeneration} className="grid h-11 w-11 place-items-center rounded-full bg-[var(--site-text)] text-white shadow-sm" aria-label={t('stop')}>
                    <span className="h-3.5 w-3.5 rounded-sm bg-current" />
                  </button>
                ) : (
                  <button type="submit" disabled={!input.trim() || !session} className="grid h-11 w-11 place-items-center rounded-full bg-[var(--site-text)] text-2xl leading-none text-white shadow-sm transition-opacity disabled:cursor-not-allowed disabled:bg-[var(--site-border)]" aria-label={t('send')}>
                    ↑
                  </button>
                )}
              </div>
            </div>
          </form>
        </section>
      </div>
    </div>
  )
}
