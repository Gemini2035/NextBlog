'use client'

import { useTranslations } from 'next-intl'
import { ClockIcon } from '@/assets/icons'

interface DevelopmentHistoryDetailProps {
  className?: string
}

export default function DevelopmentHistoryDetail({ className }: DevelopmentHistoryDetailProps) {
  const t = useTranslations('DevelopmentHistory')
  const tAbout = useTranslations('AboutPage')

  return (
    <div className={className} id="development-history">
      <div className="flex items-center mb-8">
        <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mr-6">
          <ClockIcon className="w-8 h-8 text-blue-600" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {tAbout('developmentHistory')}
          </h2>
          <p className="text-lg text-gray-600">
            {tAbout('developmentHistoryDescription')}
          </p>
        </div>
      </div>
      
      <div className="space-y-12">
        {/* Blog 1.0 粗轴 */}
        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-1 bg-gray-300 rounded-full"></div>
          
          <div className="space-y-8">
            {/* 粗轴标题 */}
            <div className="relative flex items-start space-x-6">
              <div className="flex-shrink-0 w-16 h-16 bg-gray-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-xl font-bold">1.0</span>
              </div>
              <div className="flex-1 bg-gradient-to-r from-gray-50 to-gray-100 p-8 rounded-2xl shadow-lg border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-3xl font-bold text-gray-900">
                    {t('blog1Era')}
                  </h3>
                  <span className="px-6 py-3 bg-gray-500 text-white rounded-full text-lg font-semibold">
                    {t('blog1Period')}
                  </span>
                </div>
                <p className="text-lg text-gray-800 mb-4 leading-relaxed">
                  {t('blog1DescriptionDetail')}
                </p>
                <p className="text-sm text-gray-700 mb-6 leading-relaxed">
                  {t('blog1DomainNote')}
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 text-lg">{t('coreTechStack')}</h4>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-2 bg-gray-200 text-gray-900 text-sm rounded-full font-medium">{t('techTags.vue3')}</span>
                      <span className="px-3 py-2 bg-gray-200 text-gray-900 text-sm rounded-full font-medium">{t('techTags.vite')}</span>
                      <span className="px-3 py-2 bg-gray-200 text-gray-900 text-sm rounded-full font-medium">{t('techTags.githubPages')}</span>
                      <span className="px-3 py-2 bg-gray-200 text-gray-900 text-sm rounded-full font-medium">{t('techTags.staticWeb')}</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 text-lg">{t('developmentHistory')}</h4>
                    <ul className="text-sm text-gray-800 space-y-2">
                      <li>• {t('timeline.sep2023')}</li>
                      <li>• {t('timeline.feb2024')}</li>
                      <li>• {t('timeline.mar2024')}</li>
                      <li>• {t('timeline.domainExpired')}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Blog 2.0 粗轴 */}
        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-1 bg-green-300 rounded-full"></div>
          
          <div className="space-y-8">
            {/* 粗轴标题 */}
            <div className="relative flex items-start space-x-6">
              <div className="flex-shrink-0 w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-xl font-bold">2.0</span>
              </div>
              <div className="flex-1 bg-gradient-to-r from-green-50 to-green-100 p-8 rounded-2xl shadow-lg border border-green-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-3xl font-bold text-green-900">
                    {t('blog2Era')}
                  </h3>
                  <span className="px-6 py-3 bg-green-500 text-white rounded-full text-lg font-semibold">
                    {t('blog2Period')}
                  </span>
                </div>
                <p className="text-lg text-green-800 mb-4 leading-relaxed">
                  {t('blog2DescriptionDetail')}
                </p>
                <p className="text-sm text-green-800 mb-6 leading-relaxed">
                  {t('blog2ImprovementNote')}
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-green-900 mb-3 text-lg">{t('coreTechStack')}</h4>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-2 bg-green-200 text-green-900 text-sm rounded-full font-medium">{t('techTags.nextjs15')}</span>
                      <span className="px-3 py-2 bg-green-200 text-green-900 text-sm rounded-full font-medium">{t('techTags.typescript')}</span>
                      <span className="px-3 py-2 bg-green-200 text-green-900 text-sm rounded-full font-medium">{t('techTags.contentlayer')}</span>
                      <span className="px-3 py-2 bg-green-200 text-green-900 text-sm rounded-full font-medium">{t('techTags.nextIntl')}</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-900 mb-3 text-lg">{t('developmentHistory')}</h4>
                    <ul className="text-sm text-green-800 space-y-2">
                      <li>• {t('timeline.sep2025')}</li>
                      <li>• {t('timeline.oct2025')}</li>
                      <li>• {t('timeline.oct2025First')}</li>
                      <li>• {t('timeline.continuousUpdate')}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* 细轴 - Blog 2.0 版本 */}
            <div className="ml-12 space-y-6">
              {/* v2.0.0 */}
              <div className="relative flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-green-400 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">2.0</span>
                </div>
                <div className="flex-1 bg-white p-6 rounded-xl shadow-md border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-semibold text-gray-900">{t('versions.v200')}</h4>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      {t('versions.v200Period')}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">
                    {t('versions.v200Description')}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">{t('techTags.nextjs15')}</span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">{t('techTags.typescript')}</span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">{t('techTags.architectureRefactor')}</span>
                  </div>
                </div>
              </div>

              {/* v2.0.1 */}
              <div className="relative flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-green-400 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">2.0</span>
                </div>
                <div className="flex-1 bg-white p-6 rounded-xl shadow-md border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-semibold text-gray-900">{t('versions.v201')}</h4>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      {t('versions.v201Period')}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">
                    {t('versions.v201Description')}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">{t('techTags.contentlayer')}</span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">MDX</span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">{t('techTags.firstArticle')}</span>
                  </div>
                </div>
              </div>

              {/* v2.1.0 */}
              <div className="relative flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-green-400 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">2.1</span>
                </div>
                <div className="flex-1 bg-white p-6 rounded-xl shadow-md border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-semibold text-gray-900">{t('versions.v210')}</h4>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      {t('versions.v210Period')}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">
                    {t('versions.v210Description')}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">{t('techTags.nextIntl')}</span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">{t('techTags.multilangSupport')}</span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">{t('techTags.fullSiteI18n')}</span>
                  </div>
                </div>
              </div>

              {/* v2.2.0 */}
              <div className="relative flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-green-400 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">2.2</span>
                </div>
                <div className="flex-1 bg-white p-6 rounded-xl shadow-md border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-semibold text-gray-900">{t('versions.v220')}</h4>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      {t('versions.v220Period')}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">
                    {t('versions.v220Description')}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">{t('techTags.seoOptimization')}</span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">{t('techTags.performanceImprovement')}</span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">{t('techTags.userExperience')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 发展里程碑 */}
      <div className="mt-12 p-8 bg-gray-50 rounded-2xl">
        <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center">{t('milestones')}</h3>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-blue-600">2</span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">{t('majorVersions')}</h4>
            <p className="text-sm text-gray-600">{t('majorVersionsDesc')}</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-green-600">2+</span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">{t('yearSpan')}</h4>
            <p className="text-sm text-gray-600">{t('yearSpanDesc')}</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-purple-600">3</span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">{t('languageSupport')}</h4>
            <p className="text-sm text-gray-600">{t('languageSupportDesc')}</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-orange-600">∞</span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">{t('continuousDevelopment')}</h4>
            <p className="text-sm text-gray-600">{t('continuousDevelopmentDesc')}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

