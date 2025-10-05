'use client'

import { SITE_CONFIG } from '@/constants'
import { GitHubIcon, TwitterIcon, GlobeIcon } from '@/assets/icons'
import { Link } from '@/ui'
import { useTranslations } from 'next-intl'

interface SocialLinksBriefProps {
  className?: string
}

export default function SocialLinksBrief({ className }: SocialLinksBriefProps) {
  const navT = useTranslations('Navigation')

  return (
    <div className={className}>
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
          <GlobeIcon className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            {navT('Social Links')}
          </h3>
          <p className="text-sm text-gray-600">
            关注我的社交媒体和平台
          </p>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <GitHubIcon className="w-4 h-4 text-gray-600 mr-2" />
            <span className="text-sm text-gray-700">GitHub</span>
          </div>
          <Link
            href={SITE_CONFIG.socialLink.github}
            external
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 text-xs font-medium"
          >
            访问 →
          </Link>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <TwitterIcon className="w-4 h-4 text-gray-600 mr-2" />
            <span className="text-sm text-gray-700">Twitter</span>
          </div>
          <Link
            href={SITE_CONFIG.socialLink.twitter}
            external
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 text-xs font-medium"
          >
            访问 →
          </Link>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <GlobeIcon className="w-4 h-4 text-gray-600 mr-2" />
            <span className="text-sm text-gray-700">个人网站</span>
          </div>
          <Link
            href={SITE_CONFIG.socialLink.website}
            external
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 text-xs font-medium"
          >
            访问 →
          </Link>
        </div>
      </div>
    </div>
  )
}
