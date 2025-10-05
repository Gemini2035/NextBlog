'use client'

import { SITE_CONFIG } from '@/constants'
import { GlobeIcon } from '@/assets/icons'
import { useTranslations } from 'next-intl'

interface BasicInfoDetailProps {
  className?: string
}

export default function BasicInfoDetail({ className }: BasicInfoDetailProps) {
  const t = useTranslations('AboutPage')
  const navT = useTranslations('Navigation')

  return (
    <div className={className}>
      <div className="flex items-center mb-8">
        <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mr-6">
          <GlobeIcon className="w-8 h-8 text-blue-600" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {navT('Personal Profile')}
          </h2>
          <p className="text-lg text-gray-600">
            {t('personalProfileDetailSubtitle')}
          </p>
        </div>
      </div>
      
      {/* 完整的个人简介 */}
      <div className="mb-8" id="basic">
        <h3 className="text-2xl font-semibold text-gray-900 mb-6">
          {t('aboutMe')}
        </h3>
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-700 leading-relaxed mb-4">
            {t('welcome', { siteTitle: SITE_CONFIG.title })}
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            {t('personalProfileDetail1')}
          </p>
          <p className="text-gray-700 leading-relaxed">
            {t('personalProfileDetail2')}
          </p>
        </div>
      </div>

    </div>
  )
}
