'use client'

import { SITE_CONFIG } from '@/constants'
import { ContactIcon, GmailIcon, OutlookIcon, ICloudIcon } from '@/assets/icons'
import { Link } from '@/ui'
import { useTranslations } from 'next-intl'

interface ContactLinksBriefProps {
  className?: string
}

export default function ContactLinksBrief({ className }: ContactLinksBriefProps) {
  const navT = useTranslations('Navigation')

  return (
    <div className={className}>
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center mr-3">
          <ContactIcon className="w-5 h-5 text-gray-700" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            {navT('Contact Information')}
          </h3>
          <p className="text-sm text-gray-600">
            直接联系方式和邮箱地址
          </p>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <GmailIcon className="w-4 h-4 text-gray-700 mr-2" />
            <span className="text-sm text-gray-700">Gmail</span>
          </div>
          <Link
            href={`mailto:${SITE_CONFIG.contactLink.googleMail}`}
            className="text-blue-600 hover:text-blue-800 text-xs font-medium"
          >
            发送邮件 →
          </Link>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <OutlookIcon className="w-4 h-4 text-gray-700 mr-2" />
            <span className="text-sm text-gray-700">Outlook</span>
          </div>
          <Link
            href={`mailto:${SITE_CONFIG.contactLink.outlookMail}`}
            className="text-blue-600 hover:text-blue-800 text-xs font-medium"
          >
            发送邮件 →
          </Link>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <ICloudIcon className="w-4 h-4 text-gray-700 mr-2" />
            <span className="text-sm text-gray-700">iCloud</span>
          </div>
          <Link
            href={`mailto:${SITE_CONFIG.contactLink.appleMail}`}
            className="text-blue-600 hover:text-blue-800 text-xs font-medium"
          >
            发送邮件 →
          </Link>
        </div>
      </div>
    </div>
  )
}
