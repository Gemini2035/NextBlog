'use client'

import { useTranslations } from 'next-intl'
import type { ProjectStats } from '@/types/github'
import { ProjectIcon, StarIcon, ForkIcon, LanguageIcon, type IconProps } from '@/assets/icons'
import { cn } from '@/utils'

interface StatsOverviewProps {
  stats: ProjectStats
  className?: string
}

/**
 * 项目统计概览组件
 * 分为"我创建的"和"我参与的"两个部分
 */
export function StatsOverview({ stats, className }: StatsOverviewProps) {
  const t = useTranslations('Projects.statsOverview')

  // 统计项组件
  const StatItem = ({
    icon: Icon,
    label,
    value,
    className: itemClassName,
  }: {
    icon: React.ComponentType<IconProps>
    label: string
    value: number
    className?: string
  }) => (
    <div className={cn('flex items-center gap-3', itemClassName)}>
      <div className="shrink-0">
        <Icon className="w-6 h-6" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm text-gray-600">{label}</div>
        <div className="text-2xl font-bold text-blue-600">{value}</div>
      </div>
    </div>
  )

  return (
    <div className={cn('space-y-6', className)}>
      <h2 className="text-2xl font-bold text-gray-900">{t('title')}</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 我创建的 */}
        {stats.ownedStats && (
          <div className="bg-linear-to-br from-blue-50 to-white rounded-xl p-6 border-2 border-blue-100 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <ProjectIcon className="w-5 h-5" />
              {t('myProjects')}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <StatItem
                icon={ProjectIcon}
                label={t('projectCount')}
                value={stats.ownedStats.count}
              />
              <StatItem
                icon={StarIcon}
                label={t('totalStars')}
                value={stats.ownedStats.stars}
              />
              <StatItem
                icon={ForkIcon}
                label={t('totalForks')}
                value={stats.ownedStats.forks}
              />
              <StatItem
                icon={LanguageIcon}
                label={t('languages')}
                value={stats.ownedStats.languages}
              />
            </div>
          </div>
        )}

        {/* 我参与的 */}
        {stats.contributedStats && (
          <div className="bg-linear-to-br from-blue-50 to-white rounded-xl p-6 border-2 border-blue-100 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <ProjectIcon className="w-5 h-5" />
              {t('contributedProjects')}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <StatItem
                icon={ProjectIcon}
                label={t('projectCount')}
                value={stats.contributedStats.count}
              />
              <StatItem
                icon={StarIcon}
                label={t('totalStars')}
                value={stats.contributedStats.stars}
              />
              <StatItem
                icon={ForkIcon}
                label={t('totalForks')}
                value={stats.contributedStats.forks}
              />
              <StatItem
                icon={LanguageIcon}
                label={t('languages')}
                value={stats.contributedStats.languages}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

