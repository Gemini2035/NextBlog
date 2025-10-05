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

      {/* 详细联系方式 */}
      <div id="contact" className="mb-8">
        <h3 className="text-2xl font-semibold text-gray-900 mb-6">
          {navT('Contact Information')}
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-gray-900 mb-3">社交媒体</h4>
            <div className="space-y-3">
              {SITE_CONFIG.social.github && (
                <Link
                  href={SITE_CONFIG.social.github}
                  external
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-4 bg-gray-50 hover:bg-blue-50 rounded-xl transition-all duration-200 group"
                >
                  <GitHubIcon className="w-6 h-6 text-gray-600 group-hover:text-blue-600 mr-4" />
                  <div>
                    <div className="font-medium text-gray-900">GitHub</div>
                    <div className="text-sm text-gray-600">查看我的开源项目</div>
                  </div>
                </Link>
              )}
              {SITE_CONFIG.social.twitter && (
                <Link
                  href={SITE_CONFIG.social.twitter}
                  external
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-4 bg-gray-50 hover:bg-blue-50 rounded-xl transition-all duration-200 group"
                >
                  <TwitterIcon className="w-6 h-6 text-gray-600 group-hover:text-blue-600 mr-4" />
                  <div>
                    <div className="font-medium text-gray-900">Twitter</div>
                    <div className="text-sm text-gray-600">关注我的动态</div>
                  </div>
                </Link>
              )}
              {SITE_CONFIG.social.linkedin && (
                <Link
                  href={SITE_CONFIG.social.linkedin}
                  external
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-4 bg-gray-50 hover:bg-blue-50 rounded-xl transition-all duration-200 group"
                >
                  <LinkedInIcon className="w-6 h-6 text-gray-600 group-hover:text-blue-600 mr-4" />
                  <div>
                    <div className="font-medium text-gray-900">LinkedIn</div>
                    <div className="text-sm text-gray-600">专业网络联系</div>
                  </div>
                </Link>
              )}
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-gray-900 mb-3">直接联系</h4>
            <div className="p-6 bg-blue-50 rounded-xl">
              <h5 className="font-semibold text-blue-900 mb-4">合作与交流</h5>
              <p className="text-blue-800 mb-4">
                如果您对我的工作感兴趣，或者想要合作，请随时联系我。
                我很乐意与您交流技术想法和项目合作。
              </p>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <span className="text-blue-700">
                    <strong>邮箱：</strong>your-email@example.com
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <span className="text-blue-700">
                    <strong>电话：</strong>+86 138-0000-0000
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <span className="text-blue-700">
                    <strong>微信：</strong>your-wechat-id
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
