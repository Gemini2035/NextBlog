'use client'

import { useTranslations } from 'next-intl'

interface OnlineServicesDetailProps {
  className?: string
}

export default function OnlineServicesDetail({ className }: OnlineServicesDetailProps) {
  const t = useTranslations('AboutPage')

  return (
    <div className={className} id="online-services">
      <div className="flex items-center mb-8">
        <div className="w-16 h-16 bg-violet-100 rounded-xl flex items-center justify-center mr-6">
          <span className="text-3xl">🌐</span>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {t('onlineServices')}
          </h2>
          <p className="text-lg text-gray-600">
            {t('onlineServicesDescription')}
          </p>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center mr-4">
              <span className="text-white text-xl">🐙</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">GitHub Pages</h3>
              <p className="text-sm text-gray-600">{t('hosting')}</p>
            </div>
          </div>
          <p className="text-gray-600 mb-4">
            {t('githubPagesDescription')}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-green-600 font-medium">✓ {t('free')}</span>
            <a href="https://pages.github.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-sm">
              {t('learnMore')} →
            </a>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mr-4">
              <span className="text-white text-xl">🔥</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Vercel</h3>
              <p className="text-sm text-gray-600">{t('deployment')}</p>
            </div>
          </div>
          <p className="text-gray-600 mb-4">
            {t('vercelDescription')}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-green-600 font-medium">✓ {t('free')}</span>
            <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-sm">
              {t('learnMore')} →
            </a>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
              <span className="text-white text-xl">📊</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Google Analytics</h3>
              <p className="text-sm text-gray-600">{t('analytics')}</p>
            </div>
          </div>
          <p className="text-gray-600 mb-4">
            {t('googleAnalyticsDescription')}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-green-600 font-medium">✓ {t('free')}</span>
            <a href="https://analytics.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-sm">
              {t('learnMore')} →
            </a>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mr-4">
              <span className="text-white text-xl">🔍</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Google Search Console</h3>
              <p className="text-sm text-gray-600">{t('seo')}</p>
            </div>
          </div>
          <p className="text-gray-600 mb-4">
            {t('searchConsoleDescription')}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-green-600 font-medium">✓ {t('free')}</span>
            <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-sm">
              {t('learnMore')} →
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
