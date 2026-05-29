'use client'

import { SearchIcon } from '@/assets/icons'
import { useTranslations } from 'next-intl'

interface SearchBarProps {
  onSearchClick: () => void
}

export default function SearchBar({ onSearchClick }: SearchBarProps) {
  const t = useTranslations('Navigation')
  
  return (
    <button
      onClick={onSearchClick}
      className="p-2 rounded-lg text-gray-700 hover:text-gray-800 hover:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 cursor-pointer"
      aria-label={t('search')}
    >
      <SearchIcon className="h-5 w-5" />
    </button>
  )
}
