'use client'

import { ContactIcon, DefaultContactIcon } from '@/assets/icons'
import { useContactLinks } from '@/components/About/AboutDataProvider'
import { useTranslations } from 'next-intl'
import Image from 'next/image'

interface ContactLinksBriefProps {
  className?: string
}

export default function ContactLinksBrief({ className }: ContactLinksBriefProps) {
  const navT = useTranslations('Navigation')
  const skillsT = useTranslations('Skills')
  const contactLinks = useContactLinks()
  const contactMethods = contactLinks.filter((item) => item.value)

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
          return (
            <div
              key={method.id}
              className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center shrink-0"
              title={method.label || method.value}
            >
              {method.iconBase64 ? (
                <Image src={method.iconBase64} alt="" width={24} height={24} unoptimized className="h-6 w-6 object-contain" />
              ) : (
                <DefaultContactIcon className="w-6 h-6 text-gray-700" />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
