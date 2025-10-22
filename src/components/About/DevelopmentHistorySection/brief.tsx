'use client'

import { useTranslations } from 'next-intl'
import { ClockIcon } from '@/assets/icons'

interface DevelopmentHistoryBriefProps {
  className?: string
}

export default function DevelopmentHistoryBrief({ className }: DevelopmentHistoryBriefProps) {
  const t = useTranslations('DevelopmentHistory')

  return (
    <div className={className}>
      <div className="flex flex-col sm:flex-row sm:items-center mb-3 sm:mb-4">
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3 mb-2 sm:mb-0">
          <ClockIcon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-gray-900">
          {t('developmentHistory')}
        </h2>
      </div>
      
      <div className="space-y-3 sm:space-y-4">
        <div className="relative">
          <div className="absolute left-2 sm:left-3 top-0 bottom-0 w-0.5 bg-gray-300"></div>
          
          <div className="space-y-3 sm:space-y-4">
            {/* Blog 1.0 粗轴 */}
            <div className="relative flex items-start space-x-3">
              <div className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">1.0</span>
              </div>
              <div className="flex-1 bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 space-y-1 sm:space-y-0">
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-900">
                    {t('blog1Title')}
                  </h3>
                  <span className="px-2 py-0.5 bg-gray-400 text-gray-800 text-xs rounded-full self-start sm:self-auto">
                    {t('blog1Period')}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mb-2">
                  {t('blog1Description')}
                </p>
                <div className="flex flex-wrap gap-1">
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">{t('techTags.vue3')}</span>
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">{t('techTags.vite')}</span>
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">{t('techTags.githubPages')}</span>
                </div>
              </div>
            </div>

            {/* Blog 2.0 粗轴 */}
            <div className="relative flex items-start space-x-3">
              <div className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">2.0</span>
              </div>
              <div className="flex-1 bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 space-y-1 sm:space-y-0">
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-900">
                    {t('blog2Title')}
                  </h3>
                  <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full self-start sm:self-auto">
                    {t('blog2Period')}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mb-2">
                  {t('blog2Description')}
                </p>
                <div className="flex flex-wrap gap-1">
                  <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">{t('techTags.nextjs15')}</span>
                  <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">{t('techTags.i18n')}</span>
                  <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">{t('techTags.typescript')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

