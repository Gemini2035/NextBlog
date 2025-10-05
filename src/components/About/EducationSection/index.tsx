'use client'

import { useTranslations } from 'next-intl'

interface EducationSectionProps {
  className?: string
}

export default function EducationSection({ className }: EducationSectionProps) {
  const navT = useTranslations('Navigation')

  return (
    <div className={className}>
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900" id="education">
          {navT('Education Background')}
        </h2>
      </div>
      <div className="space-y-4">
        <div className="border-l-4 border-blue-200 pl-4">
          <h4 className="font-medium text-gray-800">计算机科学与技术</h4>
          <p className="text-sm text-gray-600">学士学位 | 2016 - 2020</p>
          <p className="text-gray-600 text-sm mt-2">
            系统学习计算机基础知识，包括数据结构、算法、数据库、网络等核心课程。
          </p>
        </div>
      </div>
    </div>
  )
}