'use client'

import { ComponentType } from 'react'
import { SITE_CONFIG } from '@/constants'
import { GitHubIcon, TwitterIcon, GlobeIcon, BilibiliIcon, PixivIcon, StarIcon } from '@/assets/icons'
import { Link } from '@/ui'
import { useTranslations } from 'next-intl'

interface SocialLinksDetailProps {
  className?: string
}

export default function SocialLinksDetail({ className }: SocialLinksDetailProps) {
  const navT = useTranslations('Navigation')
  const skillsT = useTranslations('Skills')

  // 图标映射表 - 支持后续扩展
  const iconMap: Record<string, ComponentType<{ className?: string; size?: number }>> = {
    github: GitHubIcon,
    twitter: TwitterIcon,
    website: GlobeIcon,
    bilibili: BilibiliIcon,
    pixiv: PixivIcon
  }

  // 动态生成社交链接数组 - 从site-config读取
  const socialLinks = Object.entries(SITE_CONFIG.socialLink)
    .map(([key, value]) => {
      // 社交平台名称映射 - 使用国际化
      const getSocialName = (key: string) => {
        try {
          return skillsT(`socialPlatforms.${key}`)
        } catch {
          return key
        }
      }
      
      
      return {
        key,
        name: getSocialName(key),
        value,
        icon: iconMap[key] || GlobeIcon
      }
    })
    .filter(link => link.value) // 过滤掉空值

  return (
    <div className={className}>
      <div className="flex items-center mb-8">
        <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mr-6">
          <StarIcon className="w-8 h-8 text-blue-600" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {navT('Social Links')}
          </h2>
          <p className="text-lg text-gray-600">
            {skillsT('socialDescriptionDetail')}
          </p>
        </div>
      </div>
      
      <div className="space-y-4">
        {socialLinks.map((link) => {
          const IconComponent = link.icon
          
          return (
            <div
              key={link.key}
              className="p-6 bg-white rounded-xl border border-blue-200 hover:border-blue-400 hover:shadow-lg transition-all duration-200"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <IconComponent className="w-6 h-6 text-gray-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {link.name}
                  </h3>
                  <div className="mt-2">
                    <code className="text-xs bg-blue-50 px-2 py-1 rounded text-blue-700 break-all">
                      {link.value}
                    </code>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <Link
                    href={link.value}
                    external
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm hover:shadow-md"
                  >
                    {skillsT('visitPlatform')}
                    <span className="ml-1">→</span>
                  </Link>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
