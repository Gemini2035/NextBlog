'use client'

import { useTranslations } from 'next-intl'
import { 
  OnlineServiceIcon,
  GitHubActionsIcon,
  VercelIcon,
  SearchConsoleIcon,
  GoDaddyIcon
} from '@/assets/icons'

interface OnlineServicesBriefProps {
  className?: string
}

export default function OnlineServicesBrief({ className }: OnlineServicesBriefProps) {
  const t = useTranslations('AboutPage')

  return (
    <div className={className}>
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3 shrink-0">
          <OnlineServiceIcon className="w-5 h-5 text-blue-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">
          {t('onlineServices')}
        </h2>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center mb-2">
            <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center mr-2">
              <VercelIcon className="w-4 h-4 text-gray-700" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 text-sm">Vercel</h3>
              <p className="text-xs text-gray-600">{t('onlineServicesBrief.vercel')}</p>
            </div>
          </div>
          <span className="text-xs text-green-600">{t('free')}</span>
        </div>

        <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center mb-2">
            <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center mr-2">
              <GitHubActionsIcon className="w-4 h-4 text-gray-700" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 text-sm">GitHub Actions</h3>
              <p className="text-xs text-gray-600">{t('onlineServicesBrief.githubActions')}</p>
            </div>
          </div>
          <span className="text-xs text-green-600">{t('free')}</span>
        </div>

        <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center mb-2">
            <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center mr-2">
              <SearchConsoleIcon className="w-4 h-4 text-gray-700" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 text-sm">Search Console</h3>
              <p className="text-xs text-gray-600">{t('onlineServicesBrief.seo')}</p>
            </div>
          </div>
          <span className="text-xs text-green-600">{t('free')}</span>
        </div>

        <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center mb-2">
            <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center mr-2">
              <GoDaddyIcon className="w-4 h-4 text-gray-700" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 text-sm">GoDaddy</h3>
              <p className="text-xs text-gray-600">{t('onlineServicesBrief.godaddy')}</p>
            </div>
          </div>
          <span className="text-xs text-green-600">{t('free')}</span>
        </div>
      </div>
    </div>
  )
}
