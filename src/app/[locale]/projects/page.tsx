'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { getGitHubRepositoriesWithRetry } from '@/actions/github'
import {
  categorizeProject,
} from '@/services'
import type {
  GitHubRepository,
  ProcessedRepository,
  ProjectStats,
} from '@/types/github'
import { GITHUB_CONFIG } from '@/constants'
import { MOCK_PROJECTS, MOCK_STATS } from '@/mocks/github-projects'
import { 
  StatsOverview, 
  BriefProjectCard, 
  DetailProjectCard,
  ProjectFilter 
} from '@/components/Projects'
import { ExpandableWaterfall } from '@/components/Waterfall'

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

  /**
   * 获取GitHub数据（支持Mock模式）
   */
  const fetchGitHubData = useCallback(async () => {
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
          featuredRepos: GITHUB_CONFIG?.featuredRepos || [],
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
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '加载失败'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * 筛选器变化回调
   */
  const handleFilteredProjectsChange = useCallback((projects: ProcessedRepository[]) => {
    setFilteredProjects(projects)
  }, [])

  /**
   * 将项目转换为Waterfall项目
   */
  const waterfallItems = useMemo(() => {
    return filteredProjects.map((project) => {
      const category = categorizeProject({
        archived: project.isArchived,
        fork: project.isFork,
        updated_at: project.updatedAt.toISOString(),
        name: project.name,
        description: project.description,
      } as GitHubRepository)

      return {
        id: project.id.toString(),
        content: (
          <BriefProjectCard project={project} category={category} />
        ),
        expandedContent: (
          <DetailProjectCard project={project} category={category} />
        ),
        height: 'medium' as const,
        anchorId: `project-${project.id}`,
      }
    })
  }, [filteredProjects])

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

      {/* 统计概览 */}
      {stats && (
        <StatsOverview stats={stats} className="mb-8" />
      )}

      {/* 项目筛选器 */}
      <div className="mb-8">
        <ProjectFilter
          projects={allProjects}
          onFilteredProjectsChange={handleFilteredProjectsChange}
        />
      </div>

      {/* 项目瀑布流 */}
      {waterfallItems.length > 0 ? (
        <ExpandableWaterfall 
          items={waterfallItems}
          columns={2}
          gap={24}
        />
      ) : (
        <div className="py-12 text-center">
          <p className="text-gray-500 text-lg">{t('empty.description')}</p>
        </div>
      )}
    </div>
  )
}



