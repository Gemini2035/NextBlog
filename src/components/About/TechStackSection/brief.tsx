'use client'

import { useTranslations } from 'next-intl'
import { TechStackIcon, NextJsIcon, ContentlayerIcon, MdxIcon, TailwindIcon, TypeScriptIcon, DeploymentIcon, GraphQLIcon } from '@/assets/icons'

interface TechStackBriefProps {
  className?: string
}

export default function TechStackBrief({ className }: TechStackBriefProps) {
  const t = useTranslations('AboutPage')

  return (
    <div className={className}>
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3 shrink-0">
          <TechStackIcon className="w-5 h-5 text-blue-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">
          {t('techStack')}
        </h2>
      </div>
      
      <div className="grid grid-cols-3 gap-3">
        <div className="text-center">
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
            <NextJsIcon className="w-5 h-5 text-gray-700" />
          </div>
          <h3 className="font-medium text-gray-900 text-xs mb-1">Next.js</h3>
          <p className="text-xs text-gray-600">{t('techStackBrief.nextjsDesc')}</p>
        </div>
        
        <div className="text-center">
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
            <ContentlayerIcon className="w-5 h-5 text-gray-700" />
          </div>
          <h3 className="font-medium text-gray-900 text-xs mb-1">Contentlayer</h3>
          <p className="text-xs text-gray-600">{t('techStackBrief.contentlayerDesc')}</p>
        </div>
        
        <div className="text-center">
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
            <MdxIcon className="w-5 h-5 text-gray-700" />
          </div>
          <h3 className="font-medium text-gray-900 text-xs mb-1">MDX</h3>
          <p className="text-xs text-gray-600">{t('techStackBrief.mdxDesc')}</p>
        </div>
        
        <div className="text-center">
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
            <TailwindIcon className="w-5 h-5 text-gray-700" />
          </div>
          <h3 className="font-medium text-gray-900 text-xs mb-1">Tailwind</h3>
          <p className="text-xs text-gray-600">{t('techStackBrief.tailwindDesc')}</p>
        </div>
        
        <div className="text-center">
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
            <TypeScriptIcon className="w-5 h-5 text-gray-700" />
          </div>
          <h3 className="font-medium text-gray-900 text-xs mb-1">TypeScript</h3>
          <p className="text-xs text-gray-600">{t('techStackBrief.typescriptDesc')}</p>
        </div>
        
        <div className="text-center">
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
            <GraphQLIcon className="w-5 h-5 text-gray-700" />
          </div>
          <h3 className="font-medium text-gray-900 text-xs mb-1">GraphQL</h3>
          <p className="text-xs text-gray-600">高效数据查询</p>
        </div>
        
        <div className="text-center">
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
            <DeploymentIcon className="w-5 h-5 text-gray-700" />
          </div>
          <h3 className="font-medium text-gray-900 text-xs mb-1">CI/CD</h3>
          <p className="text-xs text-gray-600">{t('techStackBrief.deploymentDesc')}</p>
        </div>
      </div>
    </div>
  )
}
