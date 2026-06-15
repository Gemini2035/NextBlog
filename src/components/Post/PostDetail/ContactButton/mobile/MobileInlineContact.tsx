'use client'

import { QuestionIcon } from '@/assets/icons'
import { Link } from '@/ui'
import { cn } from '@/utils'
import { useTranslations } from 'next-intl'

interface MobileInlineContactProps {
  href: string
  title: string
}

/**
 * Mobile article support entry.
 */
export function MobileInlineContact({ href, title }: MobileInlineContactProps) {
  const t = useTranslations('Agent')

  return (
    <div className={cn('mt-8 rounded-lg border border-blue-200 bg-blue-50 p-4 md:hidden')}>
      <div className="flex items-start gap-3">
        <div className={cn('flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-600')}>
          <QuestionIcon
            size={20}
            className="text-white"
          />
        </div>
        <div className="flex-1">
          <h3 className="mb-1 text-sm font-semibold text-gray-900">{t('articleSupportTitle')}</h3>
          <Link
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'text-sm text-blue-600 hover:text-blue-800',
              'font-medium underline underline-offset-2',
              'transition-colors duration-200'
            )}
          >
            {t('articleSupportDescription', { title })}
          </Link>
        </div>
      </div>
    </div>
  )
}
