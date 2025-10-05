'use client'

import { SITE_CONFIG } from '@/constants'
import { GlobeIcon } from '@/assets/icons'
import { Link } from '@/ui'
import { useTranslations } from 'next-intl'

interface MediaLinksDetailProps {
  className?: string
}

export default function MediaLinksDetail({ className }: MediaLinksDetailProps) {
  const navT = useTranslations('Navigation')

  const mediaLinks = [
    {
      name: 'Bilibili',
      href: SITE_CONFIG.mediaLink.bilibili,
      icon: GlobeIcon,
      description: navT('Watch my technical videos'),
      color: 'from-pink-500 to-pink-700'
    },
    {
      name: 'Pixiv',
      href: SITE_CONFIG.mediaLink.pixiv,
      icon: GlobeIcon,
      description: navT('View my creative works'),
      color: 'from-purple-500 to-purple-700'
    },
    {
      name: 'Telegram',
      href: SITE_CONFIG.mediaLink.telegram,
      icon: GlobeIcon,
      description: navT('Join my community'),
      color: 'from-blue-500 to-blue-700'
    },
    {
      name: 'QQ',
      href: `https://qm.qq.com/q/${SITE_CONFIG.mediaLink.qq}`,
      icon: GlobeIcon,
      description: navT('Contact me directly'),
      color: 'from-green-500 to-green-700'
    }
  ]

  return (
    <div className={className}>
      <div className="flex items-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl flex items-center justify-center mr-6">
          <GlobeIcon className="w-8 h-8 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {navT('Media Links')}
          </h2>
          <p className="text-lg text-gray-600">
            关注我的媒体平台和社区，获取更多内容
          </p>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
        {mediaLinks.map((media, index) => {
          const IconComponent = media.icon
          return (
            <Link
              key={index}
              href={media.href}
              external
              target="_blank"
              rel="noopener noreferrer"
              className="group block p-6 bg-white rounded-xl border border-gray-200 hover:border-pink-300 hover:shadow-lg transition-all duration-200"
            >
              <div className="flex items-start space-x-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${media.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-pink-600 transition-colors duration-200">
                    {media.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {media.description}
                  </p>
                  <div className="mt-3">
                    <span className="inline-flex items-center text-sm font-medium text-pink-600 group-hover:text-pink-800">
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
      
      <div className="mt-8 p-6 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl">
        <h3 className="text-xl font-semibold text-gray-900 mb-3">
          媒体平台特色
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-pink-500 rounded-full mr-3"></div>
              <span className="text-gray-700">Bilibili - 技术视频和教程分享</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-pink-500 rounded-full mr-3"></div>
              <span className="text-gray-700">Pixiv - 创意作品和设计展示</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
              <span className="text-gray-700">Telegram - 技术社区交流</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
              <span className="text-gray-700">QQ - 直接联系和即时沟通</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
