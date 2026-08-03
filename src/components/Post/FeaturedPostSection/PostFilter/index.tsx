'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import { useFilterUrlSync } from '@/hooks'
import { Collapse, CollapsePanel, Loading } from '@/ui'
import { FilterHeader } from './FilterHeader'
import { FilterRow } from './FilterRow'
import { ClearButton } from './ClearButton'
import { getAllTagsWithCount } from './utils'
import type { PostFilterProps, FilterState } from './types'

export function PostFilter({ posts, onFilterStateChange, isLoading = false, initialTag }: PostFilterProps) {
  const t = useTranslations('PostFilter')
  const searchParams = useSearchParams()

  const getInitialFilters = useCallback((): FilterState => {
    const initialFilters: FilterState = {
      keyword: '',
      selectedTags: [],
      wordCountSort: null,
      featuredFilter: null,
      createTimeSort: null,
      updateTimeSort: null
    }

    const keyword = searchParams.get('keyword')
    if (keyword) {
      initialFilters.keyword = keyword
    }

    const tag = searchParams.get('tag')
    if (tag) {
      initialFilters.selectedTags = [tag]
    } else if (initialTag) {
      initialFilters.selectedTags = [initialTag]
    }

    const featured = searchParams.get('featured')
    if (featured === 'true') {
      initialFilters.featuredFilter = true
    } else if (featured === 'false') {
      initialFilters.featuredFilter = false
    }

    const sort = searchParams.get('sort')
    if (sort) {
      const [sortKey, direction] = sort.split('-')
      const sortDir = (direction === 'asc' ? 'asc' : 'desc') as 'asc' | 'desc'

      switch (sortKey) {
        case 'wordCount':
          initialFilters.wordCountSort = sortDir
          break
        case 'created':
          initialFilters.createTimeSort = sortDir
          break
        case 'updated':
          initialFilters.updateTimeSort = sortDir
          break
      }
    }

    return initialFilters
  }, [initialTag, searchParams])

  const [filters, setFilters] = useState<FilterState>(() => getInitialFilters())
  const [keywordUrlValue, setKeywordUrlValue] = useState(() => searchParams.get('keyword') ?? '')
  const [isOpen, setIsOpen] = useState(() => {
    const initialFilters = getInitialFilters()
    return (
      initialFilters.selectedTags.length > 0 ||
      initialFilters.featuredFilter !== null ||
      initialFilters.wordCountSort !== null ||
      initialFilters.createTimeSort !== null ||
      initialFilters.updateTimeSort !== null
    )
  })

  // 获取所有标签
  const allTags = useMemo(() => getAllTagsWithCount(posts), [posts])

  useEffect(() => {
    onFilterStateChange?.(filters)
  }, [filters, onFilterStateChange])

  // 关键词搜索不自动展开；其他筛选条件激活时保持原有展开行为。
  const hasActivePanelFilters = useMemo(() => {
    return (
      filters.selectedTags.length > 0 ||
      filters.featuredFilter !== null ||
      filters.wordCountSort !== null ||
      filters.createTimeSort !== null ||
      filters.updateTimeSort !== null
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

    // 写入标签（支持多个标签）
    if (filters.selectedTags.length > 0) {
      newSearchParams.set('tag', filters.selectedTags[0])
    }

    // 写入featured筛选
    if (filters.featuredFilter !== null) {
      newSearchParams.set('featured', String(filters.featuredFilter))
    }

    // 写入排序（只能有一个）
    if (filters.wordCountSort) {
      newSearchParams.set('sort', `wordCount-${filters.wordCountSort}`)
    } else if (filters.createTimeSort) {
      newSearchParams.set('sort', `created-${filters.createTimeSort}`)
    } else if (filters.updateTimeSort) {
      newSearchParams.set('sort', `updated-${filters.updateTimeSort}`)
    }

    return newSearchParams
  }, [filters, keywordUrlValue])

  // URL同步 - 当筛选条件变化时更新URL
  useFilterUrlSync(filterSearchParams)

  // 更新筛选条件，并重置其他排序
  const updateFilter = useCallback(<K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters(prev => {
      const newFilters = { ...prev, [key]: value }
      
      // 如果是排序字段，重置其他排序
      if (key.includes('Sort') && value !== null) {
        const sortKeys = [
          'wordCountSort',
          'createTimeSort',
          'updateTimeSort'
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
        onChange={(keys: string | string[]) => {
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
              searchValue={keywordUrlValue}
              onSearchChange={handleSearchChange}
              onSearchInputChange={handleSearchInputChange}
              searchPlaceholder={t('keywordPlaceholder')}
            />
          }
          collapsible="header"
        >
          <div className="p-3 md:p-4 pt-0">
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
            <div className="mt-4 md:mt-6 pt-3 md:pt-4 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                {isLoading && <Loading variant="spinner" size="xs" />}
                {t('filteredCount', { count: posts.length, total: posts.length })}
              </div>
              <div className="sm:w-auto w-full">
                <ClearButton
                  onClear={clearAllFilters}
                  label={t('clearAll')}
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>
        </CollapsePanel>
      </Collapse>
    </div>
  )
}
