'use client'

import { SearchIcon } from '@/assets/icons'

interface SearchBarProps {
  onSearchClick: () => void
}

export default function SearchBar({ onSearchClick }: SearchBarProps) {
  // TODO: 接入搜索逻辑
  return (
    <button
      onClick={onSearchClick}
      className="p-2 rounded-lg text-gray-700 hover:text-gray-800 hover:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
      aria-label="搜索"
    >
      <SearchIcon className="h-5 w-5" />
    </button>
  )
}
