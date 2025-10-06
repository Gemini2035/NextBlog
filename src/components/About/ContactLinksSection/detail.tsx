'use client'

import { ComponentType } from 'react'
import { SITE_CONFIG } from '@/constants'
import { ContactIcon, GmailIcon, OutlookIcon, ICloudIcon, EmailIcon, TelegramIcon, QQIcon, DefaultContactIcon } from '@/assets/icons'
import { Link } from '@/ui'
import { useTranslations } from 'next-intl'

interface ContactLinksDetailProps {
  className?: string
}

export default function ContactLinksDetail({ className }: ContactLinksDetailProps) {
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
    { 
      key: 'googleMail', 
      name: 'Gmail', 
      isEmail: true,
      color: 'from-red-500 to-red-600',
      description: '主要工作邮箱，适合商务合作和技术交流'
    },
    { 
      key: 'outlookMail', 
      name: 'Outlook', 
      isEmail: true,
      color: 'from-blue-500 to-blue-600',
      description: '企业邮箱，适合正式商务沟通'
    },
    { 
      key: 'appleMail', 
      name: 'iCloud', 
      isEmail: true,
      color: 'from-gray-600 to-gray-700',
      description: '个人邮箱，适合日常交流'
    },
    { 
      key: 'telegram', 
      name: 'Telegram', 
      isEmail: false,
      color: 'from-blue-400 to-blue-500',
      description: '即时通讯，适合快速沟通'
    },
    { 
      key: 'qq', 
      name: 'QQ', 
      isEmail: false,
      color: 'from-green-500 to-green-600',
      description: 'QQ联系方式，适合日常交流'
    }
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
        color: config.color,
        description: config.description,
        icon: iconMap[config.key] || DefaultContactIcon, // 如果没有专门图标，使用默认图标
        isEmail: config.isEmail
      }
    })
    .filter(method => method.value) // 过滤掉空值

  return (
    <div className={className}>
      <div className="flex items-center mb-8">
        <div className="w-16 h-16 bg-gray-200 rounded-xl flex items-center justify-center mr-6">
          <ContactIcon className="w-8 h-8 text-gray-700" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {navT('Contact Information')}
          </h2>
          <p className="text-lg text-gray-600">
            通过以下方式联系我
          </p>
        </div>
      </div>
      
      <div className="grid md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        {contactMethods.map((contact) => {
          const IconComponent = contact.icon
          const href = contact.isEmail ? `mailto:${contact.value}` : contact.value
          const linkText = contact.isEmail ? '发送邮件' : '访问链接'
          const linkIcon = contact.isEmail ? <EmailIcon className="ml-1 w-4 h-4" /> : <span className="ml-1">→</span>
          
          return (
            <div
              key={contact.key}
              className="p-6 bg-white rounded-xl border border-gray-200 hover:border-green-300 hover:shadow-lg transition-all duration-200"
            >
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center flex-shrink-0">
                  <IconComponent className="w-6 h-6 text-gray-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {contact.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {contact.description}
                  </p>
                  <Link
                    href={href}
                    className="inline-flex items-center text-sm font-medium text-green-600 hover:text-green-800"
                  >
                    {linkText}
                    {linkIcon}
                  </Link>
                  <div className="mt-2">
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-700 break-all">
                      {contact.value}
                    </code>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      
      <div className="p-6 bg-gray-50 rounded-xl">
        <h3 className="text-xl font-semibold text-gray-900 mb-3">
          联系建议
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-gray-400 rounded-full mr-3"></div>
              <span className="text-gray-700">技术合作和项目讨论</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-gray-400 rounded-full mr-3"></div>
              <span className="text-gray-700">开源项目贡献和协作</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-gray-400 rounded-full mr-3"></div>
              <span className="text-gray-700">商务合作和咨询</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-gray-400 rounded-full mr-3"></div>
              <span className="text-gray-700">技术分享和演讲邀请</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
