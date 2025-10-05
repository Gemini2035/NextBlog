'use client'

import { useTranslations } from 'next-intl'

interface AchievementsSectionProps {
  className?: string
}

export default function AchievementsSection({ className }: AchievementsSectionProps) {
  const navT = useTranslations('Navigation')

  return (
    <div className={className}>
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900" id="achievements">
          {navT('Personal Achievements')}
        </h2>
      </div>
      <div className="space-y-4">
        <div className="flex items-start">
          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
          <div>
            <p className="text-gray-800 font-medium">开源贡献者</p>
            <p className="text-gray-600 text-sm">为多个开源项目贡献代码，获得社区认可</p>
          </div>
        </div>
        <div className="flex items-start">
          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
          <div>
            <p className="text-gray-800 font-medium">技术博客作者</p>
            <p className="text-gray-600 text-sm">定期分享技术文章，帮助开发者成长</p>
          </div>
        </div>
        <div className="flex items-start">
          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
          <div>
            <p className="text-gray-800 font-medium">项目经验丰富</p>
            <p className="text-gray-600 text-sm">参与多个大型项目，具备完整的开发经验</p>
          </div>
        </div>
      </div>
    </div>
  )
}