'use client'

import HomeSectionSkeleton from '../HomeSectionSkeleton'
import { Link } from '@/ui'
import { useTranslations } from 'next-intl'
import { NAVIGATION_ITEMS } from '@/constants'

interface AboutSectionProps {
  index: number
  href: string
}

export default function AboutSection({ index, href }: AboutSectionProps) {
  const t = useTranslations('HomePage')
  const navT = useTranslations('Navigation')

  // 获取about section的导航配置
  const aboutNav = NAVIGATION_ITEMS.find(item => item.type === '__about')
  const submenuItems = aboutNav?.submenu?.items || []

  return (
    <HomeSectionSkeleton index={index}>
      <div className="max-w-3xl">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
          {t('aboutTitle', { default: '关于我' })}
        </h2>
        <p className="mt-4 sm:mt-6 text-base sm:text-lg lg:text-xl text-gray-600">
          {t('aboutIntro', { default: '我是谁，我的故事，联系我。' })}
        </p>

        {/* 快速导航链接 */}
        {submenuItems.length > 0 && (
          <div className="mt-8 sm:mt-10">
            <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
              {submenuItems.map((item, itemIndex) => (
                <div key={itemIndex}>
                  <div className="group">
                    <Link
                      href={item.href}
                      className="block"
                    >
                        <h3 className="text-sm font-semibold text-gray-900 group-hover:text-gray-700">
                          {navT(item.label as keyof typeof navT, { default: item.label })}
                        </h3>
                    </Link>
                    {item.items && item.items.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {item.items.slice(0, 2).map((subItem, subIndex) => (
                          <div key={subIndex} className="flex items-center gap-2">
                            <div className="h-1 w-1 rounded-full bg-gray-400" />
                            <Link
                              href={subItem.href}
                              className="text-xs text-gray-600 hover:text-gray-900"
                            >
                              {navT(subItem.label as keyof typeof navT, { default: subItem.label })}
                            </Link>
                          </div>
                        ))}
                        {item.items.length > 2 && (
                          <div className="flex items-center gap-2">
                            <div className="h-1 w-1 rounded-full bg-gray-400" />
                            <span className="text-xs text-gray-500">
                              +{item.items.length - 2} {t('more', { default: '更多' })}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 sm:mt-8">
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

 