'use client'

import { GlobeIcon } from '@/assets/icons'
import { useTranslations } from 'next-intl'
import { FC } from 'react'
import { useAboutRecord } from '@/components/About/AboutDataProvider'

interface BasicInfoBriefProps {
  className?: string
}

const BasicInfoBrief: FC<BasicInfoBriefProps> = ({ className }) => {
  const navT = useTranslations('Navigation')
  const baseInfo = useAboutRecord('base_info')

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
        dangerouslySetInnerHTML={{ __html: baseInfo.summary ?? '' }}
      />

    </div>
  )
}

export default BasicInfoBrief;
