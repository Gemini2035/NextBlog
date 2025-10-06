'use client'

import { useTranslations } from 'next-intl'

interface SkillsDetailProps {
  className?: string
}

export default function SkillsDetail({ className }: SkillsDetailProps) {
  const navT = useTranslations('Navigation')

  return (
    <div className={className}>
      <div className="flex items-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mr-6">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {navT('Skills & Expertise')}
          </h2>
          <p className="text-lg text-gray-600">
            技术技能与专业能力详情
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8" id="skills">
        {/* 核心技术栈 */}
        <div className="p-6 bg-green-50 rounded-xl">
          <h3 className="text-xl font-semibold text-green-900 mb-6">核心技术栈</h3>
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-green-800 mb-3">前端技术</h4>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-white text-blue-800 rounded-full text-sm font-medium">React</span>
                <span className="px-3 py-1 bg-white text-blue-800 rounded-full text-sm font-medium">Vue</span>
                <span className="px-3 py-1 bg-white text-blue-800 rounded-full text-sm font-medium">Next.js</span>
                <span className="px-3 py-1 bg-white text-blue-800 rounded-full text-sm font-medium">HTML5</span>
                <span className="px-3 py-1 bg-white text-blue-800 rounded-full text-sm font-medium">CSS3</span>
                <span className="px-3 py-1 bg-white text-blue-800 rounded-full text-sm font-medium">Vite</span>
                <span className="px-3 py-1 bg-white text-blue-800 rounded-full text-sm font-medium">Tailwind</span>
                <span className="px-3 py-1 bg-white text-blue-800 rounded-full text-sm font-medium">Magento</span>
                <span className="px-3 py-1 bg-white text-blue-800 rounded-full text-sm font-medium">Catalyst</span>
                <span className="px-3 py-1 bg-white text-blue-800 rounded-full text-sm font-medium">ES6</span>
                <span className="px-3 py-1 bg-white text-blue-800 rounded-full text-sm font-medium">JavaScript</span>
                <span className="px-3 py-1 bg-white text-blue-800 rounded-full text-sm font-medium">TypeScript</span>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-green-800 mb-3">后端技术</h4>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-white text-green-800 rounded-full text-sm font-medium">Node.js</span>
                <span className="px-3 py-1 bg-white text-green-800 rounded-full text-sm font-medium">PostgreSQL</span>
                <span className="px-3 py-1 bg-white text-green-800 rounded-full text-sm font-medium">RESTful</span>
                <span className="px-3 py-1 bg-white text-green-800 rounded-full text-sm font-medium">GraphQL</span>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-green-800 mb-3">开发工具</h4>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-white text-purple-800 rounded-full text-sm font-medium">Git</span>
                <span className="px-3 py-1 bg-white text-purple-800 rounded-full text-sm font-medium">Docker</span>
                <span className="px-3 py-1 bg-white text-purple-800 rounded-full text-sm font-medium">VSCode</span>
                <span className="px-3 py-1 bg-white text-purple-800 rounded-full text-sm font-medium">Cursor</span>
                <span className="px-3 py-1 bg-white text-purple-800 rounded-full text-sm font-medium">ChatGPT</span>
                <span className="px-3 py-1 bg-white text-purple-800 rounded-full text-sm font-medium">Figma</span>
                <span className="px-3 py-1 bg-white text-purple-800 rounded-full text-sm font-medium">SF Symbol</span>
              </div>
            </div>
          </div>
        </div>

        {/* 专业领域 */}
        <div className="p-6 bg-purple-50 rounded-xl">
          <h3 className="text-xl font-semibold text-purple-900 mb-6">专业领域</h3>
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-purple-800 mb-3">架构设计</h4>
              <ul className="space-y-2 text-purple-700">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                  前端架构设计与优化
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                  微服务架构实践
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                  系统性能优化
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-purple-800 mb-3">团队协作</h4>
              <ul className="space-y-2 text-purple-700">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                  敏捷开发流程
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                  代码审查与规范
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                  技术培训与指导
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-purple-800 mb-3">项目管理</h4>
              <ul className="space-y-2 text-purple-700">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                  项目规划与执行
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                  风险评估与控制
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                  跨部门协调沟通
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 技能水平展示 */}
      <div className="mt-8 p-6 bg-gray-50 rounded-xl">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">技能水平</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl font-bold text-blue-600">95%</span>
            </div>
            <h4 className="font-medium text-gray-900 mb-1">前端开发</h4>
            <p className="text-sm text-gray-600">React生态系统专家</p>
          </div>
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl font-bold text-green-600">85%</span>
            </div>
            <h4 className="font-medium text-gray-900 mb-1">后端开发</h4>
            <p className="text-sm text-gray-600">全栈开发经验丰富</p>
          </div>
          <div className="text-center">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl font-bold text-purple-600">90%</span>
            </div>
            <h4 className="font-medium text-gray-900 mb-1">项目管理</h4>
            <p className="text-sm text-gray-600">团队协作与指导</p>
          </div>
        </div>
      </div>
    </div>
  )
}
