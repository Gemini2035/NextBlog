'use client'

import { useTranslations } from 'next-intl'
import { StarIcon, ClockIcon, EditIcon, RefreshIcon } from '@/assets/icons'
import { FeaturedFilter } from './FeaturedFilter'
import { SortFilter } from './SortFilter'
import { CollapsibleTagFilter } from './CollapsibleTagFilter'
import { TagOption } from './types'
import { cn } from '@/utils'

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
    <div className={cn('space-y-3 md:space-y-4')}>
      {/* Tag Filter */}
      <CollapsibleTagFilter
        tags={tags}
        selectedTags={selectedTags}
        onChange={onTagChange}
      />

      {/* 网格布局：移动端单列，桌面端2x2 */}
      <div className={cn('grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4')}>
        {/* Featured Filter */}
        <div className={cn('flex items-center justify-between py-2 md:py-0')}>
          <div className={cn('flex items-center gap-2')}>
            <StarIcon className={cn('w-3.5 h-3.5 md:w-4 md:h-4 text-yellow-500 shrink-0')} />
            <span className={cn('text-xs md:text-sm font-medium text-gray-700')}>{t('featuredFilter')}</span>
          </div>
          <FeaturedFilter
            value={featuredValue}
            onChange={onFeaturedChange}
          />
        </div>

        {/* 字数排序 */}
        <div className={cn('flex items-center justify-between py-2 md:py-0')}>
          <div className={cn('flex items-center gap-2')}>
            <EditIcon className={cn('w-3.5 h-3.5 md:w-4 md:h-4 text-blue-500 shrink-0')} />
            <span className={cn('text-xs md:text-sm font-medium text-gray-700')}>{t('wordCountSort')}</span>
          </div>
          <SortFilter
            value={wordCountSort}
            onChange={onWordCountSortChange}
          />
        </div>

        {/* 创建时间排序 */}
        <div className={cn('flex items-center justify-between py-2 md:py-0')}>
          <div className={cn('flex items-center gap-2')}>
            <ClockIcon className={cn('w-3.5 h-3.5 md:w-4 md:h-4 text-green-500 shrink-0')} />
            <span className={cn('text-xs md:text-sm font-medium text-gray-700')}>{t('createTimeSort')}</span>
          </div>
          <SortFilter
            value={createTimeSort}
            onChange={onCreateTimeSortChange}
          />
        </div>

        {/* 更新时间排序 */}
        <div className={cn('flex items-center justify-between py-2 md:py-0')}>
          <div className={cn('flex items-center gap-2')}>
            <RefreshIcon className={cn('w-3.5 h-3.5 md:w-4 md:h-4 text-purple-500 shrink-0')} />
            <span className={cn('text-xs md:text-sm font-medium text-gray-700')}>{t('updateTimeSort')}</span>
          </div>
          <SortFilter
            value={updateTimeSort}
            onChange={onUpdateTimeSortChange}
          />
        </div>
      </div>
    </div>
  )
}
