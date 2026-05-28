'use client'

import { ComponentType } from 'react'
import { useSiteConfig } from '@/components/SiteDataProvider'
import { ContactIcon, GmailIcon, OutlookIcon, ICloudIcon, TelegramIcon, DefaultContactIcon } from '@/assets/icons'
import { useTranslations } from 'next-intl'

interface ContactLinksBriefProps {
  className?: string
}

export default function ContactLinksBrief({ className }: ContactLinksBriefProps) {
  const navT = useTranslations('Navigation')
  const skillsT = useTranslations('Skills')
  const siteConfig = useSiteConfig()

  // 图标映射表 - 支持后续扩展
  const iconMap: Record<string, ComponentType<{ className?: string; size?: number }>> = {
    googleMail: GmailIcon,
    outlookMail: OutlookIcon,
    appleMail: ICloudIcon,
    telegram: TelegramIcon
    // 后续可以在这里添加更多图标的映射
  }

  // 动态生成联系方式数组 - 从site-config读取
  const contactMethods = Object.entries(siteConfig.contactLink ?? {})
    .map(([key, value]) => {
      // 联系方式名称映射 - 使用国际化
      const getContactName = (key: string) => {
        try {
          return skillsT(`contactMethods.${key}`)
        } catch {
          return key
        }
      }
      
      // 判断是否为邮箱
      const isEmail = key.includes('Mail')
      
      return {
        key,
        name: getContactName(key),
        value,
        icon: iconMap[key] || DefaultContactIcon,
        isEmail
      }
    })
    .filter(method => method.value) // 过滤掉空值

  return (
    <div className={`${className} group`}>
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3 shrink-0">
          <ContactIcon className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            {navT('Contact Information')}
          </h3>
          <p className="text-sm text-gray-600">
            {skillsT('contactDescription')}
          </p>
        </div>
      </div>
      
      <div className="flex flex-wrap items-start gap-4 min-h-[3rem]">
        {contactMethods.map((method) => {
          const IconComponent = method.icon
          
          return (
            <div
              key={method.key}
              className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center shrink-0"
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
