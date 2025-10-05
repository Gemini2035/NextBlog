'use client'

import { SITE_CONFIG } from '@/constants'
import { GitHubIcon, TwitterIcon, GlobeIcon } from '@/assets/icons'
import { Link } from '@/ui'
import { useTranslations } from 'next-intl'

interface SocialLinksDetailProps {
  className?: string
}

export default function SocialLinksDetail({ className }: SocialLinksDetailProps) {
  const navT = useTranslations('Navigation')

  const socialLinks = [
    {
      name: 'GitHub',
      href: SITE_CONFIG.socialLink.github,
      icon: GitHubIcon,
      description: navT('Follow my open source projects'),
      color: 'from-gray-600 to-gray-800'
    },
    {
      name: 'Twitter',
      href: SITE_CONFIG.socialLink.twitter,
      icon: TwitterIcon,
      description: navT('Follow my latest updates'),
      color: 'from-blue-400 to-blue-600'
    },
    {
      name: 'Bilibili',
      href: SITE_CONFIG.socialLink.bilibili,
      icon: GlobeIcon,
      description: navT('Watch my technical videos'),
      color: 'from-pink-500 to-pink-700'
    },
    {
      name: 'Pixiv',
      href: SITE_CONFIG.socialLink.pixiv,
      icon: GlobeIcon,
      description: navT('View my creative works'),
      color: 'from-purple-500 to-purple-700'
    },
    {
      name: 'Telegram',
      href: SITE_CONFIG.socialLink.telegram,
      icon: GlobeIcon,
      description: navT('Join my community'),
      color: 'from-blue-500 to-blue-700'
    },
    {
      name: 'Personal Website',
      href: SITE_CONFIG.socialLink.website,
      icon: GlobeIcon,
      description: navT('Visit my personal website'),
      color: 'from-green-500 to-green-700'
    }
  ]

  return (
    <div className={className}>
      <div className="flex items-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-6">
          <GlobeIcon className="w-8 h-8 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {navT('Social Links')}
          </h2>
          <p className="text-lg text-gray-600">
            关注我的社交媒体和平台，获取最新动态
          </p>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {socialLinks.map((social, index) => {
          const IconComponent = social.icon
          return (
            <Link
              key={index}
              href={social.href}
              external
              target="_blank"
              rel="noopener noreferrer"
              className="group block p-6 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200"
            >
              <div className="flex items-start space-x-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${social.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                    {social.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {social.description}
                  </p>
                  <div className="mt-3">
                    <span className="inline-flex items-center text-sm font-medium text-blue-600 group-hover:text-blue-800">
                      访问平台
                      <svg className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
      
      <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
        <h3 className="text-xl font-semibold text-gray-900 mb-3">
          为什么关注我？
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              <span className="text-gray-700">获取最新的技术分享和开发经验</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              <span className="text-gray-700">参与开源项目讨论和协作</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
              <span className="text-gray-700">观看技术视频和教程内容</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
              <span className="text-gray-700">加入技术社区交流学习</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
