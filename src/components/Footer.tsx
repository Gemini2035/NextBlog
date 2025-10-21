'use client'

import { SITE_CONFIG } from '@/constants'
import { useTranslations } from 'next-intl'
import { LogoIcon } from '@/assets/icons'
import { Link, Divider } from '@/ui'
import { cn } from '@/utils'

export default function Footer() {
  const t = useTranslations('Footer')
  const currentYear = new Date().getFullYear()
  const baseYear = SITE_CONFIG.baseYear

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const getCopyrightYear = () => {
    if (currentYear === baseYear) {
      return `© ${baseYear}`
    }
    return `© ${baseYear} - ${currentYear}`
  }

  return (
    <footer className={cn('bg-gray-50 border-t border-gray-200')}>
      <div className={cn('max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4')}>
        {/* 移动端和桌面端：横向布局，icon始终在右侧 */}
        <div className={cn('flex items-start md:items-center justify-between gap-4')}>
          {/* 左侧：版权信息和政策链接 */}
          <div className={cn('flex flex-col md:flex-row md:items-center gap-3 md:gap-6 flex-1')}>
            {/* 版权信息 */}
            <div className={cn('flex flex-wrap items-center gap-1 text-xs md:text-sm text-gray-600')}>
              <span>{getCopyrightYear()}</span>
              <span>{SITE_CONFIG.title}</span>
              <span className={cn('hidden md:inline')}>·</span>
              <Link
                href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.en"
                external
                target="_blank"
                rel="noopener noreferrer"
                className={cn('hover:text-gray-800 transition-colors text-xs md:text-sm')}
              >
                CC BY-NC-SA 4.0
              </Link>
            </div>

            {/* 分隔线 - 仅在桌面端显示 */}
            <Divider orientation="vertical" thickness="thin" className={cn('hidden md:block h-4 bg-gray-300')} />

            {/* 政策链接 */}
            <div className={cn('flex items-center gap-3 md:gap-4 text-xs md:text-sm')}>
              <Link
                href="/policies#terms"
                className={cn('text-gray-600 hover:text-gray-800 transition-colors whitespace-nowrap')}
              >
                {t('terms')}
              </Link>
              <Link
                href="/policies#privacy"
                className={cn('text-gray-600 hover:text-gray-800 transition-colors whitespace-nowrap')}
              >
                {t('privacy')}
              </Link>
              <Link
                href="/policies#security"
                className={cn('text-gray-600 hover:text-gray-800 transition-colors whitespace-nowrap')}
              >
                {t('security')}
              </Link>
            </div>
          </div>

          {/* 右侧：站点图标（返回顶部） - 始终在右侧 */}
          <button
            onClick={scrollToTop}
            className={cn(
              'flex items-center justify-center shrink-0',
              'p-2 rounded-md',
              'hover:bg-gray-100 active:bg-gray-200',
              'transition-colors cursor-pointer'
            )}
            aria-label={t('backToTop')}
          >
            <LogoIcon className={cn('w-7 h-7 md:w-8 md:h-8 text-gray-600')} />
          </button>
        </div>
      </div>
    </footer>
  )
}

