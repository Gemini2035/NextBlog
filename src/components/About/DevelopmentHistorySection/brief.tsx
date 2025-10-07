'use client'

import { useTranslations } from 'next-intl'
import { ClockIcon } from '@/assets/icons'

interface DevelopmentHistoryBriefProps {
  className?: string
}

export default function DevelopmentHistoryBrief({ className }: DevelopmentHistoryBriefProps) {
  const t = useTranslations('AboutPage')

  return (
    <div className={className}>
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
          <ClockIcon className="w-5 h-5 text-blue-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">
          {t('developmentHistory')}
        </h2>
      </div>
      
      <div className="space-y-4">
        <div className="relative">
          <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-300"></div>
          
          <div className="space-y-4">
            {/* Blog 1.0 粗轴 */}
            <div className="relative flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">1.0</span>
              </div>
              <div className="flex-1 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Blog 1.0
                  </h3>
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                    2023 - 2025
                  </span>
                </div>
                <p className="text-xs text-gray-600 mb-2">
                  初始版本，基础功能实现
                </p>
                <div className="flex flex-wrap gap-1">
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">React</span>
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">Next.js</span>
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">MDX</span>
                </div>
              </div>
            </div>

            {/* Blog 2.0 粗轴 */}
            <div className="relative flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">2.0</span>
              </div>
              <div className="flex-1 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Blog 2.0
                  </h3>
                  <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                    2025 - 至今
                  </span>
                </div>
                <p className="text-xs text-gray-600 mb-2">
                  全面升级，现代化架构
                </p>
                <div className="flex flex-wrap gap-1">
                  <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">i18n</span>
                  <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">SEO</span>
                  <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">Performance</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

