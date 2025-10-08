'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { Collapse, CollapsePanel } from '@/ui'
import { FilterHeader } from './FilterHeader'
import { FilterRow } from './FilterRow'
import { ClearButton } from './ClearButton'
import { applyFilters } from './utils'
import type { ProjectFilterProps, ProjectFilterState } from './types'

export function ProjectFilter({ projects, onFilteredProjectsChange }: ProjectFilterProps) {
  const t = useTranslations('ProjectFilter')
  
  const [filters, setFilters] = useState<ProjectFilterState>({
    keyword: '',
    showPinned: null,
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

  // 应用筛选条件
  const filteredProjects = useMemo(() => {
    return applyFilters(projects, filters)
  }, [projects, filters])

  // 通知父组件筛选结果变化
  useEffect(() => {
    onFilteredProjectsChange(filteredProjects)
  }, [filteredProjects, onFilteredProjectsChange])

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
          <div className="p-4 pt-0">
            {/* 筛选器行 */}
            <FilterRow
              showPinned={filters.showPinned}
              onShowPinnedChange={(value) => updateFilter('showPinned', value)}
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
            <div className="mt-6 pt-4 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="text-xs text-gray-600">
                {t('filteredCount', { count: filteredProjects.length, total: projects.length })}
              </div>
              <div className="sm:w-auto w-full">
                <ClearButton
                  onClear={clearAllFilters}
                  label={t('clearAll')}
                />
              </div>
            </div>
          </div>
        </CollapsePanel>
      </Collapse>
    </div>
  )
}

