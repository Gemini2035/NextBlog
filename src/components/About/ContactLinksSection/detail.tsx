'use client'

import { ContactIcon, EmailIcon, DefaultContactIcon } from '@/assets/icons'
import { useContactLinks } from '@/components/About/AboutDataProvider'
import { StickySectionHeader } from '@/components/About/StickySectionHeader'
import { Link } from '@/ui'
import { useTranslations } from 'next-intl'
import Image from 'next/image'

interface ContactLinksDetailProps {
  className?: string
}

export default function ContactLinksDetail({ className }: ContactLinksDetailProps) {
  const navT = useTranslations('Navigation')
  const skillsT = useTranslations('Skills')
  const contactLinks = useContactLinks()
  const contactMethods = contactLinks.filter((item) => item.value)

  return (
    <div className={className}>
      <StickySectionHeader>
        <div className="flex items-start gap-4 sm:items-center sm:gap-6">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-blue-100 sm:h-16 sm:w-16">
            <ContactIcon className="w-8 h-8 text-blue-600" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="mb-2 text-2xl font-bold text-gray-900 sm:text-3xl">
              {navT('Contact Information')}
            </h2>
            <p className="text-base text-gray-600 sm:text-lg">
              {skillsT('contactDescriptionDetail')}
            </p>
          </div>
        </div>
      </StickySectionHeader>
      
      <div className="space-y-4">
        {contactMethods.map((contact) => {
          const isEmail = contact.type === 'email' || contact.value.includes('@')
          const href = isEmail ? `mailto:${contact.value}` : contact.value
          const linkText = isEmail ? skillsT('sendEmail') : skillsT('visitLink')
          const linkIcon = isEmail ? <EmailIcon className="ml-1 w-4 h-4" /> : <span className="ml-1">→</span>
          
          return (
            <div
              key={contact.key}
              className="p-6 bg-white rounded-xl border border-blue-200 hover:border-blue-400 transition-colors duration-200"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex min-w-0 items-center gap-4 sm:flex-1">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center shrink-0">
                    {contact.iconBase64 ? (
                      <Image src={contact.iconBase64} alt="" width={24} height={24} unoptimized className="h-6 w-6 object-contain" />
                    ) : (
                      <DefaultContactIcon className="w-6 h-6 text-gray-700" />
                    )}
                  </div>
                  <h3 className="min-w-0 text-lg font-semibold text-gray-900">
                    {contact.label || contact.key}
                  </h3>
                </div>
                <div className="min-w-0 sm:flex-1">
                  <code className="block rounded bg-blue-50 px-2 py-1 text-xs text-blue-700 break-all">
                    {contact.value}
                  </code>
                </div>
                <div className="shrink-0 sm:ml-auto">
                  <Link
                    href={href}
                    target={isEmail ? undefined : "_blank"}
                    rel={isEmail ? undefined : "noopener noreferrer"}
                    className="inline-flex w-full items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm hover:shadow-md sm:w-auto"
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
