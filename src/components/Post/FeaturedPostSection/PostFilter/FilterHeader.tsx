'use client'

import { InlineSearch } from './InlineSearch'
import { cn } from '@/utils'

interface FilterHeaderProps {
  title: string
  description: string
  searchValue: string
  onSearchChange: (value: string) => void
  searchPlaceholder: string
}

export function FilterHeader({ 
  title, 
  description, 
  searchValue, 
  onSearchChange, 
  searchPlaceholder 
}: FilterHeaderProps) {
  const handleSearchAreaClick = (e: React.MouseEvent) => {
    // 阻止搜索区域的点击事件冒泡，防止触发折叠
    e.stopPropagation()
  }

  return (
    <div className={cn('flex flex-col md:flex-row md:items-center md:justify-between gap-3')}>
      <div className={cn('shrink-0')}>
        <h2 className={cn('text-sm md:text-base font-semibold text-gray-900')}>{title}</h2>
        <p className={cn('text-xs text-gray-600 hidden md:block')}>{description}</p>
      </div>
      <div onClick={handleSearchAreaClick} className={cn('w-full md:w-auto')}>
        <InlineSearch
          value={searchValue}
          onChange={onSearchChange}
          placeholder={searchPlaceholder}
        />
      </div>
    </div>
  )
}
