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
            直接联系方式和邮箱地址
          </p>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <Link
          href={`mailto:${SITE_CONFIG.contactLink.googleMail}`}
          className="block"
        >
          <div className="relative w-12 h-12 bg-gray-200 rounded-full transition-all duration-300 group-hover:w-24 group-hover:rounded-xl overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center group-hover:opacity-0 transition-opacity duration-300">
              <GmailIcon className="w-6 h-6 text-gray-700" />
            </div>
            <div className="absolute inset-0 flex items-center justify-start pl-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <GmailIcon className="w-5 h-5 text-gray-700 mr-2 flex-shrink-0" />
              <span className="text-sm text-gray-700 font-medium whitespace-nowrap">
                Gmail
              </span>
            </div>
          </div>
        </Link>
        
        <Link
          href={`mailto:${SITE_CONFIG.contactLink.outlookMail}`}
          className="block"
        >
          <div className="relative w-12 h-12 bg-gray-200 rounded-full transition-all duration-300 group-hover:w-24 group-hover:rounded-xl overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center group-hover:opacity-0 transition-opacity duration-300">
              <OutlookIcon className="w-6 h-6 text-gray-700" />
            </div>
            <div className="absolute inset-0 flex items-center justify-start pl-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <OutlookIcon className="w-5 h-5 text-gray-700 mr-2 flex-shrink-0" />
              <span className="text-sm text-gray-700 font-medium whitespace-nowrap">
                Outlook
              </span>
            </div>
          </div>
        </Link>
        
        <Link
          href={`mailto:${SITE_CONFIG.contactLink.appleMail}`}
          className="block"
        >
          <div className="relative w-12 h-12 bg-gray-200 rounded-full transition-all duration-300 group-hover:w-24 group-hover:rounded-xl overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center group-hover:opacity-0 transition-opacity duration-300">
              <ICloudIcon className="w-6 h-6 text-gray-700" />
            </div>
            <div className="absolute inset-0 flex items-center justify-start pl-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <ICloudIcon className="w-5 h-5 text-gray-700 mr-2 flex-shrink-0" />
              <span className="text-sm text-gray-700 font-medium whitespace-nowrap">
                iCloud
              </span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}
