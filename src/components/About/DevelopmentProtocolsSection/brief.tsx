'use client'

import { useTranslations } from 'next-intl'

interface DevelopmentProtocolsBriefProps {
  className?: string
}

export default function DevelopmentProtocolsBrief({ className }: DevelopmentProtocolsBriefProps) {
  const t = useTranslations('AboutPage')

  return (
    <div className={className}>
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mr-3">
          <span className="text-lg">🔒</span>
        </div>
        <h2 className="text-xl font-bold text-gray-900">
          {t('developmentProtocols')}
        </h2>
      </div>
      
      <div className="space-y-3">
        <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center mb-2">
            <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center mr-2">
              <span className="text-blue-600 text-sm">🔧</span>
            </div>
            <h3 className="font-medium text-gray-900 text-sm">代码规范</h3>
          </div>
          <p className="text-xs text-gray-600">TypeScript + ESLint + Prettier</p>
        </div>

        <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center mb-2">
            <div className="w-6 h-6 bg-green-100 rounded flex items-center justify-center mr-2">
              <span className="text-green-600 text-sm">🌍</span>
            </div>
            <h3 className="font-medium text-gray-900 text-sm">国际化</h3>
          </div>
          <p className="text-xs text-gray-600">中文、英文、日文支持</p>
        </div>

        <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center mb-2">
            <div className="w-6 h-6 bg-purple-100 rounded flex items-center justify-center mr-2">
              <span className="text-purple-600 text-sm">⚡</span>
            </div>
            <h3 className="font-medium text-gray-900 text-sm">性能优化</h3>
          </div>
          <p className="text-xs text-gray-600">代码分割 + SEO优化</p>
        </div>
      </div>
    </div>
  )
}
