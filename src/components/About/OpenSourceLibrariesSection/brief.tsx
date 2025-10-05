'use client'

import { useTranslations } from 'next-intl'

interface OpenSourceLibrariesBriefProps {
  className?: string
}

export default function OpenSourceLibrariesBrief({ className }: OpenSourceLibrariesBriefProps) {
  const t = useTranslations('AboutPage')

  return (
    <div className={className}>
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mr-3">
          <span className="text-lg">📚</span>
        </div>
        <h2 className="text-xl font-bold text-gray-900">
          {t('openSourceLibraries')}
        </h2>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center mb-2">
            <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center mr-2">
              <span className="text-blue-600 text-sm">⚛️</span>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 text-sm">React</h3>
              <p className="text-xs text-gray-600">UI Library</p>
            </div>
          </div>
          <span className="text-xs text-gray-500">v18.2.0+</span>
        </div>

        <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center mb-2">
            <div className="w-6 h-6 bg-black rounded flex items-center justify-center mr-2">
              <span className="text-white text-sm">▲</span>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 text-sm">Next.js</h3>
              <p className="text-xs text-gray-600">Framework</p>
            </div>
          </div>
          <span className="text-xs text-gray-500">v15.0.0+</span>
        </div>

        <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center mb-2">
            <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center mr-2">
              <span className="text-blue-600 text-sm">📝</span>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 text-sm">Contentlayer</h3>
              <p className="text-xs text-gray-600">CMS</p>
            </div>
          </div>
          <span className="text-xs text-gray-500">v0.3.0+</span>
        </div>

        <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center mb-2">
            <div className="w-6 h-6 bg-cyan-100 rounded flex items-center justify-center mr-2">
              <span className="text-cyan-600 text-sm">🎨</span>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 text-sm">Tailwind</h3>
              <p className="text-xs text-gray-600">CSS</p>
            </div>
          </div>
          <span className="text-xs text-gray-500">v3.4.0+</span>
        </div>
      </div>
    </div>
  )
}
