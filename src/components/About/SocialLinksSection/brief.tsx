'use client'

            import { ComponentType } from 'react'
import { SITE_CONFIG } from '@/constants'
import { GitHubIcon, TwitterIcon, GlobeIcon, BilibiliIcon, PixivIcon, StarIcon } from '@/assets/icons'
import { useTranslations } from 'next-intl'

interface SocialLinksBriefProps {
  className?: string
}

export default function SocialLinksBrief({ className }: SocialLinksBriefProps) {
  const navT = useTranslations('Navigation')

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
      // 社交平台名称映射
      const nameMap: Record<string, string> = {
        github: 'GitHub',
        twitter: 'Twitter',
        website: 'Website',
        bilibili: 'Bilibili',
        pixiv: 'Pixiv'
      }
      
      return {
        key,
        name: nameMap[key] || key,
        value,
        icon: iconMap[key] || GlobeIcon
      }
    })
    .filter(link => link.value) // 过滤掉空值

  return (
    <div className={`${className} group`}>
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
          <StarIcon className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            {navT('Social Links')}
          </h3>
          <p className="text-sm text-gray-600">
            关注我的社交媒体和平台
          </p>
        </div>
      </div>
      
      <div className="flex flex-wrap items-start gap-4 min-h-[3rem]">
        {socialLinks.map((link) => {
          const IconComponent = link.icon
          
          return (
            <div
              key={link.key}
              className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0"
              title={link.name}
            >
              <IconComponent className="w-6 h-6 text-gray-700" />
            </div>
          )
        })}
      </div>
    </div>
  )
}