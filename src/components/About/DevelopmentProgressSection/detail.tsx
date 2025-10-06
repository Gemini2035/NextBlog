'use client'

import { useTranslations } from 'next-intl'
import { ClockIcon } from '@/assets/icons'

interface DevelopmentProgressDetailProps {
  className?: string
}

export default function DevelopmentProgressDetail({ className }: DevelopmentProgressDetailProps) {
  const t = useTranslations('AboutPage')

  return (
    <div className={className} id="development">
      <div className="flex items-center mb-8">
        <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mr-6">
          <ClockIcon className="w-8 h-8 text-blue-600" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {t('developmentProgress')}
          </h2>
          <p className="text-lg text-gray-600">
            {t('developmentProgressDescription')}
          </p>
        </div>
      </div>
      
      <div className="space-y-8">
        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-1 bg-gray-300 rounded-full"></div>
          
          <div className="space-y-12">
            <div className="relative flex items-start space-x-6">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-lg font-bold">1</span>
              </div>
              <div className="flex-1 bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-semibold text-gray-900">
                    {t('phase1Title')}
                  </h3>
                  <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    2016 - 2020
                  </span>
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {t('phase1Description')}
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-800 mb-3">核心技术</h4>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">React</span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">Next.js</span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">TypeScript</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-3">主要成就</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• 搭建项目基础架构</li>
                      <li>• 配置开发环境</li>
                      <li>• 建立代码规范</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative flex items-start space-x-6">
              <div className="flex-shrink-0 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-lg font-bold">2</span>
              </div>
              <div className="flex-1 bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-semibold text-gray-900">
                    {t('phase2Title')}
                  </h3>
                  <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    2020 - 2022
                  </span>
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {t('phase2Description')}
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-800 mb-3">核心技术</h4>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">Contentlayer</span>
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">MDX</span>
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">Tailwind CSS</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-3">主要成就</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• 实现内容管理系统</li>
                      <li>• 优化写作体验</li>
                      <li>• 提升开发效率</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative flex items-start space-x-6">
              <div className="flex-shrink-0 w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-lg font-bold">3</span>
              </div>
              <div className="flex-1 bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-semibold text-gray-900">
                    {t('phase3Title')}
                  </h3>
                  <span className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                    2022 - 至今
                  </span>
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {t('phase3Description')}
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-800 mb-3">核心技术</h4>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">i18n</span>
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">SEO</span>
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">Performance</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-3">主要成就</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• 多语言支持</li>
                      <li>• 搜索引擎优化</li>
                      <li>• 性能大幅提升</li>
                    </ul>
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
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-blue-600">3+</span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">开发阶段</h4>
            <p className="text-sm text-gray-600">从基础到完善的完整开发周期</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-green-600">50+</span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">功能特性</h4>
            <p className="text-sm text-gray-600">丰富的功能和用户体验优化</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-purple-600">100%</span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">用户满意</h4>
            <p className="text-sm text-gray-600">持续优化和改进用户体验</p>
          </div>
        </div>
      </div>
    </div>
  )
}
