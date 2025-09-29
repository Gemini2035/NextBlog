'use client'

import { useTranslations } from 'next-intl'
import { ChevronUpIcon, ChevronDownIcon } from '@/assets/icons'
import { cn } from '@/utils'

interface SortFilterProps {
  value: 'asc' | 'desc' | null
  onChange: (value: 'asc' | 'desc' | null) => void
}

export function SortFilter({ value, onChange }: SortFilterProps) {
  const t = useTranslations('PostFilter')
  
  const handleAscClick = () => {
    if (value === 'asc') {
      // 如果当前是升序，则取消选择
      onChange(null)
    } else {
      // 否则设置为升序
      onChange('asc')
    }
  }

  const handleDescClick = () => {
    if (value === 'desc') {
      // 如果当前是降序，则取消选择
      onChange(null)
    } else {
      // 否则设置为降序
      onChange('desc')
    }
  }

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={handleAscClick}
        className={cn(
          "flex items-center justify-center w-6 h-6 rounded transition-colors",
          value === 'asc'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        )}
        title={value === 'asc' ? t('wordCountAsc') : t('wordCountAsc')}
      >
        <ChevronUpIcon className="w-3 h-3" />
      </button>
      <button
        onClick={handleDescClick}
        className={cn(
          "flex items-center justify-center w-6 h-6 rounded transition-colors",
          value === 'desc'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        )}
        title={value === 'desc' ? t('wordCountDesc') : t('wordCountDesc')}
      >
        <ChevronDownIcon className="w-3 h-3" />
      </button>
    </div>
  )
}
