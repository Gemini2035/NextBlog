'use client'

import HomeSectionSkeleton from '../HomeSectionSkeleton'
import { Link } from '@/ui'
import { useTranslations } from 'next-intl'
import { NAVIGATION_ITEMS } from '@/constants'

interface ResourcesSectionProps {
  index: number
  href: string
}

export default function ResourcesSection({ index, href }: ResourcesSectionProps) {
  const t = useTranslations('HomePage')
  const navT = useTranslations('Navigation')

  // 获取resources section的导航配置
  const resourcesNav = NAVIGATION_ITEMS.find(item => item.type === '__resources')
  const submenuItems = resourcesNav?.submenu?.items || []

  return (
    <HomeSectionSkeleton index={index}>
      <div className="max-w-3xl">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
          {t('resourcesTitle', { default: '资源' })}
        </h2>
        <p className="mt-4 sm:mt-6 text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300/90">
          {t('resourcesIntro', { default: '工具与清单，帮你提升效率与质量。' })}
        </p>

        {/* 快速导航链接 */}
        {submenuItems.length > 0 && (
          <div className="mt-8 sm:mt-10">
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {submenuItems.map((item, itemIndex) => (
                item.items && item.items.length > 0 && (
                  item.items.map((subItem, subIndex) => (
                    <Link
                      key={`${itemIndex}-${subIndex}`}
                      href={subItem.href}
                      className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      {navT(subItem.label as keyof typeof navT, { default: subItem.label })}
                    </Link>
                  ))
                )
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 sm:mt-10">
          <Link
            href={href}
            className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold shadow-sm focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-gray-900 text-white hover:bg-black focus-visible:outline-gray-900"
          >
            <span>{t('viewMore', { default: '了解更多' })}</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M7 17L17 7M17 7H8M17 7V16" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
    </HomeSectionSkeleton>
  )
}

 