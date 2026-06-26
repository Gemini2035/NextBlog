'use client'

import { useEffect, useState } from 'react'
import styles from './Message.module.css'

export type MessageType = 'success' | 'info' | 'warning' | 'error'

export interface MessageOptions {
  content: string
  duration?: number
  type?: MessageType
}

interface MessageNotice {
  content: string
  duration: number
  id: number
  leaving?: boolean
  type: MessageType
}

type MessageListener = (notice: MessageNotice) => void

const listeners = new Set<MessageListener>()
let messageId = 0

const DEFAULT_DURATION = 2000
const EXIT_ANIMATION_DURATION = 180

const notify = (options: MessageOptions) => {
  const notice: MessageNotice = {
    content: options.content,
    duration: options.duration ?? DEFAULT_DURATION,
    id: messageId,
    type: options.type ?? 'info',
  }

  messageId += 1
  listeners.forEach((listener) => listener(notice))
}

export const message = {
  error: (content: string, duration?: number) => notify({ content, duration, type: 'error' }),
  info: (content: string, duration?: number) => notify({ content, duration, type: 'info' }),
  open: notify,
  success: (content: string, duration?: number) => notify({ content, duration, type: 'success' }),
  warning: (content: string, duration?: number) => notify({ content, duration, type: 'warning' }),
}

export function MessageContainer() {
  const [notices, setNotices] = useState<MessageNotice[]>([])

  useEffect(() => {
    const timers = new Set<number>()

    const handleNotice = (notice: MessageNotice) => {
      setNotices((currentNotices) => [...currentNotices, notice])

      const leaveTimer = window.setTimeout(() => {
        setNotices((currentNotices) => currentNotices.map((currentNotice) => {
          if (currentNotice.id !== notice.id) {
            return currentNotice
          }

          return {
            ...currentNotice,
            leaving: true,
          }
        }))

        const removeTimer = window.setTimeout(() => {
          setNotices((currentNotices) => currentNotices.filter((currentNotice) => currentNotice.id !== notice.id))
          timers.delete(removeTimer)
        }, EXIT_ANIMATION_DURATION)

        timers.add(removeTimer)
        timers.delete(leaveTimer)
      }, notice.duration)

      timers.add(leaveTimer)
    }

    listeners.add(handleNotice)
    return () => {
      listeners.delete(handleNotice)
      timers.forEach((timer) => window.clearTimeout(timer))
    }
  }, [])

  if (notices.length === 0) {
    return null
  }

  return (
    <div className={styles.messageRoot}>
      {notices.map((notice) => (
        <div
          className={styles.messageItem}
          data-message-leaving={notice.leaving ? 'true' : undefined}
          data-message-type={notice.type}
          key={notice.id}
          role="status"
        >
          <span className={styles.messageIndicator} />
          <span className={styles.messageContent}>{notice.content}</span>
        </div>
      ))}
    </div>
  )
}
