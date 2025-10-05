'use client'

import { SITE_CONFIG } from '@/constants'
import { GitHubIcon, TwitterIcon, LinkedInIcon, GlobeIcon } from '@/assets/icons'
import { Link, Card } from '@/ui'
import { useTranslations } from 'next-intl'

interface BasicInfoSectionProps {
  className?: string
}

export default function BasicInfoSection({ className }: BasicInfoSectionProps) {
  const t = useTranslations('AboutPage')
  const navT = useTranslations('Navigation')

  return (
    <Card shadow="lg" border="sm" rounded className={`p-8 bg-white/80 backdrop-blur-sm h-full ${className || ''}`}>
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
          <GlobeIcon className="w-6 h-6 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">
          {navT('Basic Information')}
        </h2>
      </div>
      
      {/* 个人简介 */}
      <div className="mb-8" id="basic">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          {navT('Personal Profile')}
        </h3>
        <p className="text-gray-600 leading-relaxed">
          {t('welcome', { siteTitle: SITE_CONFIG.title })}
        </p>
        <p className="text-gray-600 leading-relaxed mt-4">
          我是一名热爱技术的开发者，专注于前端技术和全栈开发。
          喜欢分享学习心得，致力于构建优秀的用户体验和高质量的代码。
        </p>
      </div>

      {/* 联系方式 */}
      <div id="contact">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          {navT('Contact Information')}
        </h3>
        <div className="flex flex-wrap gap-4">
          {SITE_CONFIG.social.github && (
            <Link
              href={SITE_CONFIG.social.github}
              external
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-700 rounded-lg transition-all duration-200"
            >
              <GitHubIcon className="w-5 h-5 mr-2" />
              GitHub
            </Link>
          )}
          {SITE_CONFIG.social.twitter && (
            <Link
              href={SITE_CONFIG.social.twitter}
              external
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-700 rounded-lg transition-all duration-200"
            >
              <TwitterIcon className="w-5 h-5 mr-2" />
              Twitter
            </Link>
          )}
          {SITE_CONFIG.social.linkedin && (
            <Link
              href={SITE_CONFIG.social.linkedin}
              external
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-700 rounded-lg transition-all duration-200"
            >
              <LinkedInIcon className="w-5 h-5 mr-2" />
              LinkedIn
            </Link>
          )}
        </div>
      </div>
    </Card>
  )
}