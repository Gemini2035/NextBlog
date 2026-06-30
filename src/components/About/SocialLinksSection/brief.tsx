'use client'

import { GlobeIcon, StarIcon } from '@/assets/icons'
import { useFriendLinks, useSocialLinks } from '@/components/About/AboutDataProvider'
import { FallbackImage } from '@/components/FallbackImage'
import { Link } from '@/ui'
import { useTranslations } from 'next-intl'

interface SocialLinksBriefProps {
  className?: string
}

export default function SocialLinksBrief({ className }: SocialLinksBriefProps) {
  const navT = useTranslations('Navigation')
  const skillsT = useTranslations('Skills')
  const socialLinks = useSocialLinks()
  const friendLinks = useFriendLinks()

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
            {skillsT('socialDescription')}
          </p>
        </div>
      </div>
      
      <div className="flex flex-wrap items-start gap-4 min-h-[3rem]">
        {socialLinks.map((link) => (
          <div
            key={`${link.name}:${link.url}`}
            className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center shrink-0"
            title={link.name}
          >
            <FallbackImage
              src={link.icon}
              alt=""
              className="h-6 w-6 object-contain"
              fallback={<GlobeIcon className="w-6 h-6 text-gray-700" />}
            />
          </div>
        ))}
      </div>

      {friendLinks.length > 0 && (
        <>
          <h4 className="text-base font-semibold text-gray-900 mt-6 mb-3 pt-4 border-t border-gray-200">
            {skillsT('friendLinksTitle')}
          </h4>
          <div className="flex flex-wrap items-start gap-4 min-h-[3rem]">
            {friendLinks.map((link) => (
              <Link
                key={link.name}
                href={link.url}
                external
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center shrink-0 hover:bg-gray-300 transition-colors"
                title={link.name}
              >
                <FallbackImage
                  src={link.icon}
                  alt=""
                  className="h-6 w-6 object-contain"
                  fallback={<GlobeIcon className="w-6 h-6 text-gray-700" />}
                />
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
