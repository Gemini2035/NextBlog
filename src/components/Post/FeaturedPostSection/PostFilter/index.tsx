'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter, useSearchParams } from 'next/navigation'
import { Collapse, CollapsePanel } from '@/ui'
import { FilterHeader } from './FilterHeader'
import { FilterRow } from './FilterRow'
import { ClearButton } from './ClearButton'
import { applyFilters, getAllTagsWithCount } from './utils'
import type { PostFilterProps, FilterState } from './types'

export function PostFilter({ posts, onFilteredPostsChange, initialTag }: PostFilterProps) {
  const t = useTranslations('PostFilter')
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [filters, setFilters] = useState<FilterState>({
    keyword: '',
    selectedTags: [],
    wordCountSort: null,
    featuredFilter: null,
    createTimeSort: null,
    updateTimeSort: null
  })

  const [isOpen, setIsOpen] = useState(false)

  // 获取所有标签
  const allTags = useMemo(() => getAllTagsWithCount(posts), [posts])

  // 从URL参数初始化筛选条件（仅在首次加载时）
  useEffect(() => {
    const newFilters: Partial<FilterState> = {}
    let hasFilters = false

    // 读取关键词
    const keyword = searchParams.get('keyword')
    if (keyword) {
      newFilters.keyword = keyword
      hasFilters = true
    }

    // 读取标签
    const tag = searchParams.get('tag')
    if (tag) {
      newFilters.selectedTags = [tag]
      hasFilters = true
    }

    // 读取featured筛选
    const featured = searchParams.get('featured')
    if (featured === 'true') {
      newFilters.featuredFilter = true
      hasFilters = true
    } else if (featured === 'false') {
      newFilters.featuredFilter = false
      hasFilters = true
    }

    // 读取排序（只能有一个）
    const sort = searchParams.get('sort')
    if (sort) {
      const [sortKey, direction] = sort.split('-')
      const sortDir = (direction === 'asc' ? 'asc' : 'desc') as 'asc' | 'desc'
      
      switch (sortKey) {
        case 'wordCount':
          newFilters.wordCountSort = sortDir
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
      }
    }

    // 应用筛选条件
    if (hasFilters) {
      setFilters(prev => ({ ...prev, ...newFilters }))
      setIsOpen(true)
    }

    // 如果有initialTag（从其他页面跳转），优先使用
    if (initialTag && !hasFilters) {
      setFilters(prev => ({
        ...prev,
        selectedTags: [initialTag]
      }))
      setIsOpen(true)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // 仅在首次加载时执行

  // 应用筛选条件
  const filteredPosts = useMemo(() => {
    return applyFilters(posts, filters)
  }, [posts, filters])

  // 通知父组件筛选结果变化
  useEffect(() => {
    onFilteredPostsChange(filteredPosts)
  }, [filteredPosts, onFilteredPostsChange])

  // 检查是否有活跃的筛选条件
  const hasActiveFilters = useMemo(() => {
    return (
      filters.keyword.trim() !== '' ||
      filters.selectedTags.length > 0 ||
      filters.featuredFilter !== null ||
      filters.wordCountSort !== null ||
      filters.createTimeSort !== null ||
      filters.updateTimeSort !== null
    )
  }, [filters])

  // 当有活跃筛选条件时，自动打开面板
  useEffect(() => {
    if (hasActiveFilters) {
      setIsOpen(true)
    }
  }, [hasActiveFilters])

  // URL同步 - 当筛选条件变化时更新URL
  useEffect(() => {
    const newSearchParams = new URLSearchParams()

    // 写入关键词
    if (filters.keyword.trim()) {
      newSearchParams.set('keyword', filters.keyword)
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

    // 构建新URL
    const newUrl = newSearchParams.toString()
      ? `?${newSearchParams.toString()}`
      : window.location.pathname

    // 获取当前URL
    const currentParams = searchParams.toString()
    const currentUrl = currentParams ? `?${currentParams}` : window.location.pathname

    // 只在URL确实需要变化时更新
    if (newUrl !== currentUrl) {
      router.replace(newUrl, { scroll: false })
    }
  }, [filters, router, searchParams])

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
              onSearchChange={handleSearchChange}
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
