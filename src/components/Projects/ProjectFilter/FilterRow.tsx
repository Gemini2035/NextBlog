'use client'

import { useTranslations } from 'next-intl'
import { cn } from '@/utils'
import { 
  StarFilledIcon, 
  ProjectIcon, 
  ContributorIcon, 
  ForkIcon,
  ArchiveIcon,
  StarIcon,
  ClockIcon,
  RefreshIcon
} from '@/assets/icons'
import { PinnedFilter } from './PinnedFilter'
import { OwnedFilter } from './OwnedFilter'
import { ContributedFilter } from './ContributedFilter'
import { ForkFilter } from './ForkFilter'
import { ArchivedFilter } from './ArchivedFilter'
import { SortFilter } from './SortFilter'

interface FilterRowProps {
  // Boolean filters
  showPinned: boolean | null
  onShowPinnedChange: (value: boolean | null) => void
  showOwned: boolean | null
  onShowOwnedChange: (value: boolean | null) => void
  showContributed: boolean | null
  onShowContributedChange: (value: boolean | null) => void
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
  showOwned,
  onShowOwnedChange,
  showContributed,
  onShowContributedChange,
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
    <div className={cn('space-y-3 md:space-y-4')}>
      {/* 网格布局：移动端单列，桌面端2列（参考博客筛选器） */}
      <div className={cn('grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4')}>
        {/* 置顶项目筛选 */}
        <div className={cn('flex items-center justify-between py-2 md:py-0 min-w-0')}>
          <div className={cn('flex items-center gap-2 min-w-0 flex-1')}>
            <StarFilledIcon className={cn('w-3.5 h-3.5 md:w-4 md:h-4 text-yellow-500 shrink-0')} />
            <span className={cn('text-xs md:text-sm font-medium text-gray-700 truncate')}>{t('showPinned')}</span>
          </div>
          <div className={cn('shrink-0 ml-2')}>
            <PinnedFilter
              value={showPinned}
              onChange={onShowPinnedChange}
            />
          </div>
        </div>

        {/* 我创建的项目筛选 */}
        <div className={cn('flex items-center justify-between py-2 md:py-0 min-w-0')}>
          <div className={cn('flex items-center gap-2 min-w-0 flex-1')}>
            <ProjectIcon className={cn('w-3.5 h-3.5 md:w-4 md:h-4 text-blue-500 shrink-0')} />
            <span className={cn('text-xs md:text-sm font-medium text-gray-700 truncate')}>{t('showOwned')}</span>
          </div>
          <div className={cn('shrink-0 ml-2')}>
            <OwnedFilter
              value={showOwned}
              onChange={onShowOwnedChange}
            />
          </div>
        </div>

        {/* 我参与的项目筛选 */}
        <div className={cn('flex items-center justify-between py-2 md:py-0 min-w-0')}>
          <div className={cn('flex items-center gap-2 min-w-0 flex-1')}>
            <ContributorIcon className={cn('w-3.5 h-3.5 md:w-4 md:h-4 text-purple-500 shrink-0')} />
            <span className={cn('text-xs md:text-sm font-medium text-gray-700 truncate')}>{t('showContributed')}</span>
          </div>
          <div className={cn('shrink-0 ml-2')}>
            <ContributedFilter
              value={showContributed}
              onChange={onShowContributedChange}
            />
          </div>
        </div>

        {/* Fork项目筛选 */}
        <div className={cn('flex items-center justify-between py-2 md:py-0 min-w-0')}>
          <div className={cn('flex items-center gap-2 min-w-0 flex-1')}>
            <ForkIcon className={cn('w-3.5 h-3.5 md:w-4 md:h-4 text-orange-500 shrink-0')} />
            <span className={cn('text-xs md:text-sm font-medium text-gray-700 truncate')}>{t('showFork')}</span>
          </div>
          <div className={cn('shrink-0 ml-2')}>
            <ForkFilter
              value={showFork}
              onChange={onShowForkChange}
            />
          </div>
        </div>

        {/* 归档项目筛选 */}
        <div className={cn('flex items-center justify-between py-2 md:py-0 min-w-0')}>
          <div className={cn('flex items-center gap-2 min-w-0 flex-1')}>
            <ArchiveIcon className={cn('w-3.5 h-3.5 md:w-4 md:h-4 text-gray-500 shrink-0')} />
            <span className={cn('text-xs md:text-sm font-medium text-gray-700 truncate')}>{t('showArchived')}</span>
          </div>
          <div className={cn('shrink-0 ml-2')}>
            <ArchivedFilter
              value={showArchived}
              onChange={onShowArchivedChange}
            />
          </div>
        </div>

        {/* Star排序 */}
        <div className={cn('flex items-center justify-between py-2 md:py-0 min-w-0')}>
          <div className={cn('flex items-center gap-2 min-w-0 flex-1')}>
            <StarIcon className={cn('w-3.5 h-3.5 md:w-4 md:h-4 text-amber-500 shrink-0')} />
            <span className={cn('text-xs md:text-sm font-medium text-gray-700 truncate')}>{t('starSort')}</span>
          </div>
          <div className={cn('shrink-0 ml-2')}>
            <SortFilter
              value={starSort}
              onChange={onStarSortChange}
            />
          </div>
        </div>

        {/* Fork排序 */}
        <div className={cn('flex items-center justify-between py-2 md:py-0 min-w-0')}>
          <div className={cn('flex items-center gap-2 min-w-0 flex-1')}>
            <ForkIcon className={cn('w-3.5 h-3.5 md:w-4 md:h-4 text-indigo-500 shrink-0')} />
            <span className={cn('text-xs md:text-sm font-medium text-gray-700 truncate')}>{t('forkSort')}</span>
          </div>
          <div className={cn('shrink-0 ml-2')}>
            <SortFilter
              value={forkSort}
              onChange={onForkSortChange}
            />
          </div>
        </div>

        {/* 推荐度排序 */}
        <div className={cn('flex items-center justify-between py-2 md:py-0 min-w-0')}>
          <div className={cn('flex items-center gap-2 min-w-0 flex-1')}>
            <StarFilledIcon className={cn('w-3.5 h-3.5 md:w-4 md:h-4 text-pink-500 shrink-0')} />
            <span className={cn('text-xs md:text-sm font-medium text-gray-700 truncate')}>{t('weightSort')}</span>
          </div>
          <div className={cn('shrink-0 ml-2')}>
            <SortFilter
              value={weightSort}
              onChange={onWeightSortChange}
            />
          </div>
        </div>

        {/* 创建时间排序 */}
        <div className={cn('flex items-center justify-between py-2 md:py-0 min-w-0')}>
          <div className={cn('flex items-center gap-2 min-w-0 flex-1')}>
            <ClockIcon className={cn('w-3.5 h-3.5 md:w-4 md:h-4 text-green-500 shrink-0')} />
            <span className={cn('text-xs md:text-sm font-medium text-gray-700 truncate')}>{t('createTimeSort')}</span>
          </div>
          <div className={cn('shrink-0 ml-2')}>
            <SortFilter
              value={createTimeSort}
              onChange={onCreateTimeSortChange}
            />
          </div>
        </div>

        {/* 更新时间排序 */}
        <div className={cn('flex items-center justify-between py-2 md:py-0 min-w-0')}>
          <div className={cn('flex items-center gap-2 min-w-0 flex-1')}>
            <RefreshIcon className={cn('w-3.5 h-3.5 md:w-4 md:h-4 text-teal-500 shrink-0')} />
            <span className={cn('text-xs md:text-sm font-medium text-gray-700 truncate')}>{t('updateTimeSort')}</span>
          </div>
          <div className={cn('shrink-0 ml-2')}>
            <SortFilter
              value={updateTimeSort}
              onChange={onUpdateTimeSortChange}
            />
          </div>
        </div>

        {/* 推送时间排序 */}
        <div className={cn('flex items-center justify-between py-2 md:py-0 min-w-0')}>
          <div className={cn('flex items-center gap-2 min-w-0 flex-1')}>
            <ClockIcon className={cn('w-3.5 h-3.5 md:w-4 md:h-4 text-cyan-500 shrink-0')} />
            <span className={cn('text-xs md:text-sm font-medium text-gray-700 truncate')}>{t('pushTimeSort')}</span>
          </div>
          <div className={cn('shrink-0 ml-2')}>
            <SortFilter
              value={pushTimeSort}
              onChange={onPushTimeSortChange}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

