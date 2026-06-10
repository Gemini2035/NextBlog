'use client'

import { QuestionIcon } from '@/assets/icons'
import { Link } from '@/ui'
import { useTranslations } from 'next-intl'
import { MobileInlineContact } from './mobile'

interface ContactButtonProps {
  postId: string
  title: string
}

/**
 * Article support entry.
 * Desktop: fixed floating button.
 * Mobile: inline card.
 */
export function ContactButton({ postId, title }: ContactButtonProps) {
  const t = useTranslations('Agent')
  const href = `/agent/article-support?postId=${encodeURIComponent(postId)}`

  return (
    <>
      <MobileInlineContact href={href} title={title} />
      <Link
        href={href}
        className="fixed bottom-6 right-6 z-40 hidden h-14 w-14 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg transition-all duration-300 hover:bg-blue-700 hover:shadow-xl md:flex md:bottom-24"
        aria-label={t('articleSupportButton')}
        title={t('articleSupportButton')}
        target="_blank"
        rel="noopener noreferrer"
      >
        <QuestionIcon
          size={24}
          className="text-white transition-transform duration-200 hover:scale-110"
        />
      </Link>
    </>
  )
}
