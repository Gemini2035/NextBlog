'use client'

import { useTranslations } from 'next-intl'

interface TechStackSectionProps {
  className?: string
}

export default function TechStackSection({ className }: TechStackSectionProps) {
  const t = useTranslations('AboutPage')

  return (
    <div className={className}>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          {t('techStack')}
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {t('techStackDescription')}
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">⚛️</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">{t('nextjs')}</h3>
          <p className="text-sm text-gray-600">React 全栈框架</p>
        </div>
        
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">📝</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">{t('contentlayer')}</h3>
          <p className="text-sm text-gray-600">内容管理系统</p>
        </div>
        
        <div className="text-center">
          <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">📄</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">{t('mdx')}</h3>
          <p className="text-sm text-gray-600">Markdown + JSX 支持</p>
        </div>
        
        <div className="text-center">
          <div className="w-16 h-16 bg-cyan-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">🎨</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">{t('tailwind')}</h3>
          <p className="text-sm text-gray-600">实用优先的 CSS 框架</p>
        </div>
        
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">🔷</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">{t('typescript')}</h3>
          <p className="text-sm text-gray-600">类型安全的 JavaScript</p>
        </div>
        
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">🚀</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">{t('githubPages')}</h3>
          <p className="text-sm text-gray-600">静态网站托管</p>
        </div>
      </div>
    </div>
  )
}