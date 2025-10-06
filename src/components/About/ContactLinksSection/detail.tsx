'use client'

import { ComponentType } from 'react'
import { SITE_CONFIG } from '@/constants'
import { ContactIcon, GmailIcon, OutlookIcon, ICloudIcon, EmailIcon, TelegramIcon, DefaultContactIcon } from '@/assets/icons'
import { Link } from '@/ui'
import { useTranslations } from 'next-intl'

interface ContactLinksDetailProps {
  className?: string
}

export default function ContactLinksDetail({ className }: ContactLinksDetailProps) {
  const navT = useTranslations('Navigation')
  const skillsT = useTranslations('Skills')

  // 图标映射表 - 支持后续扩展
  const iconMap: Record<string, ComponentType<{ className?: string; size?: number }>> = {
    googleMail: GmailIcon,
    outlookMail: OutlookIcon,
    appleMail: ICloudIcon,
    telegram: TelegramIcon
    // 后续可以在这里添加更多图标的映射
  }

  // 动态生成联系方式数组 - 从site-config读取
  const contactMethods = Object.entries(SITE_CONFIG.contactLink)
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
    <div className={className}>
      <div className="flex items-center mb-8">
        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center mr-6">
          <ContactIcon className="w-8 h-8 text-gray-700" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {navT('Contact Information')}
          </h2>
          <p className="text-lg text-gray-600">
            {skillsT('contactDescriptionDetail')}
          </p>
        </div>
      </div>
      
      <div className="space-y-4">
        {contactMethods.map((contact) => {
          const IconComponent = contact.icon
          const href = contact.isEmail ? `mailto:${contact.value}` : contact.value
          const linkText = contact.isEmail ? skillsT('sendEmail') : skillsT('visitLink')
          const linkIcon = contact.isEmail ? <EmailIcon className="ml-1 w-4 h-4" /> : <span className="ml-1">→</span>
          
          return (
            <div
              key={contact.key}
              className="p-6 bg-white rounded-xl border border-blue-200 hover:border-blue-400 hover:shadow-lg transition-all duration-200"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <IconComponent className="w-6 h-6 text-gray-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {contact.name}
                  </h3>
                  <div className="mt-2">
                    <code className="text-xs bg-blue-50 px-2 py-1 rounded text-blue-700 break-all">
                      {contact.value}
                    </code>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <Link
                    href={href}
                    target={contact.isEmail ? undefined : "_blank"}
                    rel={contact.isEmail ? undefined : "noopener noreferrer"}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm hover:shadow-md"
                  >
                    {linkText}
                    {linkIcon}
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
