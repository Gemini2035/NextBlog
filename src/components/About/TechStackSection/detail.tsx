'use client'

import { useTranslations } from 'next-intl'

interface TechStackDetailProps {
  className?: string
}

export default function TechStackDetail({ className }: TechStackDetailProps) {
  const t = useTranslations('AboutPage')

  return (
    <div className={className}>
      <div className="flex items-center mb-8">
        <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mr-6 shrink-0">
          <svg className="w-8 h-8 text-blue-600" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <rect x="4" y="14" width="16" height="4" rx="1.5"/>
            <rect x="6" y="9" width="12" height="3" rx="1.5"/>
            <rect x="8" y="5" width="8" height="2" rx="1"/>
          </svg>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {t('techStack')}
          </h2>
          <p className="text-lg text-gray-600">
            {t('techStackDescription')}
          </p>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="text-center p-4 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">⚛️</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">{t('nextjs')}</h3>
          <p className="text-sm text-gray-600 mb-2">React 全栈框架</p>
          <p className="text-xs text-gray-500">v15.0.0+</p>
        </div>
        
        <div className="text-center p-4 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">📝</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">{t('contentlayer')}</h3>
          <p className="text-sm text-gray-600 mb-2">内容管理系统</p>
          <p className="text-xs text-gray-500">v0.3.0+</p>
        </div>
        
        <div className="text-center p-4 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">📄</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">{t('mdx')}</h3>
          <p className="text-sm text-gray-600 mb-2">Markdown + JSX 支持</p>
          <p className="text-xs text-gray-500">v3.0.0+</p>
        </div>
        
        <div className="text-center p-4 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="w-16 h-16 bg-cyan-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">🎨</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">{t('tailwind')}</h3>
          <p className="text-sm text-gray-600 mb-2">实用优先的 CSS 框架</p>
          <p className="text-xs text-gray-500">v3.4.0+</p>
        </div>
        
        <div className="text-center p-4 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">🔷</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">{t('typescript')}</h3>
          <p className="text-sm text-gray-600 mb-2">类型安全的 JavaScript</p>
          <p className="text-xs text-gray-500">v5.0.0+</p>
        </div>
        
        <div className="text-center p-4 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">🚀</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">{t('githubPages')}</h3>
          <p className="text-sm text-gray-600 mb-2">静态网站托管</p>
          <p className="text-xs text-gray-500">免费托管</p>
        </div>
      </div>

      {/* 技术栈特点 */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-6 bg-gray-50 rounded-xl">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">技术特点</h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2"></div>
              <div>
                <div className="font-medium text-blue-800">现代化技术栈</div>
                <div className="text-sm text-blue-700">使用最新的Web技术，确保项目的先进性和可维护性</div>
              </div>
            </li>
            <li className="flex items-start">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2"></div>
              <div>
                <div className="font-medium text-blue-800">类型安全</div>
                <div className="text-sm text-blue-700">TypeScript提供完整的类型检查，减少运行时错误</div>
              </div>
            </li>
            <li className="flex items-start">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2"></div>
              <div>
                <div className="font-medium text-blue-800">性能优化</div>
                <div className="text-sm text-blue-700">Next.js提供自动代码分割、图片优化等性能特性</div>
              </div>
            </li>
          </ul>
        </div>

        <div className="p-6 bg-gray-50 rounded-xl">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">开发体验</h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2"></div>
              <div>
                <div className="font-medium text-green-800">快速开发</div>
                <div className="text-sm text-green-700">热重载、快速构建，提升开发效率</div>
              </div>
            </li>
            <li className="flex items-start">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2"></div>
              <div>
                <div className="font-medium text-green-800">内容管理</div>
                <div className="text-sm text-green-700">Contentlayer提供类型安全的内容管理体验</div>
              </div>
            </li>
            <li className="flex items-start">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2"></div>
              <div>
                <div className="font-medium text-green-800">样式系统</div>
                <div className="text-sm text-green-700">Tailwind CSS提供快速、一致的样式开发</div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
