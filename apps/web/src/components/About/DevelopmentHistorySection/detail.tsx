'use client'

import { useTranslations } from 'next-intl'
import { ClockIcon } from '@/assets/icons'
import { FC, Fragment } from 'react'
import { TagColorMap } from './constants'
import { cn } from '@/utils'
import { useAboutList } from '@/components/About/AboutDataProvider'

interface DevelopmentHistoryDetailProps {
  className?: string
}

const TitleColorMap = {
  active: 'text-green-600',
  planning: 'text-purple-600',
  abandoned: 'text-gray-600'
} as const

const DevelopmentHistoryDetail: FC<DevelopmentHistoryDetailProps> = ({ className }) => {
  const t = useTranslations('AboutPage')
  const developmentHistory = useAboutList<{
    id: string
    title: string
    version: string
    period: string
    status: keyof typeof TagColorMap
    description: string
    children?: Array<{
      id: string
      title: string
      version: string
      period: string
      tags: string[]
      status: keyof typeof TagColorMap
      description: string
    }>
  }>('development_history')

  return (
    <div className={className} id="development-history">
      <div className="flex flex-col sm:flex-row sm:items-center mb-6 sm:mb-8">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-xl flex items-center justify-center mr-4 sm:mr-6 mb-3 sm:mb-0">
          <ClockIcon className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            {t('DevelopmentHistory.title')}
          </h2>
          <p className="text-base sm:text-lg text-gray-600">
            {t('DevelopmentHistory.description')}
          </p>
        </div>
      </div>

      <div className="space-y-12">
        {developmentHistory.map(({ id, title, version, period, status, description, children }) => (
          <Fragment key={id}>
            {/* 粗轴 */}
            <div className="relative">
              <div className={
                cn(
                  "absolute left-4 sm:left-8 top-0 bottom-0 w-0.5 sm:w-1 rounded-full",
                  TagColorMap[status as keyof typeof TagColorMap]
                )
              } />

              <div className="space-y-6 sm:space-y-8">
                {/* 粗轴标题 */}
                <div className="relative flex flex-col sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
                  <div className={
                    cn(
                      "shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center shadow-lg mx-auto sm:mx-0",
                      TagColorMap[status as keyof typeof TagColorMap]
                    )
                  }>
                    <span className="text-lg sm:text-xl font-bold">{version}</span>
                  </div>
                  <div className={
                    cn(
                      "flex-1 p-4 sm:p-8 rounded-2xl shadow-lg",
                      status === "abandoned" && "bg-gradient-to-r from-gray-50 to-gray-100"
                    )
                  }>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0">
                      <h3 className={
                        cn(
                          "text-2xl sm:text-3xl font-bold",
                          TitleColorMap[status as keyof typeof TitleColorMap]
                        )
                      }>
                        {title}
                      </h3>
                      <span className={
                        cn(
                          "px-4 py-2 sm:px-6 sm:py-3 rounded-full text-sm sm:text-lg font-semibold text-center sm:text-left",
                          TagColorMap[status as keyof typeof TagColorMap]
                        )
                      }>
                        {period}
                      </span>
                    </div>
                    <div dangerouslySetInnerHTML={{ __html: description }} />
                  </div>
                </div>

                {/* 细轴 */}
                {!!children?.length && (
                  <div className="ml-6 sm:ml-12 space-y-4 sm:space-y-6">
                    {children.map(({ id, title, version, period, tags, status, description }) => (
                      <div className="relative flex flex-col sm:flex-row sm:items-start space-y-3 sm:space-y-0 sm:space-x-4 gap-1" key={id}>
                        <div className={
                          cn(
                            "shrink-0 w-6 h-6 sm:w-8 sm:h-8  rounded-full flex items-center justify-center mx-auto sm:mx-0",
                            !!version && TagColorMap[status as keyof typeof TagColorMap],
                          )
                        }>
                          <span className="text-white text-xs font-bold">{version}</span>
                        </div>
                        <div className="flex-1 bg-white p-4 sm:p-6 rounded-xl shadow-md border border-gray-200">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 space-y-2 sm:space-y-0">
                            <h4 className="text-base sm:text-lg font-semibold text-gray-900">{title}</h4>
                            <span className={
                              cn(
                                "px-2 py-1 sm:px-3 sm:py-1 bg-green-100 text-green-800 rounded-full text-xs sm:text-sm font-medium text-center sm:text-left",
                                TagColorMap[status as keyof typeof TagColorMap]
                              )
                            }>
                              {status === "planning" ? t('DevelopmentHistory.planning') : period}
                            </span>
                          </div>
                          <p className="text-sm sm:text-base text-gray-600 mb-4">
                            {description}
                          </p>
                          <div className="flex flex-wrap gap-1 sm:gap-2">
                            {tags.map((tag) => (
                              <span className={
                                cn(
                                  "px-2 py-1 rounded-full text-xs",
                                  TagColorMap[status as keyof typeof TagColorMap]
                                )
                              } key={tag}>
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Fragment>
        ))}
      </div>

      {/* 发展里程碑 */}
      <div className="mt-8 sm:mt-12 p-4 sm:p-8 bg-gray-50 rounded-2xl">
        <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6 text-center">{t('DevelopmentHistory.milestones')}</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <span className="text-lg sm:text-2xl font-bold text-blue-600">2</span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">{t('DevelopmentHistory.majorVersions')}</h4>
            <p className="text-xs sm:text-sm text-gray-600">{t('DevelopmentHistory.majorVersionsDesc')}</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <span className="text-lg sm:text-2xl font-bold text-green-600">2+</span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">{t('DevelopmentHistory.yearSpan')}</h4>
            <p className="text-xs sm:text-sm text-gray-600">{t('DevelopmentHistory.yearSpanDesc')}</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <span className="text-lg sm:text-2xl font-bold text-purple-600">3</span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">{t('DevelopmentHistory.languageSupport')}</h4>
            <p className="text-xs sm:text-sm text-gray-600">{t('DevelopmentHistory.languageSupportDesc')}</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <span className="text-lg sm:text-2xl font-bold text-orange-600">∞</span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">{t('DevelopmentHistory.continuousDevelopment')}</h4>
            <p className="text-xs sm:text-sm text-gray-600">{t('DevelopmentHistory.continuousDevelopmentDesc')}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DevelopmentHistoryDetail
