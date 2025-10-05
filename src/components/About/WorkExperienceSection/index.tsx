'use client'

import { useTranslations } from 'next-intl'

interface WorkExperienceSectionProps {
  className?: string
}

export default function WorkExperienceSection({ className }: WorkExperienceSectionProps) {
  const navT = useTranslations('Navigation')

  return (
    <div className={className}>
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">
          {navT('Work Experience')}
        </h2>
      </div>

      <div className="space-y-6" id="work">
        <div className="border-l-4 border-blue-200 pl-4">
          <h4 className="font-medium text-gray-800">全栈开发工程师</h4>
          <p className="text-sm text-gray-600">2022 - 至今</p>
          <p className="text-gray-600 text-sm mt-2">
            负责前端和后端开发，参与多个项目的架构设计和实现。
          </p>
        </div>
        <div className="border-l-4 border-gray-200 pl-4">
          <h4 className="font-medium text-gray-800">前端开发工程师</h4>
          <p className="text-sm text-gray-600">2020 - 2022</p>
          <p className="text-gray-600 text-sm mt-2">
            专注于React和Vue.js开发，提升用户体验和页面性能。
          </p>
        </div>
      </div>
    </div>
  )
}