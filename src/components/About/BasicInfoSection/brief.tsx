'use client'

import { SITE_CONFIG } from '@/constants'
import { GlobeIcon } from '@/assets/icons'
import { useTranslations } from 'next-intl'

interface BasicInfoBriefProps {
  className?: string
}

export default function BasicInfoBrief({ className }: BasicInfoBriefProps) {
  const t = useTranslations('AboutPage')
  const navT = useTranslations('Navigation')

  return (
    <div className={className}>
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
          <GlobeIcon className="w-5 h-5 text-blue-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">
          {navT('Personal Profile')}
        </h2>
      </div>
      
      {/* 简化的个人简介 */}
      <div className="mb-6">
        <p className="text-gray-600 leading-relaxed text-sm">
          {t('welcome', { siteTitle: SITE_CONFIG.title })}
        </p>
        <p className="text-gray-600 leading-relaxed mt-2 text-sm">
          {t('personalProfileDescription')}
        </p>
      </div>

    </div>
  )
}
