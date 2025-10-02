'use client'

import HomeSectionSkeleton from '../HomeSectionSkeleton'
import { Link } from '@/ui'
import { useTranslations } from 'next-intl'

interface AboutSectionProps {
  index: number
  href: string
}

export default function AboutSection({ index, href }: AboutSectionProps) {
  const t = useTranslations('HomePage')

  return (
    <HomeSectionSkeleton index={index}>
      <div className="max-w-3xl">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
          {t('aboutTitle', { default: '关于我' })}
        </h2>
        <p className="mt-4 sm:mt-6 text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300/90">
          {t('aboutIntro', { default: '一点背景、方向与价值观，帮你更快建立认知。' })}
        </p>

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

 