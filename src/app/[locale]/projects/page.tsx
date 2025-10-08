'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { getGitHubRepositoriesWithRetry } from '@/actions/github'
import {
  filterProjects,
  sortProjects,
  categorizeProject,
} from '@/services'
import type {
  GitHubRepository,
  ProcessedRepository,
  ProjectFilters,
  ProjectSortOption,
  ProjectStats,
} from '@/types/github'
import { GITHUB_CONFIG } from '@/constants'
import { MOCK_PROJECTS, MOCK_STATS } from '@/mocks/github-projects'
import Image from 'next/image'

/**
 * Projects Page - 项目展示页面
 * 暂时不做复杂UI，主要关注数据交互和调试
 */
export default function ProjectsPage() {
  const t = useTranslations('Projects')
  
  // 状态管理
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [allProjects, setAllProjects] = useState<ProcessedRepository[]>([])
  const [filteredProjects, setFilteredProjects] = useState<ProcessedRepository[]>([])
  const [stats, setStats] = useState<ProjectStats | null>(null)
  
  // 筛选和排序状态
  const [filters, setFilters] = useState<ProjectFilters>({
    includeForked: false,
    includeArchived: false,
    searchText: '',
  })
  const [sortBy, setSortBy] = useState<ProjectSortOption>('weight')
  
  // 调试信息
  const [debugInfo, setDebugInfo] = useState({
    apiCalls: 0,
    loadTime: 0,
    cacheHit: false,
    dataSource: 'github',
  })

  /**
   * 获取GitHub数据（支持Mock模式）
   */
  const fetchGitHubData = useCallback(async () => {
    const startTime = Date.now()
    setLoading(true)
    setError(null)

    try {
      // 检查是否使用 Mock 数据
      const useMock = GITHUB_CONFIG?.useMockData ?? false

      if (useMock) {
        // 使用 Mock 数据（模拟异步延迟）
        await new Promise(resolve => setTimeout(resolve, 500))
        
        console.log('📦 项目列表 (Mock):', MOCK_PROJECTS)

        // 更新状态
        setAllProjects(MOCK_PROJECTS)
        setFilteredProjects(MOCK_PROJECTS)
        setStats(MOCK_STATS)

        // 更新调试信息
        const endTime = Date.now()
        setDebugInfo({
          apiCalls: 0,
          loadTime: endTime - startTime,
          cacheHit: false,
          dataSource: 'mock-data',
        })

      } else {
        // 调用真实 API
        const fetchOptions = GITHUB_CONFIG?.fetchOptions || {}
        
        const result = await getGitHubRepositoriesWithRetry({
          username: GITHUB_CONFIG?.username,
          repoType: (fetchOptions.repoType as 'all' | 'owner' | 'member' | 'public') || 'owner',
          includeForked: fetchOptions.includeForked,
          includeArchived: fetchOptions.includeArchived,
          minStars: fetchOptions.minStars,
          maxProjects: fetchOptions.maxProjects,
          maxPages: fetchOptions.maxPages,
          includeLanguages: fetchOptions.includeLanguages,
          includeContributors: fetchOptions.includeContributors,
        })

        // 检查是否成功
        if (!result.success || !result.data) {
          throw new Error(result.error || '加载失败')
        }

        console.log('📦 项目列表:', result.data.projects)

        // 更新状态
        setAllProjects(result.data.projects)
        setFilteredProjects(result.data.projects)
        setStats(result.data.stats)

        // 更新调试信息
        const endTime = Date.now()
        setDebugInfo({
          apiCalls: 1,
          loadTime: endTime - startTime,
          cacheHit: false,
          dataSource: 'server-actions',
        })

        // 检查速率限制
        if (result.data.rateLimit) {
          console.log('🔥 GitHub API速率限制:', result.data.rateLimit)
          if (result.data.rateLimit.remaining < 100) {
            console.warn('⚠️ GitHub API调用次数不足100次!')
          }
        }
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '加载失败'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * 应用筛选和排序
   */
  useEffect(() => {
    if (allProjects.length === 0) return

    let result = filterProjects(allProjects, filters)
    result = sortProjects(result, sortBy, 'desc')

    setFilteredProjects(result)
  }, [allProjects, filters, sortBy])

  /**
   * 初始化加载
   */
  useEffect(() => {
    fetchGitHubData()
  }, [fetchGitHubData])

  /**
   * 渲染加载状态
   */
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-4">{t('title')}</h1>
        <div className="p-8 bg-blue-50 rounded-lg">
          <p className="text-xl">{t('loadingProjects')}</p>
          <p className="text-sm text-gray-600 mt-2">请查看浏览器Console查看详细加载过程...</p>
        </div>
      </div>
    )
  }

  /**
   * 渲染错误状态
   */
  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-4">{t('title')}</h1>
        <div className="p-8 bg-red-50 rounded-lg">
          <h2 className="text-2xl font-bold text-red-600 mb-2">{t('error')}</h2>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={fetchGitHubData}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            {t('retry')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* 页面标题 */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">{t('title')}</h1>
        <p className="text-xl text-gray-600">{t('description')}</p>
      </div>

      {/* 统计信息 */}
      {stats && (
        <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">📊 统计概览</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-white p-4 rounded shadow">
              <div className="text-3xl font-bold text-blue-600">{stats.totalProjects}</div>
              <div className="text-sm text-gray-600">{t('stats.totalProjects')}</div>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <div className="text-3xl font-bold text-yellow-600">{stats.totalStars}</div>
              <div className="text-sm text-gray-600">{t('stats.totalStars')}</div>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <div className="text-3xl font-bold text-green-600">{stats.totalForks}</div>
              <div className="text-sm text-gray-600">{t('stats.totalForks')}</div>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <div className="text-3xl font-bold text-purple-600">{stats.activeProjects}</div>
              <div className="text-sm text-gray-600">{t('stats.activeProjects')}</div>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <div className="text-3xl font-bold text-gray-600">{stats.archivedProjects}</div>
              <div className="text-sm text-gray-600">{t('stats.archivedProjects')}</div>
            </div>
          </div>
        </div>
      )}

      {/* 筛选控制 */}
      <div className="mb-8 p-6 bg-gray-50 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">🔍 {t('filters.title')}</h2>
        
        {/* 搜索框 */}
        <div className="mb-4">
          <input
            type="text"
            placeholder={t('filters.search')}
            value={filters.searchText || ''}
            onChange={(e) => setFilters({ ...filters, searchText: e.target.value })}
            className="w-full px-4 py-2 border rounded"
          />
        </div>

        {/* 复选框 */}
        <div className="flex gap-4 mb-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={filters.includeForked}
              onChange={(e) => setFilters({ ...filters, includeForked: e.target.checked })}
            />
            <span>{t('filters.includeForked')}</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={filters.includeArchived}
              onChange={(e) => setFilters({ ...filters, includeArchived: e.target.checked })}
            />
            <span>{t('filters.includeArchived')}</span>
          </label>
        </div>

        {/* 排序选择 */}
        <div>
          <label className="block mb-2 font-semibold">{t('filters.sort')}:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as ProjectSortOption)}
            className="px-4 py-2 border rounded"
          >
            <option value="weight">{t('filters.sortBy.weight')}</option>
            <option value="stars">{t('filters.sortBy.stars')}</option>
            <option value="updated">{t('filters.sortBy.updated')}</option>
            <option value="created">{t('filters.sortBy.created')}</option>
            <option value="name">{t('filters.sortBy.name')}</option>
          </select>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          显示 {filteredProjects.length} / {allProjects.length} 个项目
        </div>
      </div>

      {/* 项目列表（简单展示，仅用于调试） */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">📦 项目列表</h2>
        {filteredProjects.map((project) => {
          const category = categorizeProject({
            archived: project.isArchived,
            fork: project.isFork,
            updated_at: project.updatedAt.toISOString(),
            name: project.name,
            description: project.description,
          } as GitHubRepository)

          return (
            <div key={project.id} className="p-6 bg-white border rounded-lg shadow-sm">
              {/* 项目标题和基本信息 */}
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold">
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {project.name}
                  </a>
                </h3>
                <span className="px-2 py-1 text-xs bg-gray-100 rounded">
                  {category}
                </span>
              </div>

              {/* 描述 */}
              <p className="text-gray-600 mb-3">{project.description}</p>

              {/* 统计信息 */}
              <div className="flex gap-4 text-sm text-gray-600 mb-3">
                <span>⭐ {project.stars}</span>
                <span>🔀 {project.forks}</span>
                <span>👀 {project.watchers}</span>
                {project.primaryLanguage && (
                  <span>💻 {project.primaryLanguage}</span>
                )}
              </div>

              {/* 语言占比（如果有） */}
              {project.languages && project.languages.length > 0 && (
                <div className="mb-3">
                  <h4 className="text-sm font-semibold mb-2">💻 语言占比:</h4>
                  <div className="space-y-2">
                    {project.languages.map(lang => (
                      <div key={lang.name}>
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>{lang.name}</span>
                          <span>{lang.percentage.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="h-1.5 rounded-full transition-all"
                            style={{ 
                              width: `${lang.percentage}%`,
                              backgroundColor: lang.color 
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 贡献者（如果有） */}
              {project.contributors && project.contributors.length > 0 && (
                <div className="mb-3">
                  <h4 className="text-sm font-semibold mb-2">👥 贡献者 ({project.contributors.length}):</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.contributors.slice(0, 10).map(contributor => (
                      <a
                        key={contributor.login}
                        href={contributor.profileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative"
                        title={`${contributor.login} (${contributor.percentage.toFixed(1)}%)`}
                      >
                        <Image
                          src={contributor.avatarUrl}
                          alt={contributor.login}
                          width={32}
                          height={32}
                          className="w-8 h-8 rounded-full border-2 border-white hover:border-blue-500 transition-colors"
                        />
                      </a>
                    ))}
                    {project.contributors.length > 10 && (
                      <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs text-gray-600">
                        +{project.contributors.length - 10}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Topics */}
              {project.topics.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {project.topics.map((topic) => (
                    <span key={topic} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                      {topic}
                    </span>
                  ))}
                </div>
              )}

              {/* 时间信息 */}
              <div className="text-xs text-gray-500">
                创建于: {project.createdAt.toLocaleDateString()} | 
                更新于: {project.updatedAt.toLocaleDateString()} | 
                活跃度评分: {project.activityScore?.toFixed(1)} | 
                展示权重: {project.displayWeight?.toFixed(1)}
              </div>
            </div>
          )
        })}
      </div>

      {/* 调试信息 */}
      <div className="mt-8 p-6 bg-gray-900 text-white rounded-lg">
        <h2 className="text-2xl font-bold mb-4">🐛 {t('debug.title')}</h2>
        <div className="grid grid-cols-2 gap-4 font-mono text-sm">
          <div>
            <span className="text-gray-400">{t('debug.apiCalls')}:</span> {debugInfo.apiCalls}
          </div>
          <div>
            <span className="text-gray-400">{t('debug.loadTime')}:</span> {debugInfo.loadTime}ms
          </div>
          <div>
            <span className="text-gray-400">{t('debug.cacheHit')}:</span> {debugInfo.cacheHit ? '✅' : '❌'}
          </div>
          <div>
            <span className="text-gray-400">{t('debug.dataSource')}:</span> {debugInfo.dataSource}
          </div>
        </div>
        
        {/* 速率限制信息 */}
        {stats && (
          <div className="mt-4 p-4 bg-gray-800 rounded">
            <h3 className="font-bold mb-2">数据来源信息</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>数据源: Server Actions</div>
              <div>架构: 服务端执行</div>
              <div>调用方式: actions/github.ts</div>
              <div>缓存: React cache + 自动重复删除</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

