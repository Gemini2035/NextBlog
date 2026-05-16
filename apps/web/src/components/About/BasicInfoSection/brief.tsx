'use client'

import { BASE_INFO } from '@/constants'
import { GlobeIcon } from '@/assets/icons'
import { useLocale, useTranslations } from 'next-intl'
import { FC } from 'react'

interface BasicInfoBriefProps {
  className?: string
}

const BasicInfoBrief: FC<BasicInfoBriefProps> = ({ className }) => {
  const locale = useLocale()
  const navT = useTranslations('Navigation')

  const baseInfo = BASE_INFO[locale as keyof typeof BASE_INFO]

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
      <div 
        className="mb-6"
        dangerouslySetInnerHTML={{ __html: baseInfo.summary }}
      />

    </div>
  )
}

export default BasicInfoBrief;