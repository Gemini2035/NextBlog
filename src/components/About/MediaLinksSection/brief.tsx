'use client'

import { SITE_CONFIG } from '@/constants'
import { GlobeIcon } from '@/assets/icons'
import { Link } from '@/ui'
import { useTranslations } from 'next-intl'

interface MediaLinksBriefProps {
  className?: string
}

export default function MediaLinksBrief({ className }: MediaLinksBriefProps) {
  const navT = useTranslations('Navigation')

  return (
    <div className={className}>
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
          <GlobeIcon className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            {navT('Media Links')}
          </h3>
          <p className="text-sm text-gray-600">
            关注我的媒体平台和社区
          </p>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-pink-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-700">Bilibili</span>
          </div>
          <Link
            href={SITE_CONFIG.mediaLink.bilibili}
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
            <div className="w-4 h-4 bg-purple-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-700">Pixiv</span>
          </div>
          <Link
            href={SITE_CONFIG.mediaLink.pixiv}
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
            <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-700">Telegram</span>
          </div>
          <Link
            href={SITE_CONFIG.mediaLink.telegram}
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
