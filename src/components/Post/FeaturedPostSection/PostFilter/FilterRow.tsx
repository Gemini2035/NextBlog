'use client'

import { useTranslations } from 'next-intl'
import { FeaturedFilter } from './FeaturedFilter'
import { SortFilter } from './SortFilter'
import { CollapsibleTagFilter } from './CollapsibleTagFilter'
import { TagOption } from './types'

interface FilterRowProps {
  // Featured filter
  featuredValue: boolean | null
  onFeaturedChange: (value: boolean | null) => void
  
  // Sort filters
  wordCountSort: 'asc' | 'desc' | null
  createTimeSort: 'asc' | 'desc' | null
  updateTimeSort: 'asc' | 'desc' | null
  onWordCountSortChange: (value: 'asc' | 'desc' | null) => void
  onCreateTimeSortChange: (value: 'asc' | 'desc' | null) => void
  onUpdateTimeSortChange: (value: 'asc' | 'desc' | null) => void
  
  // Tag filter
  tags: TagOption[]
  selectedTags: string[]
  onTagChange: (selectedTags: string[]) => void
}

export function FilterRow({
  featuredValue,
  onFeaturedChange,
  wordCountSort,
  createTimeSort,
  updateTimeSort,
  onWordCountSortChange,
  onCreateTimeSortChange,
  onUpdateTimeSortChange,
  tags,
  selectedTags,
  onTagChange
}: FilterRowProps) {
  const t = useTranslations('PostFilter')
  
  return (
    <div className="space-y-4">
      {/* Tag Filter */}
      <CollapsibleTagFilter
        tags={tags}
        selectedTags={selectedTags}
        onChange={onTagChange}
      />

      {/* 2x2 网格布局：Featured, 字数排序, 创建排序, 更新排序 */}
      <div className="grid grid-cols-2 gap-4">
        {/* Featured Filter */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">{t('featuredFilter')}</span>
          <FeaturedFilter
            value={featuredValue}
            onChange={onFeaturedChange}
          />
        </div>

        {/* 字数排序 */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">{t('wordCountSort')}</span>
          <SortFilter
            value={wordCountSort}
            onChange={onWordCountSortChange}
          />
        </div>

        {/* 创建时间排序 */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">{t('createTimeSort')}</span>
          <SortFilter
            value={createTimeSort}
            onChange={onCreateTimeSortChange}
          />
        </div>

        {/* 更新时间排序 */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">{t('updateTimeSort')}</span>
          <SortFilter
            value={updateTimeSort}
            onChange={onUpdateTimeSortChange}
          />
        </div>
      </div>
    </div>
  )
}
