'use client'

import { useTranslations } from 'next-intl'
import { ClockIcon } from '@/assets/icons'

interface DevelopmentProgressBriefProps {
  className?: string
}

export default function DevelopmentProgressBrief({ className }: DevelopmentProgressBriefProps) {
  const t = useTranslations('AboutPage')

  return (
    <div className={className}>
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
          <ClockIcon className="w-5 h-5 text-blue-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">
          {t('developmentProgress')}
        </h2>
      </div>
      
      <div className="space-y-4">
        <div className="relative">
          <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-300"></div>
          
          <div className="space-y-4">
            <div className="relative flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">1</span>
              </div>
              <div className="flex-1 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-1">
                  {t('phase1Title')}
                </h3>
                <p className="text-xs text-gray-600 mb-2">
                  {t('phase1Description')}
                </p>
                <div className="flex flex-wrap gap-1">
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">React</span>
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">Next.js</span>
                </div>
              </div>
            </div>

            <div className="relative flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">2</span>
              </div>
              <div className="flex-1 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-1">
                  {t('phase2Title')}
                </h3>
                <p className="text-xs text-gray-600 mb-2">
                  {t('phase2Description')}
                </p>
                <div className="flex flex-wrap gap-1">
                  <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">Contentlayer</span>
                  <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">MDX</span>
                </div>
              </div>
            </div>

            <div className="relative flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">3</span>
              </div>
              <div className="flex-1 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-1">
                  {t('phase3Title')}
                </h3>
                <p className="text-xs text-gray-600 mb-2">
                  {t('phase3Description')}
                </p>
                <div className="flex flex-wrap gap-1">
                  <span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-xs rounded-full">i18n</span>
                  <span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-xs rounded-full">SEO</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
