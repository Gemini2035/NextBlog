'use client'

import { useTranslations } from 'next-intl'
import {
  WCAGIcon,
  CreativeCommonsIcon,
  HTTPSIcon,
  OpenGraphIcon,
} from '@/assets/icons'
import { cn } from '@/utils'

interface DevelopmentProtocolsBriefProps {
  className?: string
}

interface ProtocolBrief {
  id: keyof {
    wcag: string
    ccLicense: string
    https: string
    opengraph: string
  }
  icon: React.ComponentType<{ className?: string }>
  color: {
    bg: string
    icon: string
  }
}

const protocolsBrief: ProtocolBrief[] = [
  {
    id: 'wcag',
    icon: WCAGIcon,
    color: {
      bg: 'bg-blue-50',
      icon: 'text-blue-600',
    },
  },
  {
    id: 'ccLicense',
    icon: CreativeCommonsIcon,
    color: {
      bg: 'bg-green-50',
      icon: 'text-green-600',
    },
  },
  {
    id: 'https',
    icon: HTTPSIcon,
    color: {
      bg: 'bg-emerald-50',
      icon: 'text-emerald-600',
    },
  },
  {
    id: 'opengraph',
    icon: OpenGraphIcon,
    color: {
      bg: 'bg-purple-50',
      icon: 'text-purple-600',
    },
  },
]

export default function DevelopmentProtocolsBrief({
  className,
}: DevelopmentProtocolsBriefProps) {
  const t = useTranslations('AboutPage')

  return (
    <div className={cn(className)}>
      {/* 标题 */}
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
          <span className="text-lg">🌐</span>
        </div>
        <h2 className="text-xl font-bold text-gray-900">
          {t('developmentProtocols')}
        </h2>
      </div>

      {/* 协议卡片网格 */}
      <div className="grid grid-cols-2 gap-3">
        {protocolsBrief.map((protocol) => {
          const Icon = protocol.icon
          const protocolName = t(
            `protocolsBrief.${protocol.id}` as 'protocolsBrief.wcag'
          )

          return (
            <div
              key={protocol.id}
              className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center gap-2 mb-2">
                <div
                  className={cn(
                    'flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center',
                    protocol.color.bg
                  )}
                >
                  <Icon className={cn('w-4 h-4', protocol.color.icon)} />
                </div>
                <h3 className="font-medium text-gray-900 text-sm truncate">
                  {protocolName}
                </h3>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
