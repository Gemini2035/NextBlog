'use client'

import { useTranslations } from 'next-intl'

interface TechStackBriefProps {
  className?: string
}

export default function TechStackBrief({ className }: TechStackBriefProps) {
  const t = useTranslations('AboutPage')

  return (
    <div className={className}>
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3 shrink-0">
          <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <rect x="4" y="14" width="16" height="4" rx="1.5"/>
            <rect x="6" y="9" width="12" height="3" rx="1.5"/>
            <rect x="8" y="5" width="8" height="2" rx="1"/>
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900">
          {t('techStack')}
        </h2>
      </div>
      
      <div className="grid grid-cols-3 gap-3">
        <div className="text-center">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
            <span className="text-lg">⚛️</span>
          </div>
          <h3 className="font-medium text-gray-900 text-xs mb-1">Next.js</h3>
          <p className="text-xs text-gray-600">React框架</p>
        </div>
        
        <div className="text-center">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
            <span className="text-lg">📝</span>
          </div>
          <h3 className="font-medium text-gray-900 text-xs mb-1">Contentlayer</h3>
          <p className="text-xs text-gray-600">内容管理</p>
        </div>
        
        <div className="text-center">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
            <span className="text-lg">📄</span>
          </div>
          <h3 className="font-medium text-gray-900 text-xs mb-1">MDX</h3>
          <p className="text-xs text-gray-600">Markdown</p>
        </div>
        
        <div className="text-center">
          <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center mx-auto mb-2">
            <span className="text-lg">🎨</span>
          </div>
          <h3 className="font-medium text-gray-900 text-xs mb-1">Tailwind</h3>
          <p className="text-xs text-gray-600">CSS框架</p>
        </div>
        
        <div className="text-center">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
            <span className="text-lg">🔷</span>
          </div>
          <h3 className="font-medium text-gray-900 text-xs mb-1">TypeScript</h3>
          <p className="text-xs text-gray-600">类型安全</p>
        </div>
        
        <div className="text-center">
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
            <span className="text-lg">🚀</span>
          </div>
          <h3 className="font-medium text-gray-900 text-xs mb-1">GitHub</h3>
          <p className="text-xs text-gray-600">静态托管</p>
        </div>
      </div>
    </div>
  )
}
