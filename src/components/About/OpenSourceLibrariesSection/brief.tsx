'use client'

import { useTranslations } from 'next-intl'
import { 
  OpenSourceIcon, 
  ReactIcon, 
  NextJsIcon, 
  ContentlayerIcon, 
  TailwindIcon,
  OctokitIcon,
  RechartsIcon
} from '@/assets/icons'

interface OpenSourceLibrariesBriefProps {
  className?: string
}

export default function OpenSourceLibrariesBrief({ className }: OpenSourceLibrariesBriefProps) {
  const t = useTranslations('AboutPage')

  return (
    <div className={className}>
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3 shrink-0">
          <OpenSourceIcon className="w-5 h-5 text-blue-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">
          {t('openSourceLibraries')}
        </h2>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center mb-2">
            <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center mr-2">
              <ReactIcon className="w-4 h-4 text-gray-700" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 text-sm">React</h3>
              <p className="text-xs text-gray-600">{t('openSourceLibrariesBrief.react')}</p>
            </div>
          </div>
          <span className="text-xs text-gray-500">v19.1.0</span>
        </div>

        <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center mb-2">
            <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center mr-2">
              <NextJsIcon className="w-4 h-4 text-gray-700" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 text-sm">Next.js</h3>
              <p className="text-xs text-gray-600">{t('openSourceLibrariesBrief.nextjs')}</p>
            </div>
          </div>
          <span className="text-xs text-gray-500">v15.5.3</span>
        </div>

        <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center mb-2">
            <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center mr-2">
              <ContentlayerIcon className="w-4 h-4 text-gray-700" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 text-sm">Contentlayer</h3>
              <p className="text-xs text-gray-600">{t('openSourceLibrariesBrief.contentlayer')}</p>
            </div>
          </div>
          <span className="text-xs text-gray-500">v0.5.8</span>
        </div>

        <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center mb-2">
            <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center mr-2">
              <TailwindIcon className="w-4 h-4 text-gray-700" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 text-sm">Tailwind CSS</h3>
              <p className="text-xs text-gray-600">{t('openSourceLibrariesBrief.tailwind')}</p>
            </div>
          </div>
          <span className="text-xs text-gray-500">v4.0.0</span>
        </div>

        <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center mb-2">
            <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center mr-2">
              <OctokitIcon className="w-4 h-4 text-gray-700" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 text-sm">Octokit</h3>
              <p className="text-xs text-gray-600">GraphQL 客户端</p>
            </div>
          </div>
          <span className="text-xs text-gray-500">v9.0.2</span>
        </div>

        <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center mb-2">
            <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center mr-2">
              <RechartsIcon className="w-4 h-4 text-gray-700" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 text-sm">Recharts</h3>
              <p className="text-xs text-gray-600">数据可视化</p>
            </div>
          </div>
          <span className="text-xs text-gray-500">v3.2.1</span>
        </div>
      </div>
    </div>
  )
}
