'use client'

import { SITE_CONFIG } from '@/constants'
import { GitHubIcon, TwitterIcon, LinkedInIcon, GlobeIcon } from '@/assets/icons'
import { Link } from '@/ui'
import { useTranslations } from 'next-intl'

interface BasicInfoDetailProps {
  className?: string
}

export default function BasicInfoDetail({ className }: BasicInfoDetailProps) {
  const t = useTranslations('AboutPage')
  const navT = useTranslations('Navigation')

  return (
    <div className={className}>
      <div className="flex items-center mb-8">
        <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mr-6">
          <GlobeIcon className="w-8 h-8 text-blue-600" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {navT('Personal Profile')}
          </h2>
          <p className="text-lg text-gray-600">
            详细个人信息与联系方式
          </p>
        </div>
      </div>
      
      {/* 完整的个人简介 */}
      <div className="mb-8" id="basic">
        <h3 className="text-2xl font-semibold text-gray-900 mb-6">
          关于我
        </h3>
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-700 leading-relaxed mb-4">
            {t('welcome', { siteTitle: SITE_CONFIG.title })}
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            我是一名热爱技术的开发者，专注于前端技术和全栈开发。拥有多年的Web开发经验，
            熟悉现代前端技术栈，包括React、Next.js、TypeScript等。喜欢分享学习心得，
            致力于构建优秀的用户体验和高质量的代码。
          </p>
          <p className="text-gray-700 leading-relaxed">
            在工作中，我注重代码质量和团队协作，善于解决复杂的技术问题。
            业余时间喜欢研究新技术，参与开源项目，并通过技术博客分享经验。
          </p>
        </div>
      </div>

    </div>
  )
}
