'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { Collapse, CollapsePanel } from '@/ui'
import { FilterSection } from './FilterSection'
import { KeywordSearch } from './KeywordSearch'
import { TagFilter } from './TagFilter'
import { SortSelect } from './SortSelect'
import { FeaturedFilter } from './FeaturedFilter'
import { ClearButton } from './ClearButton'
import { applyFilters, getAllTagsWithCount } from './utils'
import type { PostFilterProps, FilterState, SortOption } from './types'

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

  // 排序选项
  const wordCountSortOptions: SortOption[] = [
    { value: 'asc', label: t('wordCountAsc') },
    { value: 'desc', label: t('wordCountDesc') }
  ]

  const createTimeSortOptions: SortOption[] = [
    { value: 'asc', label: t('createTimeAsc') },
    { value: 'desc', label: t('createTimeDesc') }
  ]

  const updateTimeSortOptions: SortOption[] = [
    { value: 'asc', label: t('updateTimeAsc') },
    { value: 'desc', label: t('updateTimeDesc') }
  ]

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
            <div>
              <h2 className="text-base font-semibold text-gray-900">{t('title')}</h2>
              <p className="text-xs text-gray-600">{t('description')}</p>
            </div>
          }
          collapsible="header"
        >
          <div className="p-4 pt-0">

        {/* 水平布局的筛选器 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {/* 关键字搜索 */}
          <FilterSection title={t('keywordSearch')}>
            <KeywordSearch
              value={filters.keyword}
              onChange={(value) => updateFilter('keyword', value)}
              placeholder={t('keywordPlaceholder')}
            />
          </FilterSection>

          {/* 标签筛选 */}
          <FilterSection title={t('tagFilter')}>
            <TagFilter
              tags={allTags}
              selectedTags={filters.selectedTags}
              onChange={(selectedTags) => updateFilter('selectedTags', selectedTags)}
            />
          </FilterSection>

          {/* Featured筛选 */}
          <FilterSection title={t('featuredFilter')}>
            <FeaturedFilter
              value={filters.featuredFilter}
              onChange={(value) => updateFilter('featuredFilter', value)}
              allLabel={t('allPosts')}
              featuredLabel={t('featuredOnly')}
              nonFeaturedLabel={t('nonFeaturedOnly')}
            />
          </FilterSection>
        </div>

        {/* 排序选项 - 水平布局 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          {/* 字数排序 */}
          <FilterSection title={t('wordCountSort')}>
            <SortSelect
              options={wordCountSortOptions}
              value={filters.wordCountSort}
              onChange={(value) => {
                updateFilter('wordCountSort', value as 'asc' | 'desc' | null)
                // 清除其他排序
                updateFilter('createTimeSort', null)
                updateFilter('updateTimeSort', null)
              }}
              placeholder={t('wordCountPlaceholder')}
            />
          </FilterSection>

          {/* 创建时间排序 */}
          <FilterSection title={t('createTimeSort')}>
            <SortSelect
              options={createTimeSortOptions}
              value={filters.createTimeSort}
              onChange={(value) => {
                updateFilter('createTimeSort', value as 'asc' | 'desc' | null)
                // 清除其他排序
                updateFilter('wordCountSort', null)
                updateFilter('updateTimeSort', null)
              }}
              placeholder={t('createTimePlaceholder')}
            />
          </FilterSection>

          {/* 更新时间排序 */}
          <FilterSection title={t('updateTimeSort')}>
            <SortSelect
              options={updateTimeSortOptions}
              value={filters.updateTimeSort}
              onChange={(value) => {
                updateFilter('updateTimeSort', value as 'asc' | 'desc' | null)
                // 清除其他排序
                updateFilter('wordCountSort', null)
                updateFilter('createTimeSort', null)
              }}
              placeholder={t('updateTimePlaceholder')}
            />
          </FilterSection>
        </div>

            {/* 清除按钮和统计信息 */}
            <div className="mt-4 pt-3 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
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
