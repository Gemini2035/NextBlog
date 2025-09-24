'use client'

import { SITE_CONFIG } from '@/constants'
import { useTranslations } from 'next-intl'
import LogoIcon from '@/assets/icons/LogoIcon'
import { Link, Divider } from '@/ui'

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
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* 左侧：版权信息和政策链接 */}
          <div className="flex items-center gap-6">
            {/* 版权信息 */}
            <div className="flex items-center gap-1 text-sm text-gray-600 whitespace-nowrap">
              <span>{getCopyrightYear()}</span>
              <span>{SITE_CONFIG.title}</span>
              <span>·</span>
              <Link
                href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.en"
                external
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-800 transition-colors"
              >
                {t('license')}
              </Link>
            </div>

            {/* 分隔线 */}
            <Divider orientation="vertical" thickness="thin" className="h-4 bg-gray-300" />

            {/* 政策链接 */}
            <div className="flex items-center gap-4 text-sm whitespace-nowrap">
              <Link
                href="/policies/terms"
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                {t('terms')}
              </Link>
              <Link
                href="/policies/privacy"
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                {t('privacy')}
              </Link>
              <Link
                href="/policies/security"
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                {t('security')}
              </Link>
            </div>
          </div>

          {/* 右侧：站点图标（返回顶部） */}
          <button
            onClick={scrollToTop}
            className="flex items-center justify-center p-2 hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="返回顶部"
          >
            <LogoIcon className="w-8 h-8 text-gray-600" />
          </button>
        </div>
      </div>
    </footer>
  )
}
