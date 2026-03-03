'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import { useGitHubRepositories } from '@/hooks'
import { categorizeProject } from '@/server/github/transformers/stats'
import type { ProcessedRepository } from '@/types/github'
import { GITHUB_CONFIG } from '@/constants'
import { MOCK_PROJECTS, MOCK_STATS } from '@/mocks/github-projects'
import { toast } from '@/ui'
import { 
  StatsOverview, 
  BriefProjectCard, 
  DetailProjectCard,
  ProjectFilter 
} from '@/components/Projects'
import { ExpandableWaterfall } from '@/components/Waterfall'
import { Loading } from '@/ui'

/**
 * Projects Page - 项目展示页面
 * 使用 SWR 进行数据获取和缓存管理
 */
export default function ProjectsPage() {
  const t = useTranslations('Projects')
  const searchParams = useSearchParams()
  
  // 检查是否使用 Mock 数据
  const useMock = GITHUB_CONFIG?.useMockData ?? false
  
  // 使用 SWR Hook 获取 GitHub 数据（支持缓存）
  const fetchOptions = GITHUB_CONFIG?.fetchOptions || {}
  const {
    projects: allProjects,
    stats,
    isLoading,
    isError,
    error: fetchError,
  } = useGitHubRepositories(
    useMock
      ? {} // Mock 模式不调用 API
      : {
          username: GITHUB_CONFIG?.username,
          repoType: (fetchOptions.repoType as 'all' | 'owner' | 'member' | 'public') || 'owner',
          includeForked: fetchOptions.includeForked,
          includeArchived: fetchOptions.includeArchived,
          minStars: fetchOptions.minStars,
          maxProjects: fetchOptions.maxProjects,
          maxPages: fetchOptions.maxPages,
          featuredRepos: GITHUB_CONFIG?.featuredRepos || [],
        },
    {
      // SWR 配置
      revalidateOnFocus: false, // 窗口获得焦点时不重新验证
      dedupingInterval: 60000, // 60秒内不重复请求
    }
  )

  // Mock 数据覆盖（如果启用 Mock 模式）
  const finalProjects = useMock ? MOCK_PROJECTS : allProjects
  const finalStats = useMock ? MOCK_STATS : stats
  const loading = useMock ? false : isLoading
  const error = useMock ? null : (isError ? (fetchError || '加载失败') : null)
  
  // 筛选后的项目
  const [filteredProjects, setFilteredProjects] = useState<ProcessedRepository[]>(finalProjects)
  
  // 当数据加载完成后，更新筛选项目
  useEffect(() => {
    if (!loading && finalProjects.length > 0) {
      setFilteredProjects(finalProjects)
    }
  }, [finalProjects, loading])

  // 监听错误并显示Toast
  useEffect(() => {
    if (error && !useMock) {
      // 判断是否为速率限制错误
      if (error.includes('速率限制') || error.includes('rate limit')) {
        toast.error(error, 5000) // 显示5秒
      } else {
        toast.error(error, 3000) // 普通错误显示3秒
      }
    }
  }, [error, useMock])
  
  // 当有URL参数时，自动滚动到筛选器位置
  useEffect(() => {
    const hasParams = searchParams.toString().length > 0
    if (hasParams) {
      setTimeout(() => {
        const filterElement = document.getElementById('project-filter')
        if (filterElement) {
          const rect = filterElement.getBoundingClientRect()
          const scrollTop = window.scrollY + rect.top - 100 // 预留100px空间
          window.scrollTo({ top: Math.max(0, scrollTop), behavior: 'smooth' })
        }
      }, 300)
    }
  }, [searchParams])

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
      })

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

  return (
    <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 min-h-[calc(100vh-64px)]">
      {/* 页面标题 */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-4xl font-bold mb-2">{t('title')}</h1>
        <p className="text-base sm:text-xl text-gray-600">{t('description')}</p>
      </div>

      {/* 加载状态 */}
      {loading && (
        <Loading 
          fullscreen 
          size="lg"
          variant="spinner"
          text={t('loadingProjects')}
          showText
        />
      )}

      {/* 错误状态 - Toast已经显示，这里只显示简化版 */}
      {error && (
        <div className="p-8 bg-red-50 rounded-lg border border-red-200">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6 text-red-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-red-600 mb-1">{t('error')}</h2>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* 统计概览 */}
      {!loading && !error && finalStats && (
        <StatsOverview stats={finalStats} className="mb-6 sm:mb-8" />
      )}

      {/* 项目筛选器 */}
      {!loading && !error && (
        <div id="project-filter" className="mb-6 sm:mb-8">
          <ProjectFilter
            projects={finalProjects}
            onFilteredProjectsChange={handleFilteredProjectsChange}
          />
        </div>
      )}

      {/* 项目瀑布流 - 移动端单列，桌面端双列 */}
      {!loading && !error && (
        waterfallItems.length > 0 ? (
          <>
            {/* 移动端：单列布局 */}
            <div className="block md:hidden">
              <ExpandableWaterfall 
                items={waterfallItems}
                columns={1}
                gap={16}
              />
            </div>
            {/* 桌面端：双列布局 */}
            <div className="hidden md:block">
              <ExpandableWaterfall 
                items={waterfallItems}
                columns={2}
                gap={24}
              />
            </div>
          </>
        ) : (
          <div className="py-12 text-center">
            <p className="text-gray-500 text-base sm:text-lg">{t('empty.description')}</p>
          </div>
        )
      )}
    </div>
  )
}



