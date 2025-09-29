'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { Collapse, CollapsePanel } from '@/ui'
import { FilterHeader } from './FilterHeader'
import { FilterRow } from './FilterRow'
import { ClearButton } from './ClearButton'
import { applyFilters, getAllTagsWithCount } from './utils'
import type { PostFilterProps, FilterState } from './types'

export function PostFilter({ posts, onFilteredPostsChange }: PostFilterProps) {
  const t = useTranslations('PostFilter')
  
  const [filters, setFilters] = useState<FilterState>({
    keyword: '',
    selectedTags: [],
    wordCountSort: null,
    featuredFilter: null,
    createTimeSort: null,
    updateTimeSort: null
  })

  const [isOpen, setIsOpen] = useState(true)

  // 获取所有标签
  const allTags = useMemo(() => getAllTagsWithCount(posts), [posts])

  // 应用筛选条件
  const filteredPosts = useMemo(() => {
    return applyFilters(posts, filters)
  }, [posts, filters])

  // 通知父组件筛选结果变化
  useEffect(() => {
    onFilteredPostsChange(filteredPosts)
  }, [filteredPosts, onFilteredPostsChange])

  // 更新筛选条件
  const updateFilter = useCallback(<K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }, [])


  // 清除所有筛选条件
  const clearAllFilters = useCallback(() => {
    setFilters({
      keyword: '',
      selectedTags: [],
      wordCountSort: null,
      featuredFilter: null,
      createTimeSort: null,
      updateTimeSort: null
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
              onSearchChange={(value) => updateFilter('keyword', value)}
              searchPlaceholder={t('keywordPlaceholder')}
            />
          }
          collapsible="header"
        >
          <div className="p-4 pt-0">
            {/* 单列布局的筛选器 */}
            <FilterRow
              featuredValue={filters.featuredFilter}
              onFeaturedChange={(value) => updateFilter('featuredFilter', value)}
              wordCountSort={filters.wordCountSort}
              createTimeSort={filters.createTimeSort}
              updateTimeSort={filters.updateTimeSort}
              onWordCountSortChange={(value) => updateFilter('wordCountSort', value)}
              onCreateTimeSortChange={(value) => updateFilter('createTimeSort', value)}
              onUpdateTimeSortChange={(value) => updateFilter('updateTimeSort', value)}
              tags={allTags}
              selectedTags={filters.selectedTags}
              onTagChange={(selectedTags) => updateFilter('selectedTags', selectedTags)}
            />

            {/* 清除按钮和统计信息 */}
            <div className="mt-6 pt-4 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="text-xs text-gray-600">
                {t('filteredCount', { count: filteredPosts.length, total: posts.length })}
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
