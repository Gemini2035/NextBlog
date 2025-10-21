'use client'

import { QuestionIcon } from '@/assets/icons'
import { useTranslations } from 'next-intl'
import { Link } from '@/ui'
import { cn } from '@/utils'

/**
 * 移动端内联联系卡片
 * 显示在文章底部的卡片式布局
 */
export function MobileInlineContact() {
  const t = useTranslations('Contact')

  return (
    <div className={cn('mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg')}>
      <div className="flex items-start gap-3">
        <div className={cn('flex-shrink-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center')}>
          <QuestionIcon 
            size={20} 
            className="text-white" 
          />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">
            {t('title')}
          </h3>
          <Link 
            href="/about" 
            className={cn(
              'text-sm text-blue-600 hover:text-blue-800',
              'font-medium underline underline-offset-2',
              'transition-colors duration-200'
            )}
          >
            {t('description')}
          </Link>
        </div>
      </div>
    </div>
  )
}

