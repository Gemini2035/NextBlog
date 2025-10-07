'use client'

import { useTranslations } from 'next-intl'
import {
  WCAGIcon,
  CreativeCommonsIcon,
  HTTPSIcon,
  OpenGraphIcon,
  SchemaOrgIcon,
  RSSIcon,
  HTML5Icon,
  RESTfulIcon,
} from '@/assets/icons'
import { cn } from '@/utils'

interface DevelopmentProtocolsDetailProps {
  className?: string
}

interface Protocol {
  id: string
  icon: React.ComponentType<{ className?: string }>
  color: {
    bg: string
    icon: string
    badge: string
  }
  category: string
}

const protocols: Protocol[] = [
  {
    id: 'wcag',
    icon: WCAGIcon,
    color: {
      bg: 'bg-blue-50',
      icon: 'text-blue-600',
      badge: 'bg-blue-100 text-blue-800',
    },
    category: 'accessibility',
  },
  {
    id: 'ccLicense',
    icon: CreativeCommonsIcon,
    color: {
      bg: 'bg-green-50',
      icon: 'text-green-600',
      badge: 'bg-green-100 text-green-800',
    },
    category: 'licensing',
  },
  {
    id: 'https',
    icon: HTTPSIcon,
    color: {
      bg: 'bg-emerald-50',
      icon: 'text-emerald-600',
      badge: 'bg-emerald-100 text-emerald-800',
    },
    category: 'security',
  },
  {
    id: 'opengraph',
    icon: OpenGraphIcon,
    color: {
      bg: 'bg-purple-50',
      icon: 'text-purple-600',
      badge: 'bg-purple-100 text-purple-800',
    },
    category: 'metadata',
  },
  {
    id: 'schema',
    icon: SchemaOrgIcon,
    color: {
      bg: 'bg-indigo-50',
      icon: 'text-indigo-600',
      badge: 'bg-indigo-100 text-indigo-800',
    },
    category: 'metadata',
  },
  {
    id: 'rss',
    icon: RSSIcon,
    color: {
      bg: 'bg-orange-50',
      icon: 'text-orange-600',
      badge: 'bg-orange-100 text-orange-800',
    },
    category: 'syndication',
  },
  {
    id: 'html5',
    icon: HTML5Icon,
    color: {
      bg: 'bg-red-50',
      icon: 'text-red-600',
      badge: 'bg-red-100 text-red-800',
    },
    category: 'markup',
  },
  {
    id: 'restful',
    icon: RESTfulIcon,
    color: {
      bg: 'bg-cyan-50',
      icon: 'text-cyan-600',
      badge: 'bg-cyan-100 text-cyan-800',
    },
    category: 'api',
  },
]

export default function DevelopmentProtocolsDetail({
  className,
}: DevelopmentProtocolsDetailProps) {
  const t = useTranslations('AboutPage')

  return (
    <div className={cn(className)} id="protocols">
      {/* 标题部分 */}
      <div className="flex items-center mb-8">
        <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mr-6">
          <span className="text-3xl">🌐</span>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {t('developmentProtocols')}
          </h2>
          <p className="text-lg text-gray-600">
            {t('developmentProtocolsDescription')}
          </p>
        </div>
      </div>

      {/* 协议列表 */}
      <div className="space-y-6">
        {protocols.map((protocol) => {
          const Icon = protocol.icon
          const protocolData = t.raw(
            `protocolsDetail.protocols.${protocol.id}`
          ) as {
            name: string
            fullName: string
            description: string
            features: string[]
            url: string
          }

          return (
            <div
              key={protocol.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
            >
              <div className="p-6">
                {/* 协议头部 */}
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className={cn(
                      'flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center',
                      protocol.color.bg
                    )}
                  >
                    <Icon className={cn('w-6 h-6', protocol.color.icon)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">
                        {protocolData.name}
                      </h3>
                      <span
                        className={cn(
                          'px-2.5 py-0.5 text-xs font-medium rounded-full',
                          protocol.color.badge
                        )}
                      >
                        {t(
                          `protocolsDetail.categories.${protocol.category}` as 'protocolsDetail.categories.accessibility'
                        )}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      {protocolData.fullName}
                    </p>
                  </div>
                </div>

                {/* 协议描述 */}
                <p className="text-gray-700 mb-4 leading-relaxed">
                  {protocolData.description}
                </p>

                {/* 特性列表 */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">
                    {t('protocolsDetail.keyFeatures')}
                  </h4>
                  <div className="grid md:grid-cols-2 gap-2">
                    {protocolData.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <span
                          className={cn(
                            'flex-shrink-0 w-1.5 h-1.5 rounded-full mt-2',
                            protocol.color.icon.replace('text-', 'bg-')
                          )}
                        />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 链接 */}
                <div className="pt-4 border-t border-gray-100">
                  <a
                    href={protocolData.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      'inline-flex items-center gap-2 text-sm font-medium hover:underline transition-colors',
                      protocol.color.icon
                    )}
                  >
                    <span>{t('protocolsDetail.viewSpec')}</span>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* 底部说明 */}
      <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-100">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 bg-white rounded-lg flex items-center justify-center">
            <span className="text-xl">✨</span>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              {t('protocolsDetail.title')}
            </h4>
            <p className="text-gray-700 leading-relaxed">
              {t('protocolsDetail.description')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
