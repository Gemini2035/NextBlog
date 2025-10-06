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
      
      <div className="space-y-4 mb-8">
        <div className="flex items-start p-4 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
            <svg className="w-6 h-6 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="12" cy="12" r="6"/>
              <line x1="9" y1="15" x2="15" y2="9"/>
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 mb-1">{t('nextjs')}</h3>
            <p className="text-sm text-gray-700">React 全栈框架，基于 App Router 实现 SSR/SSG/ISR；内置图片优化、数据获取、路由与可访问性等能力，提供优良的性能默认值与 DX。</p>
          </div>
        </div>

        <div className="flex items-start p-4 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
            <svg className="w-6 h-6 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <rect x="6" y="7" width="12" height="8" rx="1"/>
              <rect x="8" y="11" width="8" height="4" rx="1"/>
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 mb-1">{t('contentlayer')}</h3>
            <p className="text-sm text-gray-700">类型安全的内容层，与 TS 深度集成；通过 schema 生成推断类型，结合 MDX 将内容结构化为可渲染的 React 组件，避免运行时解析错误。</p>
          </div>
        </div>

        <div className="flex items-start p-4 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
            <svg className="w-6 h-6 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <polyline points="8,12 11,9 8,6"/>
              <polyline points="16,6 13,9 16,12"/>
              <line x1="12" y1="13" x2="12" y2="18"/>
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 mb-1">{t('mdx')}</h3>
            <p className="text-sm text-gray-700">Markdown + JSX，支持在内容中引入交互式组件；与 Contentlayer 结合可获得强类型与快速预览，提升创作与维护效率。</p>
          </div>
        </div>

        <div className="flex items-start p-4 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
            <svg className="w-6 h-6 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <rect x="7" y="7" width="6" height="3" rx="1"/>
              <rect x="11" y="12" width="6" height="3" rx="1"/>
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 mb-1">{t('tailwind')}</h3>
            <p className="text-sm text-gray-700">实用优先 CSS 原子类库，降低样式命名与级联复杂度；通过预设与插件落地设计系统，快速实现响应式与暗色模式等特性。</p>
          </div>
        </div>

        <div className="flex items-start p-4 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
            <svg className="w-6 h-6 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <rect x="7" y="6" width="10" height="10" rx="2"/>
              <line x1="12" y1="8" x2="12" y2="14"/>
              <line x1="9" y1="8" x2="15" y2="8"/>
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 mb-1">{t('typescript')}</h3>
            <p className="text-sm text-gray-700">严格模式下的类型系统，为组件与接口提供静态检查；结合 ESLint/Prettier 与 CI 工作流保证风格一致与质量门禁。</p>
          </div>
        </div>

        <div className="flex items-start p-4 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
            <svg className="w-6 h-6 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="7" cy="12" r="2"/>
              <circle cx="17" cy="7" r="2"/>
              <circle cx="17" cy="17" r="2"/>
              <line x1="9" y1="12" x2="15" y2="8"/>
              <line x1="9" y1="12" x2="15" y2="16"/>
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 mb-1">GitHub Actions + Vercel</h3>
            <p className="text-sm text-gray-700">GitHub Actions 进行 lint/type-check/build 的 CI 流程，PR 和主分支 push 自动触发；Vercel 提供 Preview 与 Production 环境的一键部署与回滚能力。</p>
          </div>
        </div>
      </div>
      <div className="mb-8 flex items-center text-sm text-gray-700">
        <svg className="w-5 h-5 text-blue-600 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <circle cx="12" cy="12" r="9"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <circle cx="12" cy="16" r="1"/>
        </svg>
        <span className="ml-1 text-blue-600 font-medium">
          对应的官方介绍请跳转开源库部分
        </span>
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
