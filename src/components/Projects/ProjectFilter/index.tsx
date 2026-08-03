'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import { useFilterUrlSync } from '@/hooks'
import { Collapse, CollapsePanel, Loading } from '@/ui'
import { FilterHeader } from './FilterHeader'
import { FilterRow } from './FilterRow'
import { ClearButton } from './ClearButton'
import type { ProjectFilterProps, ProjectFilterState } from './types'

export function ProjectFilter({ projects, onFilterStateChange, isLoading = false }: ProjectFilterProps) {
  const t = useTranslations('ProjectFilter')
  const searchParams = useSearchParams()

  const getInitialFilters = useCallback((): ProjectFilterState => {
    const initialFilters: ProjectFilterState = {
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
    }

    const keyword = searchParams.get('keyword')
    if (keyword) {
      initialFilters.keyword = keyword
    }

    const parseBoolParam = (param: string | null) => {
      if (param === 'true') return true
      if (param === 'false') return false
      return null
    }

    initialFilters.showPinned = parseBoolParam(searchParams.get('pinned'))
    initialFilters.showOwned = parseBoolParam(searchParams.get('owned'))
    initialFilters.showContributed = parseBoolParam(searchParams.get('contributed'))
    initialFilters.showFork = parseBoolParam(searchParams.get('fork'))
    initialFilters.showArchived = parseBoolParam(searchParams.get('archived'))

    const sort = searchParams.get('sort')
    if (sort) {
      const [sortKey, direction] = sort.split('-')
      const sortDir = (direction === 'asc' ? 'asc' : 'desc') as 'asc' | 'desc'

      switch (sortKey) {
        case 'stars':
          initialFilters.starSort = sortDir
          break
        case 'forks':
          initialFilters.forkSort = sortDir
          break
        case 'weight':
          initialFilters.weightSort = sortDir
          break
        case 'created':
          initialFilters.createTimeSort = sortDir
          break
        case 'updated':
          initialFilters.updateTimeSort = sortDir
          break
        case 'pushed':
          initialFilters.pushTimeSort = sortDir
          break
      }
    }

    return initialFilters
  }, [searchParams])

  const [filters, setFilters] = useState<ProjectFilterState>(() => getInitialFilters())
  const [keywordUrlValue, setKeywordUrlValue] = useState(() => searchParams.get('keyword') ?? '')
  const [isOpen, setIsOpen] = useState(() => {
    const initialFilters = getInitialFilters()
    return (
      initialFilters.showPinned !== null ||
      initialFilters.showOwned !== null ||
      initialFilters.showContributed !== null ||
      initialFilters.showFork !== null ||
      initialFilters.showArchived !== null ||
      initialFilters.starSort !== null ||
      initialFilters.forkSort !== null ||
      initialFilters.weightSort !== null ||
      initialFilters.createTimeSort !== null ||
      initialFilters.updateTimeSort !== null ||
      initialFilters.pushTimeSort !== null
    )
  })

  useEffect(() => {
    onFilterStateChange?.(filters)
  }, [filters, onFilterStateChange])

  // 关键词搜索不自动展开；其他筛选条件激活时保持原有展开行为。
  const hasActivePanelFilters = useMemo(() => {
    return (
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

  useEffect(() => {
    if (hasActivePanelFilters) {
      setIsOpen(true)
    }
  }, [hasActivePanelFilters])

  const filterSearchParams = useMemo(() => {
    const newSearchParams = new URLSearchParams()

    // 写入关键词
    if (keywordUrlValue.trim()) {
      newSearchParams.set('keyword', keywordUrlValue)
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

    return newSearchParams
  }, [filters, keywordUrlValue])

  // URL同步 - 当筛选条件变化时更新URL
  useFilterUrlSync(filterSearchParams)

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

  const handleSearchInputChange = useCallback((value: string) => {
    setKeywordUrlValue(value)
  }, [])

  // 清除所有筛选条件
  const clearAllFilters = useCallback(() => {
    setKeywordUrlValue('')
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
    <div className="rounded-[var(--site-radius-card)] border border-[var(--site-border)] bg-[var(--site-canvas)] shadow-none">
      <Collapse
        activeKey={isOpen ? ['filter'] : []}
        onChange={(keys: string | string[]) => {
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
              searchValue={keywordUrlValue}
              onSearchChange={handleSearchChange}
              onSearchInputChange={handleSearchInputChange}
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
                <div className="flex items-center justify-center gap-2 text-xs text-gray-600 sm:justify-start sm:text-sm">
                  {isLoading && <Loading variant="spinner" size="xs" />}
                  {t('filteredCount', { count: projects.length, total: projects.length })}
                </div>
                <div className="w-full sm:w-auto">
                  <ClearButton
                    onClear={clearAllFilters}
                    label={t('clearAll')}
                    disabled={isLoading}
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
