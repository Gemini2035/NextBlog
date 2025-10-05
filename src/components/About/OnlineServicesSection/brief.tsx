'use client'

import { useTranslations } from 'next-intl'

interface OnlineServicesBriefProps {
  className?: string
}

export default function OnlineServicesBrief({ className }: OnlineServicesBriefProps) {
  const t = useTranslations('AboutPage')

  return (
    <div className={className}>
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center mr-3">
          <span className="text-lg">🌐</span>
        </div>
        <h2 className="text-xl font-bold text-gray-900">
          {t('onlineServices')}
        </h2>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center mb-2">
            <div className="w-6 h-6 bg-gray-900 rounded flex items-center justify-center mr-2">
              <span className="text-white text-sm">🐙</span>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 text-sm">GitHub Pages</h3>
              <p className="text-xs text-gray-600">托管服务</p>
            </div>
          </div>
          <span className="text-xs text-green-600">免费</span>
        </div>

        <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center mb-2">
            <div className="w-6 h-6 bg-orange-500 rounded flex items-center justify-center mr-2">
              <span className="text-white text-sm">🔥</span>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 text-sm">Vercel</h3>
              <p className="text-xs text-gray-600">部署平台</p>
            </div>
          </div>
          <span className="text-xs text-green-600">免费</span>
        </div>

        <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center mb-2">
            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center mr-2">
              <span className="text-white text-sm">📊</span>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 text-sm">Google Analytics</h3>
              <p className="text-xs text-gray-600">数据分析</p>
            </div>
          </div>
          <span className="text-xs text-green-600">免费</span>
        </div>

        <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center mb-2">
            <div className="w-6 h-6 bg-green-600 rounded flex items-center justify-center mr-2">
              <span className="text-white text-sm">🔍</span>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 text-sm">Search Console</h3>
              <p className="text-xs text-gray-600">SEO工具</p>
            </div>
          </div>
          <span className="text-xs text-green-600">免费</span>
        </div>
      </div>
    </div>
  )
}
