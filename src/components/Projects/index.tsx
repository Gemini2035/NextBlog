'use client'

import { useState, useCallback, useMemo, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import { useInfiniteScrollSentinel, useInitialSearchParamScroll, useLayoutHeights } from '@/hooks'
import { getProjects, type GetProjectsParams } from '@/apis/projects'
import { isStaleRequestError } from '@/apis/http'
import type { ProjectListItem, ProjectStats } from '@/types/api'
import { categorizeProject } from '@/types/projects'
import type { ProjectFilterState } from './ProjectFilter/types'
import { ExpandableWaterfall } from '@/components/Waterfall'
import { BriefProjectCard, ProjectDetailPanel } from './ProjectCard'
import { ProjectFilter } from './ProjectFilter'
import { StatsOverview } from './StatsOverview'
import { Button, Loading } from '@/ui'
import { smoothScrollToElement } from '@/utils'
import { ChevronUpIcon } from '@/assets/icons'

interface ProjectsClientProps {
  projects: ProjectListItem[]
  stats: ProjectStats | null
  total: number
  page: number
  pageSize: number
  totalPages: number
}

const getProjectSort = (filters: ProjectFilterState) => {
  if (filters.starSort) return `stars-${filters.starSort}`
  if (filters.forkSort) return `forks-${filters.forkSort}`
  if (filters.weightSort) return `weight-${filters.weightSort}`
  if (filters.createTimeSort) return `created-${filters.createTimeSort}`
  if (filters.updateTimeSort) return `updated-${filters.updateTimeSort}`
  if (filters.pushTimeSort) return `pushed-${filters.pushTimeSort}`
  return undefined
}

const getProjectParams = (
  filters: ProjectFilterState | null,
  page: number,
  pageSize: number,
): GetProjectsParams => ({
  keyword: filters?.keyword.trim() || undefined,
  pinned: filters?.showPinned ?? undefined,
  owned: filters?.showOwned ?? undefined,
  contributed: filters?.showContributed ?? undefined,
  fork: filters?.showFork ?? undefined,
  archived: filters?.showArchived ?? undefined,
  sort: filters ? getProjectSort(filters) : undefined,
  page,
  pageSize,
})

const getProjectApiKey = (filters: ProjectFilterState | null) =>
  JSON.stringify(getProjectParams(filters, 1, 1))

const getInitialProjectFilters = (
  searchParams: { get: (key: string) => string | null },
): ProjectFilterState => {
  const parseBoolParam = (value: string | null) => {
    if (value === 'true') return true
    if (value === 'false') return false
    return null
  }

  const filters: ProjectFilterState = {
    keyword: searchParams.get('keyword') ?? '',
    showPinned: parseBoolParam(searchParams.get('pinned')),
    showOwned: parseBoolParam(searchParams.get('owned')),
    showContributed: parseBoolParam(searchParams.get('contributed')),
    showFork: parseBoolParam(searchParams.get('fork')),
    showArchived: parseBoolParam(searchParams.get('archived')),
    starSort: null,
    forkSort: null,
    weightSort: null,
    createTimeSort: null,
    updateTimeSort: null,
    pushTimeSort: null,
  }

  const sort = searchParams.get('sort')
  if (sort) {
    const [sortKey, direction] = sort.split('-')
    const sortDir = (direction === 'asc' ? 'asc' : 'desc') as 'asc' | 'desc'

    switch (sortKey) {
      case 'stars':
        filters.starSort = sortDir
        break
      case 'forks':
        filters.forkSort = sortDir
        break
      case 'weight':
        filters.weightSort = sortDir
        break
      case 'created':
        filters.createTimeSort = sortDir
        break
      case 'updated':
        filters.updateTimeSort = sortDir
        break
      case 'pushed':
        filters.pushTimeSort = sortDir
        break
    }
  }

  return filters
}

const dedupeProjects = (projects: ProjectListItem[]) => {
  const seen = new Set<number>()
  return projects.filter((project) => {
    if (seen.has(project.id)) return false
    seen.add(project.id)
    return true
  })
}

const ignoreStaleRequest = (error: unknown) => {
  if (!isStaleRequestError(error)) {
    throw error
  }
}

export default function ProjectsClient({
  projects,
  stats,
  total: initialTotal,
  page: initialPage,
  pageSize,
  totalPages: initialTotalPages,
}: ProjectsClientProps) {
  const t = useTranslations('Projects')
  const searchParams = useSearchParams()
  const { headerHeight } = useLayoutHeights()
  const initialFilters = useMemo(
    () => getInitialProjectFilters(searchParams),
    [searchParams],
  )

  const [loadedProjects, setLoadedProjects] = useState<ProjectListItem[]>(projects)
  const [currentStats, setCurrentStats] = useState<ProjectStats | null>(stats)
  const [total, setTotal] = useState(initialTotal)
  const [page, setPage] = useState(initialPage)
  const [totalPages, setTotalPages] = useState(initialTotalPages)
  const [activeFilters, setActiveFilters] = useState<ProjectFilterState | null>(initialFilters)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [isResetting, setIsResetting] = useState(false)
  const apiKeyRef = useRef(getProjectApiKey(initialFilters))
  const filterRequestIdRef = useRef(0)

  useInitialSearchParamScroll({ targetId: 'project-filter' })

  const handleFilterStateChange = useCallback(
    (filters: ProjectFilterState) => {
      setActiveFilters(filters)
      const nextApiKey = getProjectApiKey(filters)
      if (nextApiKey === apiKeyRef.current) {
        return
      }

      apiKeyRef.current = nextApiKey
      const requestId = filterRequestIdRef.current + 1
      filterRequestIdRef.current = requestId
      setIsResetting(true)
      getProjects(getProjectParams(filters, 1, pageSize))
        .then((response) => {
          if (filterRequestIdRef.current !== requestId) {
            return
          }

          const payload = response.data
          setLoadedProjects(payload.projects)
          setCurrentStats(payload.stats)
          setTotal(payload.total)
          setPage(payload.page)
          setTotalPages(payload.totalPages)
        })
        .catch(ignoreStaleRequest)
        .finally(() => {
          if (filterRequestIdRef.current === requestId) {
            setIsResetting(false)
          }
        })
    },
    [apiKeyRef, pageSize],
  )

  const hasMore = page < totalPages

  const loadMore = useCallback(() => {
    if (!hasMore || isLoadingMore || isResetting) {
      return
    }

    setIsLoadingMore(true)
    getProjects(getProjectParams(activeFilters, page + 1, pageSize))
      .then((response) => {
        const payload = response.data
        setLoadedProjects((currentProjects) => dedupeProjects([...currentProjects, ...payload.projects]))
        setCurrentStats(payload.stats)
        setTotal(payload.total)
        setPage(payload.page)
        setTotalPages(payload.totalPages)
      })
      .catch(ignoreStaleRequest)
      .finally(() => setIsLoadingMore(false))
  }, [activeFilters, hasMore, isLoadingMore, isResetting, page, pageSize])

  const sentinelRef = useInfiniteScrollSentinel({
    enabled: hasMore && !isLoadingMore && !isResetting,
    onLoadMore: loadMore,
  })

  const handleCollapse = useCallback(() => {
    setLoadedProjects((currentProjects) => currentProjects.slice(0, pageSize))
    setPage(1)
    const projectFilter = document.getElementById('project-filter')
    if (projectFilter) {
      smoothScrollToElement(projectFilter, headerHeight + 10)
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [headerHeight, pageSize])

  const waterfallItems = useMemo(() => {
    return loadedProjects.map((project) => {
      const category = categorizeProject(project)

      return {
        id: project.id.toString(),
        content: <BriefProjectCard project={project} category={category} />,
        expandedContent: <ProjectDetailPanel projectId={project.id} category={category} />,
        height: 'medium' as const,
        anchorId: `project-${project.id}`,
      }
    })
  }, [loadedProjects])

  return (
    <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14 min-h-[calc(100vh-var(--site-nav-height))] text-[var(--site-text)]">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-4xl font-bold mb-2">{t('title')}</h1>
        <p className="text-base sm:text-xl text-[var(--site-text-muted)]">{t('description')}</p>
      </div>

      {currentStats && (
        <StatsOverview stats={currentStats} className="mb-6 sm:mb-8" />
      )}

      <div id="project-filter" className="mb-6 sm:mb-8">
        <ProjectFilter
          projects={loadedProjects}
          onFilterStateChange={handleFilterStateChange}
          isLoading={isResetting}
        />
      </div>

      <div
        className="sticky z-30 mb-6 flex items-center justify-between border-b border-[var(--site-border)] bg-gray-50 py-3"
        style={{ top: `${headerHeight}px` }}
      >
        <h2 className="text-lg font-semibold text-[var(--site-text)]">{t('title')}</h2>
      </div>

      {waterfallItems.length > 0 ? (
        <div className={`transition-opacity duration-200 ${isResetting ? 'opacity-60' : 'opacity-100'}`}>
          <div className="block md:hidden">
            <ExpandableWaterfall items={waterfallItems} columns={1} gap={16} />
          </div>
          <div className="hidden md:block">
            <ExpandableWaterfall items={waterfallItems} columns={2} gap={24} />
          </div>
        </div>
      ) : (
        <div className="py-12 text-center">
          <p className="text-[var(--site-text-tertiary)] text-base sm:text-lg">暂无项目</p>
        </div>
      )}

      <div className="mt-6 flex items-center justify-between gap-4">
        <span className="text-xs text-[var(--site-text-tertiary)]">已显示 {loadedProjects.length} / {total} 个</span>
        {page > 1 && (
          <Button
            type="ghost"
            size="sm"
            onClick={handleCollapse}
            className="text-[var(--site-action)]! hover:text-[var(--site-action-hover)] hover:bg-[var(--site-canvas-muted)]"
          >
            <ChevronUpIcon className="h-4 w-4" />
            <span className="ml-2 text-sm">收起</span>
          </Button>
        )}
      </div>

      <div ref={sentinelRef} className="flex min-h-12 items-center justify-center py-4">
        {(isLoadingMore || isResetting) && <Loading variant="spinner" size="sm" />}
      </div>
    </div>
  )
}
