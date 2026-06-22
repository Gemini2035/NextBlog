'use client'

import { useTranslations } from 'next-intl'
import { ClockIcon } from '@/assets/icons'
import { FC } from 'react'
import { useAboutList } from '@/components/About/AboutDataProvider'
import type { DevelopmentHistoryItem } from './types'
import { formatPeriod, getDisplayVersion, getTermStyle } from './utils'

interface DevelopmentHistoryBriefProps {
  className?: string
}

const DevelopmentHistoryBrief: FC<DevelopmentHistoryBriefProps> = ({ className }) => {
  const t = useTranslations('AboutPage')
  const developmentHistory = useAboutList<DevelopmentHistoryItem>('development_history')

  return (
    <div className={className}>
      <div className="flex flex-col sm:flex-row sm:items-center mb-3 sm:mb-4">
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3 mb-2 sm:mb-0">
          <ClockIcon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-gray-900">
          {t('DevelopmentHistory.title')}
        </h2>
      </div>

      <div className="space-y-3 sm:space-y-4">
        <div className="relative">
          <div className="absolute left-2 sm:left-3 top-0 bottom-0 w-0.5 bg-gray-300"></div>

          <div className="space-y-3 sm:space-y-4">
            {developmentHistory.map((item) => {
              const statusStyle = getTermStyle(item.status)
              const period = formatPeriod(item, t('DevelopmentHistory.present'))
              const displayVersion = getDisplayVersion(item.version, true)

              return (
                <div className="relative flex items-start space-x-3" key={item.id}>
                  <div
                    className="shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full border border-gray-200 bg-white text-gray-900 flex items-center justify-center"
                    style={statusStyle}
                  >
                    <span className="text-xs font-bold">{displayVersion}</span>
                  </div>
                  <div className="flex-1 bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 space-y-1 sm:space-y-0">
                      <h3 className="text-xs sm:text-sm font-semibold text-gray-900">
                        {item.title}
                      </h3>
                      <span
                        className="px-2 py-0.5 text-xs rounded-full self-start sm:self-auto border border-gray-200 bg-white text-gray-900"
                        style={statusStyle}
                      >
                        {period}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">
                      {item.summary}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {item.tags.map((tag) => (
                        <span
                          className="px-2 py-0.5 text-xs rounded-full border border-gray-200 bg-white text-gray-900"
                          style={getTermStyle(tag)}
                          key={tag.key}
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DevelopmentHistoryBrief
