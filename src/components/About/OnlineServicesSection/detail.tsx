'use client'

import { useTranslations } from 'next-intl'
import { 
  OnlineServiceIcon,
  GitHubActionsIcon,
  VercelIcon,
  SearchConsoleIcon,
  GoDaddyIcon,
  GitHubIcon
} from '@/assets/icons'
import { cn } from '@/utils'

interface OnlineServicesDetailProps {
  className?: string
}

interface ServiceCardProps {
  icon: React.ReactNode
  name: string
  category: string
  description: string
  pricing: string
  websiteUrl: string
  docsUrl?: string
}

function ServiceCard({ icon, name, category, description, pricing, websiteUrl, docsUrl }: ServiceCardProps) {
  const t = useTranslations('AboutPage')
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow flex flex-col">
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3 shrink-0">
          {icon}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{name}</h3>
          <p className="text-sm text-gray-600">{category}</p>
        </div>
      </div>
      <p className="text-gray-600 text-sm mb-4 flex-grow">
        {description}
      </p>
      <div className="mt-auto pt-2 border-t border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-green-600 font-medium">{pricing}</span>
        </div>
        <div className="flex items-center justify-between">
          <a 
            href={websiteUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className={cn(
              "text-blue-600 hover:text-blue-800 text-sm font-medium",
              "flex items-center gap-1 transition-colors"
            )}
          >
            {t('onlineServicesDetail.visitWebsite')} →
          </a>
          {docsUrl && (
            <a 
              href={docsUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className={cn(
                "text-gray-600 hover:text-gray-900 text-sm",
                "flex items-center gap-1 transition-colors"
              )}
            >
              {t('onlineServicesDetail.viewDocs')}
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export default function OnlineServicesDetail({ className }: OnlineServicesDetailProps) {
  const t = useTranslations('AboutPage')

  return (
    <div className={className} id="online-services">
      <div className="flex items-center mb-8">
        <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mr-6 shrink-0">
          <OnlineServiceIcon className="w-8 h-8 text-blue-600" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {t('onlineServices')}
          </h2>
          <p className="text-lg text-gray-600">
            {t('onlineServicesDetail.description')}
          </p>
        </div>
      </div>
      
      {/* 托管与部署 */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('onlineServicesDetail.hostingDeployment')}</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ServiceCard 
            icon={<VercelIcon className="w-5 h-5 text-gray-700" />}
            name="Vercel"
            category={t('onlineServicesDetail.categories.deployment')}
            description={t('onlineServicesDetail.services.vercel')}
            pricing={t('free')}
            websiteUrl="https://vercel.com"
            docsUrl="https://vercel.com/docs"
          />
        </div>
      </div>

      {/* 域名服务 */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('onlineServicesDetail.domainServices')}</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ServiceCard 
            icon={<GoDaddyIcon className="w-5 h-5 text-gray-700" />}
            name="GoDaddy"
            category={t('onlineServicesDetail.categories.domain')}
            description={t('onlineServicesDetail.services.godaddyDomain')}
            pricing={t('onlineServicesDetail.paid')}
            websiteUrl="https://www.godaddy.com"
            docsUrl="https://www.godaddy.com/help"
          />
        </div>
      </div>

      {/* 分析与监控 */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('onlineServicesDetail.analyticsMonitoring')}</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ServiceCard 
            icon={<SearchConsoleIcon className="w-5 h-5 text-gray-700" />}
            name="Google Search Console"
            category={t('onlineServicesDetail.categories.seo')}
            description={t('onlineServicesDetail.services.searchConsole')}
            pricing={t('free')}
            websiteUrl="https://search.google.com/search-console"
            docsUrl="https://support.google.com/webmasters"
          />
          <ServiceCard 
            icon={<GoDaddyIcon className="w-5 h-5 text-gray-700" />}
            name="GoDaddy Analytics"
            category={t('onlineServicesDetail.categories.analytics')}
            description={t('onlineServicesDetail.services.godaddy')}
            pricing={t('free')}
            websiteUrl="https://www.godaddy.com"
            docsUrl="https://www.godaddy.com/help"
          />
        </div>
      </div>

      {/* 版本控制与CI/CD */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('onlineServicesDetail.versionControlCICD')}</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ServiceCard 
            icon={<GitHubIcon className="w-5 h-5 text-gray-700" />}
            name="GitHub"
            category={t('onlineServicesDetail.categories.versionControl')}
            description={t('onlineServicesDetail.services.github')}
            pricing={t('free')}
            websiteUrl="https://github.com"
            docsUrl="https://docs.github.com"
          />
          <ServiceCard 
            icon={<GitHubActionsIcon className="w-5 h-5 text-gray-700" />}
            name="GitHub Actions"
            category={t('onlineServicesDetail.categories.cicd')}
            description={t('onlineServicesDetail.services.githubActions')}
            pricing={t('free')}
            websiteUrl="https://github.com/features/actions"
            docsUrl="https://docs.github.com/actions"
          />
        </div>
      </div>
    </div>
  )
}
