'use client'

import { useTranslations } from 'next-intl'
import { ClockIcon } from '@/assets/icons'

interface DevelopmentHistoryDetailProps {
  className?: string
}

export default function DevelopmentHistoryDetail({ className }: DevelopmentHistoryDetailProps) {
  const t = useTranslations('AboutPage')

  return (
    <div className={className} id="development-history">
      <div className="flex items-center mb-8">
        <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mr-6">
          <ClockIcon className="w-8 h-8 text-blue-600" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {t('developmentHistory')}
          </h2>
          <p className="text-lg text-gray-600">
            {t('developmentHistoryDescription')}
          </p>
        </div>
      </div>
      
      <div className="space-y-12">
        {/* Blog 1.0 粗轴 */}
        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-1 bg-blue-300 rounded-full"></div>
          
          <div className="space-y-8">
            {/* 粗轴标题 */}
            <div className="relative flex items-start space-x-6">
              <div className="flex-shrink-0 w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-xl font-bold">1.0</span>
              </div>
              <div className="flex-1 bg-gradient-to-r from-blue-50 to-blue-100 p-8 rounded-2xl shadow-lg border border-blue-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-3xl font-bold text-blue-900">
                    Blog 1.0 时代
                  </h3>
                  <span className="px-6 py-3 bg-blue-500 text-white rounded-full text-lg font-semibold">
                    2023 - 2025
                  </span>
                </div>
                <p className="text-lg text-blue-800 mb-6 leading-relaxed">
                  博客的初始版本，建立了基础功能和架构。专注于内容创作和基本用户体验。
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-3 text-lg">核心技术栈</h4>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-2 bg-blue-200 text-blue-900 text-sm rounded-full font-medium">React</span>
                      <span className="px-3 py-2 bg-blue-200 text-blue-900 text-sm rounded-full font-medium">Next.js</span>
                      <span className="px-3 py-2 bg-blue-200 text-blue-900 text-sm rounded-full font-medium">MDX</span>
                      <span className="px-3 py-2 bg-blue-200 text-blue-900 text-sm rounded-full font-medium">Tailwind CSS</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-3 text-lg">主要成就</h4>
                    <ul className="text-sm text-blue-800 space-y-2">
                      <li>• 搭建完整的博客系统</li>
                      <li>• 实现MDX内容管理</li>
                      <li>• 建立响应式设计</li>
                      <li>• 优化SEO基础</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* 细轴 - Blog 1.0 版本 */}
            <div className="ml-12 space-y-6">
              {/* v1.0.0 */}
              <div className="relative flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">1.0</span>
                </div>
                <div className="flex-1 bg-white p-6 rounded-xl shadow-md border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-semibold text-gray-900">v1.0.0 - 基础版本</h4>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      2023年8月
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">
                    博客系统的基础版本，包含文章展示、分类、标签等核心功能。
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">基础架构</span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">文章系统</span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">响应式设计</span>
                  </div>
                </div>
              </div>

              {/* v1.1.0 */}
              <div className="relative flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">1.1</span>
                </div>
                <div className="flex-1 bg-white p-6 rounded-xl shadow-md border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-semibold text-gray-900">v1.1.0 - 内容优化</h4>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      2024年3月
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">
                    优化内容管理系统，增加搜索功能和文章推荐。
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">搜索功能</span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">文章推荐</span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">性能优化</span>
                  </div>
                </div>
              </div>

              {/* v1.2.0 */}
              <div className="relative flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">1.2</span>
                </div>
                <div className="flex-1 bg-white p-6 rounded-xl shadow-md border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-semibold text-gray-900">v1.2.0 - 用户体验</h4>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      2024年10月
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">
                    改进用户界面，增加暗黑模式和更好的移动端体验。
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">暗黑模式</span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">移动优化</span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">UI改进</span>
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
                    Blog 2.0 时代
                  </h3>
                  <span className="px-6 py-3 bg-green-500 text-white rounded-full text-lg font-semibold">
                    2025 - 至今
                  </span>
                </div>
                <p className="text-lg text-green-800 mb-6 leading-relaxed">
                  博客的全面升级版本，采用现代化架构，支持国际化、高级SEO优化和性能提升。
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-green-900 mb-3 text-lg">核心技术栈</h4>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-2 bg-green-200 text-green-900 text-sm rounded-full font-medium">Next.js 15</span>
                      <span className="px-3 py-2 bg-green-200 text-green-900 text-sm rounded-full font-medium">TypeScript</span>
                      <span className="px-3 py-2 bg-green-200 text-green-900 text-sm rounded-full font-medium">i18n</span>
                      <span className="px-3 py-2 bg-green-200 text-green-900 text-sm rounded-full font-medium">Contentlayer</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-900 mb-3 text-lg">主要成就</h4>
                    <ul className="text-sm text-green-800 space-y-2">
                      <li>• 多语言国际化支持</li>
                      <li>• 高级SEO优化</li>
                      <li>• 性能大幅提升</li>
                      <li>• 现代化架构设计</li>
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
                    <h4 className="text-lg font-semibold text-gray-900">v2.0.0 - 架构重构</h4>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      2025年1月
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">
                    完全重构博客架构，采用现代化的技术栈和开发模式。
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">架构重构</span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">TypeScript</span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">组件化</span>
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
                    <h4 className="text-lg font-semibold text-gray-900">v2.1.0 - 国际化</h4>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      2025年3月
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">
                    添加多语言支持，支持中文、英文、日文三种语言。
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">多语言</span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">i18n</span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">语言切换</span>
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
                    <h4 className="text-lg font-semibold text-gray-900">v2.2.0 - SEO优化</h4>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      2025年6月
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">
                    全面优化SEO，提升搜索引擎排名和网站可发现性。
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">SEO优化</span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">结构化数据</span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">性能优化</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 发展里程碑 */}
      <div className="mt-12 p-8 bg-gray-50 rounded-2xl">
        <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center">发展里程碑</h3>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-blue-600">2</span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">主要版本</h4>
            <p className="text-sm text-gray-600">从1.0到2.0的完整演进</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-green-600">7</span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">子版本</h4>
            <p className="text-sm text-gray-600">持续迭代和功能完善</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-purple-600">3</span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">语言支持</h4>
            <p className="text-sm text-gray-600">中文、英文、日文多语言</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-orange-600">∞</span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">持续发展</h4>
            <p className="text-sm text-gray-600">不断优化和功能迭代</p>
          </div>
        </div>
      </div>
    </div>
  )
}

