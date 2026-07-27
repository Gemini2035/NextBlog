'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/utils'
import { 
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Sector
} from 'recharts'
import type { SectorProps } from 'recharts'
import {
  ClockIcon, 
  ProjectIcon, 
  StarIcon, 
  ForkIcon,
  LanguageIcon,
  ContributorIcon,
  TagIcon,
  GitHubIcon,
  WatchersIcon,
  IssuesIcon,
  ArchiveIcon,
  StarFilledIcon
} from '@/assets/icons'
import type { ProjectDetail } from '@/types/api'
import type { ProjectCategory } from '@/types/projects'

interface DetailProjectCardProps {
  project: ProjectDetail
  category?: ProjectCategory
}

type DetailViewMode = 'chart' | 'list'
type ContributorHoverSource = 'pie' | 'legend'

interface ContributorPieDatum extends Record<string, unknown> {
  index: number
  name: string
  value: number
  contributions: number
}

const CONTRIBUTOR_PIE_START_ANGLE = 90
const CONTRIBUTOR_PIE_END_ANGLE = -270
const CONTRIBUTOR_COLORS = [
  '#3b82f6',
  '#2563eb',
  '#1d4ed8',
  '#1e40af',
  '#1e3a8a',
  '#60a5fa',
  '#93c5fd',
  '#1f2937',
  '#4b5563',
  '#6b7280',
]

const truncateContributorName = (name: string) => {
  return name.length > 16 ? `${name.slice(0, 15)}…` : name
}

const getContributorColor = (index: number) => CONTRIBUTOR_COLORS[index % CONTRIBUTOR_COLORS.length]

const renderActiveContributorShape = (props: SectorProps) => {
  const outerRadius = Number(props.outerRadius ?? 0)

  return <Sector {...props} outerRadius={outerRadius + 8} />
}

/**
 * 项目详细卡片
 * 展示项目的全部内容
 */
export function DetailProjectCard({ project, category }: DetailProjectCardProps) {
  const t = useTranslations('Projects')
  const [languageView, setLanguageView] = useState<DetailViewMode>('chart')
  const [contributorsView, setContributorsView] = useState<DetailViewMode>('list')
  const [activeContributorIndex, setActiveContributorIndex] = useState<number | null>(null)
  const [contributorHoverSource, setContributorHoverSource] = useState<ContributorHoverSource | null>(null)
  
  // 格式化日期
  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date))
  }

  // 获取分类样式
  const getCategoryStyle = (cat?: ProjectCategory) => {
    return cat === 'featured'
      ? 'bg-[var(--site-surface)] text-[var(--site-action)] border-[var(--site-action)]'
      : 'bg-[var(--site-surface)] text-[var(--site-text-muted)] border-[var(--site-border)]'
  }

  const languageStats = project.languageStats ?? []
  const chartLanguageStats = languageStats.slice(0, 10)
  const languageChartMinWidth = chartLanguageStats.length <= 1 ? 360 : chartLanguageStats.length * 112
  const languageBarSize = chartLanguageStats.length <= 1 ? 28 : 40
  const languageChartHeight = chartLanguageStats.length <= 1 ? 300 : 340
  const languageChartMargin = chartLanguageStats.length <= 1
    ? { top: 12, right: 52, left: 12, bottom: 42 }
    : { top: 20, right: 60, left: 20, bottom: 44 }
  const languageXAxisHeight = chartLanguageStats.length <= 1 ? 54 : 68
  const contributorPieData: ContributorPieDatum[] = (project.contributors ?? []).map((contributor, index) => ({
    index,
    name: contributor.login,
    value: parseFloat((contributor.percentage || 0).toFixed(2)),
    contributions: contributor.contributions
  }))
  const metricItems = [
    {
      label: t('project.stars'),
      value: project.stars,
      icon: <StarIcon className="w-5 h-5 text-[var(--site-text-muted)] shrink-0" />
    },
    {
      label: t('project.forks'),
      value: project.forks,
      icon: <ForkIcon className="w-5 h-5 text-[var(--site-text-muted)] shrink-0" />
    },
    {
      label: t('project.watchers'),
      value: project.watchers,
      icon: <WatchersIcon className="w-5 h-5 text-[var(--site-text-muted)] shrink-0" />
    },
    {
      label: t('project.openIssues'),
      value: project.openIssues,
      icon: <IssuesIcon className="w-5 h-5 text-[var(--site-text-muted)] shrink-0" />
    },
  ]

  const renderViewSwitcher = (
    activeView: DetailViewMode,
    onChange: (view: DetailViewMode) => void
  ) => (
    <div className="inline-flex rounded-[var(--site-radius-control)] border border-[var(--site-border)] bg-[var(--site-surface)] p-0.5">
      {(['chart', 'list'] as const).map((view) => (
        <button
          key={view}
          type="button"
          onClick={() => onChange(view)}
          className={cn(
            'min-w-14 cursor-pointer rounded-[calc(var(--site-radius-control)-2px)] px-3 py-1 text-xs font-medium transition-colors',
            activeView === view
              ? 'bg-[var(--site-canvas)] text-[var(--site-action)] shadow-[0_1px_2px_rgba(0,0,0,0.06)]'
              : 'text-[var(--site-text-muted)] hover:text-[var(--site-action)]'
          )}
        >
          {t(`project.${view}`)}
        </button>
      ))}
    </div>
  )

  const renderContributorLegend = () => (
    <div className="flex flex-wrap justify-center gap-2">
      {contributorPieData.map((contributor) => {
        const isActive = activeContributorIndex === contributor.index
        const hasActiveContributor = activeContributorIndex != null

        return (
          <button
            key={contributor.index}
            type="button"
            className={cn(
              'inline-flex max-w-52 items-center gap-2 rounded-[var(--site-radius-control)] border px-3 py-1.5 text-left transition-colors',
              'relative cursor-pointer',
              isActive
                ? 'border-[var(--site-action)] bg-[var(--site-surface)] text-[var(--site-action)]'
                : 'border-transparent text-[var(--site-text-muted)] hover:border-[var(--site-border)] hover:bg-[var(--site-surface)]',
              hasActiveContributor && !isActive && 'opacity-50'
            )}
            onMouseEnter={() => {
              setActiveContributorIndex(contributor.index)
              setContributorHoverSource('legend')
            }}
            onMouseLeave={() => {
              setActiveContributorIndex(null)
              setContributorHoverSource(null)
            }}
          >
            <span
              className="h-2.5 w-2.5 rounded-full shadow-[0_0_0_1px_rgba(255,255,255,0.8)]"
              style={{ backgroundColor: getContributorColor(contributor.index) }}
            />
            <span className="truncate text-sm font-medium">
              {truncateContributorName(contributor.name)}
            </span>
            {isActive && contributorHoverSource === 'legend' && (
              <span className="pointer-events-none absolute left-1/2 top-full z-20 mt-2 -translate-x-1/2 whitespace-nowrap rounded-[var(--site-radius-control)] border border-[var(--site-border)] bg-[var(--site-canvas)] px-2.5 py-1.5 text-xs font-medium text-[var(--site-text)] shadow-sm">
                {`${contributor.value.toFixed(1)}%`}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )

  const renderContributorPieCenterLabel = () => {
    return (
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="max-w-32 text-center">
          <div className="truncate text-xs font-medium text-[var(--site-text-muted)]">
            {t('project.contributors')}
          </div>
          <div className="mt-1 truncate text-lg font-semibold text-[var(--site-text)]">
            {project.contributors.length}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 项目头部 */}
      <div className="sticky top-0 z-30 -mx-4 space-y-3 border-b border-[var(--site-border)] bg-[var(--site-canvas)] px-4 pb-4 pt-3 sm:-mx-8 sm:px-8">
        <div className="flex items-start sm:items-center gap-2 sm:gap-3">
          <ProjectIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--site-text-muted)] shrink-0 mt-1 sm:mt-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-start sm:items-center gap-2 flex-wrap mb-2">
              <h2 className="text-xl sm:text-2xl font-semibold text-[var(--site-text)] leading-6 wrap-break-word">
                {project.name}
              </h2>
              {/* 置顶标签 */}
              {project.isPinned && (
                <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm font-normal bg-[var(--site-surface)] text-[var(--site-action)] border border-[var(--site-action)] rounded-[var(--site-radius-chip)] whitespace-nowrap">
                  <StarFilledIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                  {t('project.pinned')}
                </span>
              )}
              {/* 分类标签紧邻标题 */}
              {category && (
                <span className={cn(
                  'px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm font-normal rounded-[var(--site-radius-chip)] border whitespace-nowrap flex items-center gap-1 sm:gap-1.5',
                  getCategoryStyle(category)
                )}>
                  {category === 'fork' && <ForkIcon className="w-3 h-3 sm:w-4 sm:h-4" />}
                  {t(`filters.categories.${category}`)}
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-[var(--site-text-tertiary)] break-all">{project.fullName}</p>
          </div>
        </div>

        {/* 项目描述 */}
        <p className="text-sm sm:text-base text-[var(--site-text-muted)] leading-relaxed">
          {project.description || t('project.noDescription')}
        </p>
      </div>

      {/* 项目链接 */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <Link
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-[var(--site-radius-control)] border border-[var(--site-text)] bg-[var(--site-text)] px-4 py-2 text-white transition-colors hover:bg-[var(--site-text)]"
        >
          <GitHubIcon className="w-4 h-4" />
          <span className="text-sm font-medium">{t('project.viewOnGitHub')}</span>
        </Link>
        
        {project.homepage && (
          <Link
            href={project.homepage}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-[var(--site-radius-control)] border border-[var(--site-action)] bg-[var(--site-action)] px-4 py-2 text-white transition-colors hover:bg-[var(--site-action)]"
          >
            <span className="text-sm font-medium">{t('project.homepage')}</span>
          </Link>
        )}
      </div>

      <div className="border-y border-[var(--site-border)]">
        <div className="grid grid-cols-2 divide-x-0 divide-y divide-[var(--site-border-subtle)] sm:grid-cols-4 sm:divide-x sm:divide-y-0">
          {metricItems.map((metric) => (
            <div key={metric.label} className="flex items-center gap-3 px-2 py-4 sm:px-4">
              {metric.icon}
              <div className="min-w-0">
                <div className="truncate text-xs text-[var(--site-text-tertiary)]">{metric.label}</div>
                <div className="text-xl font-semibold leading-7 text-[var(--site-text)]">{metric.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {(project.activityScore != null || project.displayWeight != null) && (
        <div className="grid grid-cols-1 gap-4 border-b border-[var(--site-border)] pb-5 sm:grid-cols-2 sm:gap-8">
          {project.activityScore != null && (
            <div>
              <div className="text-xs text-[var(--site-text-tertiary)] mb-1">{t('project.activityScore')}</div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-semibold text-[var(--site-action)]">
                  {project.activityScore.toFixed(1)}
                </span>
                <span className="text-sm text-[var(--site-text-tertiary)]">/ 100</span>
              </div>
              <div className="mt-3 h-2 w-full rounded-full bg-[var(--site-border)]">
                <div 
                  className="h-2 rounded-full bg-[var(--site-action)] transition-all"
                  style={{ width: `${Math.min(project.activityScore, 100)}%` }}
                />
              </div>
            </div>
          )}
          
          {project.displayWeight != null && (
            <div>
              <div className="text-xs text-[var(--site-text-tertiary)] mb-1">{t('project.displayWeight')}</div>
              <div className="text-2xl font-semibold text-[var(--site-action)]">
                {project.displayWeight.toFixed(1)}
              </div>
              <div className="mt-3 text-xs text-[var(--site-text-muted)]">
                {t('project.comprehensiveScore')}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 语言占比 */}
      {languageStats.length > 0 && (
        <section className="border-b">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <LanguageIcon className="w-5 h-5 text-[var(--site-text-muted)] shrink-0" />
              <h3 className="text-sm font-semibold text-[var(--site-text)] leading-5">
                {t('project.languages')}
              </h3>
            </div>
            {renderViewSwitcher(languageView, setLanguageView)}
          </div>
          
          {languageView === 'chart' ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4 sm:gap-6 text-xs text-[var(--site-text-muted)] flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-3 rounded" style={{ backgroundColor: 'rgba(59, 130, 246, 0.7)' }}></span>
                  <span>{t('project.percentage')} (%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-0.5 bg-red-500"></span>
                  <span>{t('project.bytes')} (bytes)</span>
                </div>
              </div>
        
              <div className="w-full overflow-x-auto">
                <div className="w-full" style={{ minWidth: `${languageChartMinWidth}px` }}>
                  <ResponsiveContainer width="100%" height={languageChartHeight}>
                    <ComposedChart
                      data={chartLanguageStats.map((lang) => ({
                        name: lang.name,
                        percentage: parseFloat(lang.percentage.toFixed(2)),
                        bytes: lang.bytes,
                        color: lang.color || '#ccc'
                      }))}
                      margin={languageChartMargin}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="name" 
                        angle={-45}
                        textAnchor="end"
                        height={languageXAxisHeight}
                        tick={{ fontSize: 12, fill: '#666' }}
                      />
                      <YAxis 
                        yAxisId="left"
                        label={{ value: `${t('project.percentage')} (%)`, angle: -90, position: 'insideLeft', style: { fontSize: 12, fill: '#3b82f6' } }}
                        tick={{ fontSize: 12, fill: '#3b82f6' }}
                      />
                      <YAxis 
                        yAxisId="right"
                        orientation="right"
                        label={{ value: `${t('project.bytes')} (bytes)`, angle: 90, position: 'insideRight', style: { fontSize: 12, fill: '#ef4444' } }}
                        tick={{ fontSize: 12, fill: '#ef4444' }}
                        tickFormatter={(value: number) => {
                          if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
                          if (value >= 1000) return `${(value / 1000).toFixed(1)}K`
                          return value.toString()
                        }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#fff',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          padding: '12px'
                        }}
                        formatter={(value, name) => {
                          if (name === 'percentage') {
                            return [`${value ?? 0}%`, t('project.percentage')]
                          }
                          if (name === 'bytes') {
                            const bytes = typeof value === 'number' ? value : Number(value ?? 0)
                            return [`${bytes.toLocaleString()} bytes`, t('project.bytes')]
                          }
                          return [value ?? '', name ?? '']
                        }}
                        labelStyle={{ fontWeight: 'bold', marginBottom: '8px', color: '#1f2937' }}
                      />
                      <Bar 
                        yAxisId="left"
                        dataKey="percentage" 
                        barSize={languageBarSize}
                        radius={[8, 8, 0, 0]}
                        opacity={0.7}
                      >
                        {chartLanguageStats.map((lang, index) => (
                          <Cell key={`cell-${index}`} fill={lang.color || '#ccc'} />
                        ))}
                      </Bar>
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="bytes"
                        stroke="#ef4444"
                        strokeWidth={2}
                        dot={{ fill: '#ef4444', r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>
        
              <div className="md:hidden text-xs text-[var(--site-text-tertiary)] text-center flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
                <span>左右滑动查看完整图表</span>
              </div>
        
              {languageStats.length > 10 && (
                <div className="text-xs text-[var(--site-text-tertiary)] text-center">
                  {t('project.languagesMore', { count: languageStats.length - 10 })}
                </div>
              )}
            </div>
          ) : (
            <div className="divide-y divide-[var(--site-border-subtle)]">
              {languageStats.map((lang) => (
                <div key={lang.name} className="py-3">
                  <div className="grid grid-cols-1 items-center gap-2 sm:grid-cols-[minmax(10rem,1fr)_9rem_5rem]">
                    <div className="flex min-w-0 items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full shadow-sm"
                        style={{ backgroundColor: lang.color || '#ccc' }}
                      />
                      <span className="truncate text-sm font-medium text-[var(--site-text)]">{lang.name}</span>
                    </div>
                    <span className="text-sm text-[var(--site-text-muted)] sm:text-right">{lang.bytes.toLocaleString()} bytes</span>
                    <span className="text-sm font-semibold text-[var(--site-text)] sm:text-right">{lang.percentage.toFixed(2)}%</span>
                  </div>
                  <div className="mt-3 h-2 w-full max-w-72 rounded-full bg-[var(--site-border)] sm:max-w-80">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{
                        width: `${lang.percentage}%`,
                        backgroundColor: lang.color || '#ccc'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* 贡献者 */}
      {project.contributors && project.contributors.length > 0 && (
        <section className="space-y-4 border-b border-[var(--site-border)] pb-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <ContributorIcon className="w-5 h-5 text-[var(--site-text-muted)] shrink-0" />
              <h3 className="text-sm font-semibold text-[var(--site-text)] leading-5">
                {t('project.contributors')} ({project.contributors.length})
              </h3>
            </div>
            {renderViewSwitcher(contributorsView, setContributorsView)}
          </div>
          
          {contributorsView === 'list' ? (
            <div className="divide-y divide-[var(--site-border-subtle)]">
              {project.contributors.map((contributor) => (
                <Link
                  key={contributor.login}
                  href={contributor.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group grid grid-cols-[auto_minmax(0,1fr)] gap-3 py-3 sm:grid-cols-[auto_minmax(0,1fr)_7rem] sm:items-center"
                >
                  <Image
                    src={contributor.avatarUrl}
                    alt={contributor.login}
                    width={48}
                    height={48}
                    className="w-11 h-11 rounded-full border border-[var(--site-border)] transition-colors group-hover:border-[var(--site-action)]"
                  />
                  <div className="min-w-0">
                    <div className="font-medium text-[var(--site-text)] transition-colors group-hover:text-[var(--site-action)]">
                      {contributor.login}
                    </div>
                    <div className="mt-1 flex items-center gap-3 text-sm text-[var(--site-text-muted)]">
                      <span>{contributor.contributions} {t('project.commits')}</span>
                      <span>•</span>
                      <span>{(contributor.percentage || 0).toFixed(1)}%</span>
                    </div>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <div className="h-2 w-full rounded-full bg-[var(--site-border)]">
                      <div
                        className="h-2 rounded-full bg-[var(--site-action)] transition-all"
                        style={{ width: `${contributor.percentage || 0}%` }}
                      />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="mx-auto w-full max-w-72">
                <div className="relative h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        className="[&_.recharts-pie-sector_path]:cursor-pointer [&_.recharts-pie-sector_path]:[transform-box:fill-box] [&_.recharts-pie-sector_path]:origin-center [&_.recharts-pie-sector_path]:transition-transform [&_.recharts-pie-sector_path]:duration-200 [&_.recharts-pie-sector:hover_path]:scale-[1.06]"
                        data={contributorPieData}
                        cx="50%"
                        cy="50%"
                        startAngle={CONTRIBUTOR_PIE_START_ANGLE}
                        endAngle={CONTRIBUTOR_PIE_END_ANGLE}
                        labelLine={false}
                        label={false}
                        activeShape={renderActiveContributorShape}
                        outerRadius={(datum) => datum.index === activeContributorIndex ? 94 : 86}
                        innerRadius={54}
                        fill="#8884d8"
                        dataKey="value"
                        onMouseEnter={(_, index) => {
                          setActiveContributorIndex(index)
                          setContributorHoverSource('pie')
                        }}
                        onMouseLeave={() => {
                          setActiveContributorIndex(null)
                          setContributorHoverSource(null)
                        }}
                      >
                        {project.contributors.map((contributor, index) => (
                          <Cell
                            key={`cell-${contributor.login}`}
                            fill={getContributorColor(index)}
                            opacity={activeContributorIndex == null || activeContributorIndex === index ? 1 : 0.42}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#fff',
                          border: '1px solid var(--site-border)',
                          borderRadius: 'var(--site-radius-control)',
                          padding: '8px 12px'
                        }}
                        formatter={(value) => {
                          const percentage = typeof value === 'number' ? value : Number(value ?? 0)
                          return [`${percentage.toFixed(1)}%`, t('project.contributionRatio')]
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  {renderContributorPieCenterLabel()}
                </div>
              </div>
              {renderContributorLegend()}
            </div>
          )}
        </section>
      )}

      {/* Topics 标签 */}
      {project.topics.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <TagIcon className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--site-text-muted)] shrink-0" />
            <h3 className="text-sm font-semibold text-[var(--site-text)] leading-5">
              {t('project.topics')}
            </h3>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {project.topics.map((topic) => (
              <span
                key={topic}
                className="px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs font-normal bg-[var(--site-surface)] text-[var(--site-text-muted)] rounded-[var(--site-radius-chip)] border border-[var(--site-border)] hover:border-[var(--site-action)] hover:text-[var(--site-action)] transition-colors"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 许可证 */}
      {project.license && (
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium text-gray-600">{t('project.license')}:</span>
          <span className="px-3 py-1 bg-green-50 text-green-700 rounded-lg border border-green-100 font-medium">
            {project.license}
          </span>
        </div>
      )}

      {/* 时间信息 */}
      <div className="pt-3 sm:pt-4 border-t border-gray-200">
        <div className="space-y-2">
          {/* 第一行：创建时间和更新时间 */}
          <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
              <ClockIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span className="font-medium">{t('project.created')}:</span>
              <span className="truncate">{formatDate(project.createdAt)}</span>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
              <ClockIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span className="font-medium">{t('project.updated')}:</span>
              <span className="truncate">{formatDate(project.updatedAt)}</span>
            </div>
          </div>
          {/* 第二行：推送时间 */}
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
            <ClockIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="font-medium">{t('project.lastPush')}:</span>
            <span className="truncate">{formatDate(project.pushedAt)}</span>
          </div>
        </div>
      </div>

      {/* 状态标识 */}
      {(project.isArchived || project.isFork) && (
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          {project.isArchived && (
            <span className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium flex items-center gap-2">
              <ArchiveIcon className="w-4 h-4" />
              {t('project.archived')}
            </span>
          )}
          {project.isFork && (
            <span className="px-3 py-1.5 bg-orange-100 text-orange-700 rounded-lg text-sm font-medium flex items-center gap-2">
              <ForkIcon className="w-4 h-4" />
              {t('project.forked')}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
