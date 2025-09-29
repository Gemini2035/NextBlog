'use client'

import { InlineSearch } from './InlineSearch'

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
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-base font-semibold text-gray-900">{title}</h2>
        <p className="text-xs text-gray-600">{description}</p>
      </div>
      <div onClick={handleSearchAreaClick} className="cursor-pointer">
        <InlineSearch
          value={searchValue}
          onChange={onSearchChange}
          placeholder={searchPlaceholder}
        />
      </div>
    </div>
  )
}
