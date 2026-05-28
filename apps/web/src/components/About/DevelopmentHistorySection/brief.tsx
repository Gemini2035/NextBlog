'use client'

import { useTranslations } from 'next-intl'
import { ClockIcon } from '@/assets/icons'
import { cn } from '@/utils'
import { FC } from 'react'
import { TagColorMap } from './constants'
import { useAboutList } from '@/components/About/AboutDataProvider'
interface DevelopmentHistoryBriefProps {
  className?: string
}

const DevelopmentHistoryBrief: FC<DevelopmentHistoryBriefProps> = ({ className }) => {
  const t = useTranslations('AboutPage')
  const developmentHistory = useAboutList<{
    id: string
    title: string
    version: string
    period: string
    tags: string[]
    status: keyof typeof TagColorMap
    summary: string
  }>('development_history')

  const developmentHistoryBrief = developmentHistory.map(({ id, title, version, period, tags, status, summary }) => (
    {
      id,
      title,
      version,
      period,
      tags,
      status,
      summary
    }
  ))

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
            {developmentHistoryBrief.map(({ id, title, period, tags, status, version, summary }) =>(
                <div className="relative flex items-start space-x-3" key={id}>
                  <div className={
                    cn(
                      "shrink-0 w-5 h-5 sm:w-6 sm:h-6  rounded-full flex items-center justify-center",
                      TagColorMap[status as keyof typeof TagColorMap]
                    )
                  }>
                    <span className="text-xs font-bold">{version}</span>
                  </div>
                  <div className="flex-1 bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 space-y-1 sm:space-y-0">
                      <h3 className="text-xs sm:text-sm font-semibold text-gray-900">
                        {title}
                      </h3>
                      <span className={
                        cn(
                          "px-2 py-0.5 text-xs rounded-full self-start sm:self-auto",
                          TagColorMap[status as keyof typeof TagColorMap]
                        )
                      }>
                        {period}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">
                      {summary}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {tags.map((tag, index) => (
                        <span className={
                          cn(
                            "px-2 py-0.5 text-xs rounded-full",
                            TagColorMap[status as keyof typeof TagColorMap]
                          )
                        } key={index}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DevelopmentHistoryBrief
