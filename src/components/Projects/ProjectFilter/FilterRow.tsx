'use client'

import { useTranslations } from 'next-intl'
import { PinnedFilter } from './PinnedFilter'
import { ForkFilter } from './ForkFilter'
import { ArchivedFilter } from './ArchivedFilter'
import { SortFilter } from './SortFilter'

interface FilterRowProps {
  // Boolean filters
  showPinned: boolean | null
  onShowPinnedChange: (value: boolean | null) => void
  showFork: boolean | null
  onShowForkChange: (value: boolean | null) => void
  showArchived: boolean | null
  onShowArchivedChange: (value: boolean | null) => void
  
  // Sort filters
  starSort: 'asc' | 'desc' | null
  forkSort: 'asc' | 'desc' | null
  weightSort: 'asc' | 'desc' | null
  createTimeSort: 'asc' | 'desc' | null
  updateTimeSort: 'asc' | 'desc' | null
  pushTimeSort: 'asc' | 'desc' | null
  onStarSortChange: (value: 'asc' | 'desc' | null) => void
  onForkSortChange: (value: 'asc' | 'desc' | null) => void
  onWeightSortChange: (value: 'asc' | 'desc' | null) => void
  onCreateTimeSortChange: (value: 'asc' | 'desc' | null) => void
  onUpdateTimeSortChange: (value: 'asc' | 'desc' | null) => void
  onPushTimeSortChange: (value: 'asc' | 'desc' | null) => void
}

export function FilterRow({
  showPinned,
  onShowPinnedChange,
  showFork,
  onShowForkChange,
  showArchived,
  onShowArchivedChange,
  starSort,
  forkSort,
  weightSort,
  createTimeSort,
  updateTimeSort,
  pushTimeSort,
  onStarSortChange,
  onForkSortChange,
  onWeightSortChange,
  onCreateTimeSortChange,
  onUpdateTimeSortChange,
  onPushTimeSortChange
}: FilterRowProps) {
  const t = useTranslations('ProjectFilter')
  
  return (
    <div className="space-y-4">
      {/* 3x3 网格布局 */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {/* 置顶项目筛选 */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">{t('showPinned')}</span>
          <PinnedFilter
            value={showPinned}
            onChange={onShowPinnedChange}
          />
        </div>

        {/* Fork项目筛选 */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">{t('showFork')}</span>
          <ForkFilter
            value={showFork}
            onChange={onShowForkChange}
          />
        </div>

        {/* 归档项目筛选 */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">{t('showArchived')}</span>
          <ArchivedFilter
            value={showArchived}
            onChange={onShowArchivedChange}
          />
        </div>

        {/* Star排序 */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">{t('starSort')}</span>
          <SortFilter
            value={starSort}
            onChange={onStarSortChange}
          />
        </div>

        {/* Fork排序 */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">{t('forkSort')}</span>
          <SortFilter
            value={forkSort}
            onChange={onForkSortChange}
          />
        </div>

        {/* 推荐度排序 */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">{t('weightSort')}</span>
          <SortFilter
            value={weightSort}
            onChange={onWeightSortChange}
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

        {/* 推送时间排序 */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">{t('pushTimeSort')}</span>
          <SortFilter
            value={pushTimeSort}
            onChange={onPushTimeSortChange}
          />
        </div>
      </div>
    </div>
  )
}

