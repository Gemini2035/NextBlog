'use client'

import { SITE_CONFIG } from '@/constants'
import { ContactIcon, GmailIcon, OutlookIcon, ICloudIcon, EmailIcon } from '@/assets/icons'
import { Link } from '@/ui'
import { useTranslations } from 'next-intl'

interface ContactLinksDetailProps {
  className?: string
}

export default function ContactLinksDetail({ className }: ContactLinksDetailProps) {
  const navT = useTranslations('Navigation')

  const contactMethods = [
    {
      name: 'Gmail',
      email: SITE_CONFIG.contactLink.googleMail,
      color: 'from-red-500 to-red-600',
      description: '主要工作邮箱，适合商务合作和技术交流',
      icon: GmailIcon
    },
    {
      name: 'Outlook',
      email: SITE_CONFIG.contactLink.outlookMail,
      color: 'from-blue-500 to-blue-600',
      description: '企业邮箱，适合正式商务沟通',
      icon: OutlookIcon
    },
    {
      name: 'iCloud',
      email: SITE_CONFIG.contactLink.appleMail,
      color: 'from-gray-600 to-gray-700',
      description: '个人邮箱，适合日常交流',
      icon: ICloudIcon
    }
  ]

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
            {navT('Contact Description Detail')}
          </p>
        </div>
      </div>
      
      <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {contactMethods.map((contact, index) => (
          <div
            key={index}
            className="p-6 bg-white rounded-xl border border-gray-200 hover:border-green-300 hover:shadow-lg transition-all duration-200"
          >
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center flex-shrink-0">
                <contact.icon className="w-6 h-6 text-gray-700" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {contact.name}
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  {contact.description}
                </p>
                <Link
                  href={`mailto:${contact.email}`}
                  className="inline-flex items-center text-sm font-medium text-green-600 hover:text-green-800"
                >
                  发送邮件
                  <EmailIcon className="ml-1 w-4 h-4" />
                </Link>
                <div className="mt-2">
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-700">
                    {contact.email}
                  </code>
                </div>
              </div>
            </div>
          </div>
        ))}
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
