'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter, useSearchParams } from 'next/navigation'
import { Collapse, CollapsePanel } from '@/ui'
import { FilterHeader } from './FilterHeader'
import { FilterRow } from './FilterRow'
import { ClearButton } from './ClearButton'
import { applyFilters } from './utils'
import type { ProjectFilterProps, ProjectFilterState } from './types'

export function ProjectFilter({ projects, onFilteredProjectsChange }: ProjectFilterProps) {
  const t = useTranslations('ProjectFilter')
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [filters, setFilters] = useState<ProjectFilterState>({
    keyword: '',
    showPinned: null,
    showOwned: null,
    showContributed: null,
    showFork: null,
    showArchived: null,
    starSort: null,
    forkSort: null,
    weightSort: null,
    createTimeSort: null,
    updateTimeSort: null,
    pushTimeSort: null
  })

  const [isOpen, setIsOpen] = useState(false)

  // 从URL参数初始化筛选条件（仅在首次加载时）
  useEffect(() => {
    const newFilters: Partial<ProjectFilterState> = {}
    let hasFilters = false

    // 读取关键词
    const keyword = searchParams.get('keyword')
    if (keyword) {
      newFilters.keyword = keyword
      hasFilters = true
    }

    // 读取布尔筛选
    const parseBoolParam = (param: string | null) => {
      if (param === 'true') return true
      if (param === 'false') return false
      return null
    }

    const pinned = parseBoolParam(searchParams.get('pinned'))
    if (pinned !== null) {
      newFilters.showPinned = pinned
      hasFilters = true
    }

    const owned = parseBoolParam(searchParams.get('owned'))
    if (owned !== null) {
      newFilters.showOwned = owned
      hasFilters = true
    }

    const contributed = parseBoolParam(searchParams.get('contributed'))
    if (contributed !== null) {
      newFilters.showContributed = contributed
      hasFilters = true
    }

    const fork = parseBoolParam(searchParams.get('fork'))
    if (fork !== null) {
      newFilters.showFork = fork
      hasFilters = true
    }

    const archived = parseBoolParam(searchParams.get('archived'))
    if (archived !== null) {
      newFilters.showArchived = archived
      hasFilters = true
    }

    // 读取排序（只能有一个）
    const sort = searchParams.get('sort')
    if (sort) {
      const [sortKey, direction] = sort.split('-')
      const sortDir = (direction === 'asc' ? 'asc' : 'desc') as 'asc' | 'desc'
      
      switch (sortKey) {
        case 'stars':
          newFilters.starSort = sortDir
          hasFilters = true
          break
        case 'forks':
          newFilters.forkSort = sortDir
          hasFilters = true
          break
        case 'weight':
          newFilters.weightSort = sortDir
          hasFilters = true
          break
        case 'created':
          newFilters.createTimeSort = sortDir
          hasFilters = true
          break
        case 'updated':
          newFilters.updateTimeSort = sortDir
          hasFilters = true
          break
        case 'pushed':
          newFilters.pushTimeSort = sortDir
          hasFilters = true
          break
      }
    }

    // 应用筛选条件
    if (hasFilters) {
      setFilters(prev => ({ ...prev, ...newFilters }))
      setIsOpen(true)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // 仅在首次加载时执行

  // 检查是否有活跃的筛选条件
  const hasActiveFilters = useMemo(() => {
    return (
      filters.keyword.trim() !== '' ||
      filters.showPinned !== null ||
      filters.showOwned !== null ||
      filters.showContributed !== null ||
      filters.showFork !== null ||
      filters.showArchived !== null ||
      filters.starSort !== null ||
      filters.forkSort !== null ||
      filters.weightSort !== null ||
      filters.createTimeSort !== null ||
      filters.updateTimeSort !== null ||
      filters.pushTimeSort !== null
    )
  }, [filters])

  // 当有活跃筛选条件时，自动打开面板
  useEffect(() => {
    if (hasActiveFilters) {
      setIsOpen(true)
    }
  }, [hasActiveFilters])

  // 应用筛选条件
  const filteredProjects = useMemo(() => {
    return applyFilters(projects, filters)
  }, [projects, filters])

  // 通知父组件筛选结果变化
  useEffect(() => {
    onFilteredProjectsChange(filteredProjects)
  }, [filteredProjects, onFilteredProjectsChange])

  // URL同步 - 当筛选条件变化时更新URL
  useEffect(() => {
    const newSearchParams = new URLSearchParams()

    // 写入关键词
    if (filters.keyword.trim()) {
      newSearchParams.set('keyword', filters.keyword)
    }

    // 写入布尔筛选条件
    if (filters.showPinned !== null) {
      newSearchParams.set('pinned', String(filters.showPinned))
    }
    if (filters.showOwned !== null) {
      newSearchParams.set('owned', String(filters.showOwned))
    }
    if (filters.showContributed !== null) {
      newSearchParams.set('contributed', String(filters.showContributed))
    }
    if (filters.showFork !== null) {
      newSearchParams.set('fork', String(filters.showFork))
    }
    if (filters.showArchived !== null) {
      newSearchParams.set('archived', String(filters.showArchived))
    }

    // 写入排序条件（只能有一个）
    if (filters.starSort) {
      newSearchParams.set('sort', `stars-${filters.starSort}`)
    } else if (filters.forkSort) {
      newSearchParams.set('sort', `forks-${filters.forkSort}`)
    } else if (filters.weightSort) {
      newSearchParams.set('sort', `weight-${filters.weightSort}`)
    } else if (filters.createTimeSort) {
      newSearchParams.set('sort', `created-${filters.createTimeSort}`)
    } else if (filters.updateTimeSort) {
      newSearchParams.set('sort', `updated-${filters.updateTimeSort}`)
    } else if (filters.pushTimeSort) {
      newSearchParams.set('sort', `pushed-${filters.pushTimeSort}`)
    }

    // 构建新URL
    const newUrl = newSearchParams.toString()
      ? `?${newSearchParams.toString()}`
      : '/projects'

    // 获取当前URL（不含locale前缀）
    const currentParams = searchParams.toString()
    const currentUrl = currentParams ? `?${currentParams}` : '/projects'

    // 只在URL确实需要变化时更新
    if (newUrl !== currentUrl) {
      router.replace(newUrl, { scroll: false })
    }
  }, [filters, router, searchParams])

  // 更新筛选条件，并重置其他排序
  const updateFilter = useCallback(<K extends keyof ProjectFilterState>(
    key: K, 
    value: ProjectFilterState[K]
  ) => {
    setFilters(prev => {
      const newFilters = { ...prev, [key]: value }
      
      // 如果是排序字段，重置其他排序
      if (key.includes('Sort') && value !== null) {
        const sortKeys = [
          'starSort',
          'forkSort',
          'weightSort',
          'createTimeSort',
          'updateTimeSort',
          'pushTimeSort'
        ] as const
        sortKeys.forEach(sortKey => {
          if (sortKey !== key) {
            newFilters[sortKey] = null
          }
        })
      }
      
      return newFilters
    })
  }, [])

  // 搜索关键词更新函数
  const handleSearchChange = useCallback((value: string) => {
    updateFilter('keyword', value)
  }, [updateFilter])

  // 清除所有筛选条件
  const clearAllFilters = useCallback(() => {
    setFilters({
      keyword: '',
      showPinned: null,
      showOwned: null,
      showContributed: null,
      showFork: null,
      showArchived: null,
      starSort: null,
      forkSort: null,
      weightSort: null,
      createTimeSort: null,
      updateTimeSort: null,
      pushTimeSort: null
    })
  }, [])

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <Collapse
        activeKey={isOpen ? ['filter'] : []}
        onChange={(keys) => {
          const newIsOpen = Array.isArray(keys) ? keys.includes('filter') : keys === 'filter'
          setIsOpen(newIsOpen)
        }}
        variant="bordered"
        size="sm"
        className="overflow-visible"
      >
        <CollapsePanel
          key="filter"
          header={
            <FilterHeader
              title={t('title')}
              description={t('description')}
              searchValue={filters.keyword}
              onSearchChange={handleSearchChange}
              searchPlaceholder={t('searchPlaceholder')}
            />
          }
          collapsible="header"
        >
          <div className="p-4 pt-0 pb-6">
            {/* 筛选器行 */}
            <FilterRow
              showPinned={filters.showPinned}
              onShowPinnedChange={(value) => updateFilter('showPinned', value)}
              showOwned={filters.showOwned}
              onShowOwnedChange={(value) => updateFilter('showOwned', value)}
              showContributed={filters.showContributed}
              onShowContributedChange={(value) => updateFilter('showContributed', value)}
              showFork={filters.showFork}
              onShowForkChange={(value) => updateFilter('showFork', value)}
              showArchived={filters.showArchived}
              onShowArchivedChange={(value) => updateFilter('showArchived', value)}
              starSort={filters.starSort}
              forkSort={filters.forkSort}
              weightSort={filters.weightSort}
              createTimeSort={filters.createTimeSort}
              updateTimeSort={filters.updateTimeSort}
              pushTimeSort={filters.pushTimeSort}
              onStarSortChange={(value) => updateFilter('starSort', value)}
              onForkSortChange={(value) => updateFilter('forkSort', value)}
              onWeightSortChange={(value) => updateFilter('weightSort', value)}
              onCreateTimeSortChange={(value) => updateFilter('createTimeSort', value)}
              onUpdateTimeSortChange={(value) => updateFilter('updateTimeSort', value)}
              onPushTimeSortChange={(value) => updateFilter('pushTimeSort', value)}
            />

            {/* 清除按钮和统计信息 */}
            <div className="mt-4 sm:mt-6 pt-4 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
                  {t('filteredCount', { count: filteredProjects.length, total: projects.length })}
                </div>
                <div className="w-full sm:w-auto">
                  <ClearButton
                    onClear={clearAllFilters}
                    label={t('clearAll')}
                  />
                </div>
              </div>
            </div>
          </div>
        </CollapsePanel>
      </Collapse>
    </div>
  )
}

