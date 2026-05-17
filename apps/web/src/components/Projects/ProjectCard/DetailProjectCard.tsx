'use client'

import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/utils'
import { Tab } from '@/ui'
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
  Cell
} from 'recharts'
import type { PieLabelRenderProps } from 'recharts'
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

/**
 * 项目详细卡片
 * 展示项目的全部内容
 */
export function DetailProjectCard({ project, category }: DetailProjectCardProps) {
  const t = useTranslations('Projects')
  
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
    switch (cat) {
      case 'featured':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'stable':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'completed':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'archived':
        return 'bg-gray-100 text-gray-600 border-gray-200'
      case 'fork':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'learning':
        return 'bg-pink-100 text-pink-800 border-pink-200'
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200'
    }
  }

  return (
    <div className="space-y-6">
      {/* 项目头部 */}
      <div className="space-y-3">
        <div className="flex items-start sm:items-center gap-2 sm:gap-3">
          <ProjectIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 shrink-0 mt-1 sm:mt-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-start sm:items-center gap-2 flex-wrap mb-2">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 leading-6 wrap-break-word">
                {project.name}
              </h2>
              {/* 置顶标签 */}
              {project.isPinned && (
                <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm font-medium bg-linear-to-r from-yellow-100 to-amber-100 text-amber-700 border border-amber-200 rounded-full whitespace-nowrap">
                  <StarFilledIcon className="w-3 h-3 sm:w-4 sm:h-4 text-amber-500" />
                  {t('project.pinned')}
                </span>
              )}
              {/* 分类标签紧邻标题 */}
              {category && (
                <span className={cn(
                  'px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm font-medium rounded-lg border whitespace-nowrap flex items-center gap-1 sm:gap-1.5',
                  getCategoryStyle(category)
                )}>
                  {category === 'fork' && <ForkIcon className="w-3 h-3 sm:w-4 sm:h-4" />}
                  {t(`filters.categories.${category}`)}
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-gray-500 break-all">{project.fullName}</p>
          </div>
        </div>

        {/* 项目描述 */}
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
          {project.description || t('project.noDescription')}
        </p>
      </div>

      {/* 项目链接 */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <Link
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          <GitHubIcon className="w-4 h-4" />
          <span className="text-sm font-medium">{t('project.viewOnGitHub')}</span>
        </Link>
        
        {project.homepage && (
          <Link
            href={project.homepage}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <span className="text-sm font-medium">{t('project.homepage')}</span>
          </Link>
        )}
      </div>

      {/* 项目统计 - 移动端2列，桌面端4列 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-linear-to-br from-yellow-50 to-white rounded-lg border border-yellow-100">
          <StarIcon className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 shrink-0" />
          <div className="min-w-0">
            <div className="text-xs text-gray-500 truncate">{t('project.stars')}</div>
            <div className="text-base sm:text-lg font-bold text-gray-900">{project.stars}</div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-linear-to-br from-blue-50 to-white rounded-lg border border-blue-100">
          <ForkIcon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 shrink-0" />
          <div className="min-w-0">
            <div className="text-xs text-gray-500 truncate">{t('project.forks')}</div>
            <div className="text-base sm:text-lg font-bold text-gray-900">{project.forks}</div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-linear-to-br from-green-50 to-white rounded-lg border border-green-100">
          <WatchersIcon className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 shrink-0" />
          <div className="min-w-0">
            <div className="text-xs text-gray-500 truncate">{t('project.watchers')}</div>
            <div className="text-base sm:text-lg font-bold text-gray-900">{project.watchers}</div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-linear-to-br from-red-50 to-white rounded-lg border border-red-100">
          <IssuesIcon className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 shrink-0" />
          <div className="min-w-0">
            <div className="text-xs text-gray-500 truncate">{t('project.openIssues')}</div>
            <div className="text-base sm:text-lg font-bold text-gray-900">{project.openIssues}</div>
          </div>
        </div>
      </div>

      {/* 活跃度和权重信息 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 p-3 sm:p-4 bg-linear-to-br from-purple-50 to-white rounded-lg border border-purple-100">
        {project.activityScore != null && (
          <div>
            <div className="text-xs text-gray-500 mb-1">{t('project.activityScore')}</div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-bold text-purple-600">
                {project.activityScore.toFixed(1)}
              </span>
              <span className="text-xs sm:text-sm text-gray-500">/ 100</span>
            </div>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-600 h-2 rounded-full transition-all"
                style={{ width: `${Math.min(project.activityScore, 100)}%` }}
              />
            </div>
          </div>
        )}
        
        {project.displayWeight != null && (
          <div>
            <div className="text-xs text-gray-500 mb-1">{t('project.displayWeight')}</div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-bold text-indigo-600">
                {project.displayWeight.toFixed(1)}
              </span>
            </div>
            <div className="mt-2 text-xs text-gray-600">
              {t('project.comprehensiveScore')}
            </div>
          </div>
        )}
      </div>

      {/* 语言占比 */}
      {project.languageStats && project.languageStats.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <LanguageIcon className="w-5 h-5 text-gray-600 shrink-0" />
            <h3 className="text-sm font-semibold text-gray-900 leading-5">
              {t('project.languages')}
            </h3>
          </div>
          
          <Tab
            items={[
              {
                key: 'chart',
                label: t('project.chart'),
                children: (
                  <div className="space-y-4">
                    {/* 图例 */}
                    <div className="flex items-center gap-4 sm:gap-6 text-xs text-gray-600 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className="w-4 h-3 rounded" style={{ backgroundColor: 'rgba(59, 130, 246, 0.7)' }}></span>
                        <span>{t('project.percentage')} (%)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-4 h-0.5 bg-red-500"></span>
                        <span>{t('project.bytes')} (bytes)</span>
                      </div>
                    </div>
              
                    {/* 图表容器 - 移动端横向滚动 */}
                    <div className="w-full overflow-x-auto -mx-2 px-2">
                      {/* 设置最小宽度，确保在移动端可以横向滚动 */}
                      <div className="min-w-[600px] md:min-w-0">
                        <ResponsiveContainer width="100%" height={320}>
                          <ComposedChart
                            data={(project.languageStats || []).slice(0, 10).map((lang) => ({
                              name: lang.name,
                              percentage: parseFloat(lang.percentage.toFixed(2)),
                              bytes: lang.bytes,
                              color: lang.color || '#ccc'
                            }))}
                            margin={{ top: 20, right: 60, left: 20, bottom: 60 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis 
                              dataKey="name" 
                              angle={-45}
                              textAnchor="end"
                              height={80}
                              tick={{ fontSize: 12, fill: '#666' }}
                            />
                            {/* 左侧Y轴 - 百分比 */}
                            <YAxis 
                              yAxisId="left"
                              label={{ value: `${t('project.percentage')} (%)`, angle: -90, position: 'insideLeft', style: { fontSize: 12, fill: '#3b82f6' } }}
                              tick={{ fontSize: 12, fill: '#3b82f6' }}
                            />
                            {/* 右侧Y轴 - 字节数 */}
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
                            
                            {/* 柱状图 - 占比 */}
                            <Bar 
                              yAxisId="left"
                              dataKey="percentage" 
                              radius={[8, 8, 0, 0]}
                              opacity={0.7}
                            >
                              {(project.languageStats || []).slice(0, 10).map((lang, index) => (
                                <Cell key={`cell-${index}`} fill={lang.color || '#ccc'} />
                              ))}
                            </Bar>
                            
                            {/* 折线图 - 字节数 */}
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
              
                    {/* 移动端滚动提示 */}
                    <div className="md:hidden text-xs text-gray-500 text-center flex items-center justify-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                      </svg>
                      <span>左右滑动查看完整图表</span>
                    </div>
              
                    {/* 如果语言超过10个，显示剩余提示 */}
                    {project.languageStats && project.languageStats.length > 10 && (
                      <div className="text-xs text-gray-500 text-center">
                        {t('project.languagesMore', { count: project.languageStats.length - 10 })}
                      </div>
                    )}
                  </div>
                )
              },
              {
                key: 'list',
                label: t('project.list'),
                children: (
                  <div className="space-y-3">
                    {(project.languageStats || []).map((lang) => (
                      <div key={lang.name} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full shadow-sm"
                              style={{ backgroundColor: lang.color || '#ccc' }}
                            />
                            <span className="text-sm font-medium text-gray-700">{lang.name}</span>
                          </div>
                          <div className="flex items-center gap-3 text-sm">
                            <span className="text-gray-600">{lang.bytes.toLocaleString()} bytes</span>
                            <span className="font-semibold text-gray-900">{lang.percentage.toFixed(2)}%</span>
                          </div>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
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
                )
              }
            ]}
            defaultActiveKey="chart"
            type="card"
            size="small"
          />
        </div>
      )}

      {/* 贡献者 */}
      {project.contributors && project.contributors.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <ContributorIcon className="w-5 h-5 text-gray-600 shrink-0" />
            <h3 className="text-sm font-semibold text-gray-900 leading-5">
              {t('project.contributors')} ({project.contributors.length})
            </h3>
          </div>
          
          <Tab
            items={[
              {
                key: 'list',
                label: t('project.list'),
                children: (
                  <div className="space-y-3">
                    {project.contributors.map((contributor) => (
                      <Link
                        key={contributor.login}
                        href={contributor.profileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                      >
                        <Image
                          src={contributor.avatarUrl}
                          alt={contributor.login}
                          width={48}
                          height={48}
                          className="w-12 h-12 rounded-full border-2 border-white group-hover:border-blue-500 transition-all shadow-sm"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                            {contributor.login}
                          </div>
                          <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                            <span>{contributor.contributions} {t('project.commits')}</span>
                            <span>•</span>
                            <span>{(contributor.percentage || 0).toFixed(1)}%</span>
                          </div>
                        </div>
                        {/* 贡献占比进度条 */}
                        <div className="w-24">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full transition-all"
                              style={{ width: `${contributor.percentage || 0}%` }}
                            />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )
              },
              {
                key: 'chart',
                label: t('project.chart'),
                children: (
                  <div className="space-y-4">
                    {/* 图表容器 - 移动端也支持横向滚动 */}
                    <div className="w-full overflow-x-auto -mx-2 px-2">
                      <div className="min-w-[320px]">
                        <ResponsiveContainer width="100%" height={280}>
                          <PieChart>
                            <Pie
                              data={project.contributors.map(c => ({
                                name: c.login,
                                value: parseFloat((c.percentage || 0).toFixed(2)),
                                contributions: c.contributions
                              }))}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={(props: PieLabelRenderProps) => {
                                const value = Number(props.value ?? 0)
                                return value > 8 ? `${value.toFixed(1)}%` : ''
                              }}
                              outerRadius={100}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {project.contributors.map((contributor, index) => {
                                const baseColors = [
                                  '#3b82f6', '#2563eb', '#1d4ed8', '#1e40af', '#1e3a8a',
                                  '#60a5fa', '#93c5fd', '#1f2937', '#4b5563', '#6b7280'
                                ]
                                return (
                                  <Cell 
                                    key={`cell-${index}`} 
                                    fill={baseColors[index % baseColors.length]}
                                  />
                                )
                              })}
                            </Pie>
                            <Tooltip
                              contentStyle={{
                                backgroundColor: '#fff',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                                padding: '8px 12px'
                              }}
                              formatter={(value, _name, item) => {
                                const contributions = (item.payload as { contributions: number }).contributions
                                return [`${value}% (${contributions} ${t('project.commits')})`, t('project.contributionRatio')]
                              }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    
                    {/* 自定义图例 - 带头像，移动端优化 */}
                    <div className="flex flex-wrap gap-3 sm:gap-4 pt-2 justify-center">
                      {project.contributors.map((contributor, index) => {
                        const baseColors = [
                          '#3b82f6', '#2563eb', '#1d4ed8', '#1e40af', '#1e3a8a',
                          '#60a5fa', '#93c5fd', '#1f2937', '#4b5563', '#6b7280'
                        ]
                        const color = baseColors[index % baseColors.length]
                        
                        return (
                          <Link
                            key={contributor.login}
                            href={contributor.profileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 group"
                            title={`${contributor.login}: ${contributor.contributions} ${t('project.commits')} (${(contributor.percentage || 0).toFixed(1)}%)`}
                          >
                            {/* 颜色指示器 */}
                            <div 
                              className="w-2.5 h-2.5 rounded-full shrink-0"
                              style={{ backgroundColor: color }}
                            />
                            
                            {/* 头像 */}
                            <Image
                              src={contributor.avatarUrl}
                              alt={contributor.login}
                              width={32}
                              height={32}
                              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-white group-hover:border-blue-500 transition-all shadow-sm"
                            />
                            
                            {/* 名字 */}
                            <span className="text-xs sm:text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
                              {contributor.login}
                            </span>
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                )
              }
            ]}
            defaultActiveKey="list"
            type="card"
            size="small"
          />
        </div>
      )}

      {/* Topics 标签 */}
      {project.topics.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <TagIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 shrink-0" />
            <h3 className="text-sm font-semibold text-gray-900 leading-5">
              {t('project.topics')}
            </h3>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {project.topics.map((topic) => (
              <span
                key={topic}
                className="px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs font-medium bg-blue-50 text-blue-700 rounded-full border border-blue-100 hover:bg-blue-100 transition-colors"
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
