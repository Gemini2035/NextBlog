'use client'

import { ComponentType } from 'react'
import { SITE_CONFIG } from '@/constants'
import { ContactIcon, GmailIcon, OutlookIcon, ICloudIcon, TelegramIcon, QQIcon, DefaultContactIcon } from '@/assets/icons'
import { useTranslations } from 'next-intl'

interface ContactLinksBriefProps {
  className?: string
}

export default function ContactLinksBrief({ className }: ContactLinksBriefProps) {
  const navT = useTranslations('Navigation')

  // 图标映射表 - 支持后续扩展
  const iconMap: Record<string, ComponentType<{ className?: string; size?: number }>> = {
    googleMail: GmailIcon,
    outlookMail: OutlookIcon,
    appleMail: ICloudIcon,
    telegram: TelegramIcon,
    qq: QQIcon
    // 后续可以在这里添加更多图标的映射
  }

  // 联系方式配置 - 支持动态扩展
  const contactConfigs = [
    { key: 'googleMail', name: 'Gmail', isEmail: true },
    { key: 'outlookMail', name: 'Outlook', isEmail: true },
    { key: 'appleMail', name: 'iCloud', isEmail: true },
    { key: 'telegram', name: 'Telegram', isEmail: false },
    { key: 'qq', name: 'QQ', isEmail: false }
    // 后续可以在这里添加更多联系方式配置
  ]

  // 动态生成联系方式数组
  const contactMethods = contactConfigs
    .map(config => {
      const value = SITE_CONFIG.contactLink[config.key as keyof typeof SITE_CONFIG.contactLink]
      return {
        key: config.key,
        name: config.name,
        value,
        icon: iconMap[config.key] || DefaultContactIcon, // 如果没有专门图标，使用默认图标
        isEmail: config.isEmail
      }
    })
    .filter(method => method.value) // 过滤掉空值

  return (
    <div className={`${className} group`}>
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center mr-3">
          <ContactIcon className="w-5 h-5 text-gray-700" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            {navT('Contact Information')}
          </h3>
          <p className="text-sm text-gray-600">
            通过以下方式联系我
          </p>
        </div>
      </div>
      
      <div className="flex flex-wrap items-start gap-4 min-h-[3rem]">
        {contactMethods.map((method) => {
          const IconComponent = method.icon
          
          return (
            <div
              key={method.key}
              className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0"
              title={method.name}
            >
              <IconComponent className="w-6 h-6 text-gray-700" />
            </div>
          )
        })}
      </div>
    </div>
  )
}
